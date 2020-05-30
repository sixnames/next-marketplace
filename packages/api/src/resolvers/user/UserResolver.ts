import {
  Arg,
  Field,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
  ObjectType,
  Ctx,
  ID,
} from 'type-graphql';
import { User, UserModel } from '../../entities/User';
import { CreateUserInput } from './CreateUserInput';
import generator from 'generate-password';
import getResolverErrorMessage from '../../utils/getResolverErrorMessage';
import { UpdateUserInput } from './UpdateUserInput';
import { SignUpInput } from './SignUpInput';
import { SignInInput } from './SignInInput';
import { ContextInterface } from '../../types/context';
import { attemptSignIn, ensureSignedOut, attemptSignOut } from '../../utils/auth';
import { hash } from 'bcryptjs';
import { UserPaginateInput } from './UserPaginateInput';
import generatePaginationOptions from '../../utils/generatePaginationOptions';
import PaginateType from '../common/PaginateType';
import PayloadType from '../common/PayloadType';
import { ROLE_ADMIN, ROLE_CUSTOMER, ROLE_MANAGER } from '@rg/config';
import {
  signInValidationSchema,
  signUpValidationSchema,
  updateUserSchema,
  createUserSchema,
} from '@rg/validation';
import { DocumentType } from '@typegoose/typegoose';

@ObjectType()
class PaginatedUsersResponse extends PaginateType(User) {}

@ObjectType()
class UserPayloadType extends PayloadType() {
  @Field((_type) => User, { nullable: true })
  user?: User;
}

@Resolver((_of) => User)
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() ctx: ContextInterface) {
    return UserModel.findById(ctx.req.session!.userId);
  }

  @Query(() => User, { nullable: true })
  async getUser(@Arg('id', (_type) => ID) id: string): Promise<User | null> {
    return UserModel.findById(id);
  }

  @Query(() => PaginatedUsersResponse)
  async getAllUsers(@Arg('input') input: UserPaginateInput): Promise<PaginatedUsersResponse> {
    const { limit = 100, page = 1, query, sortBy = 'createdAt', sortDir = 'desc' } = input;
    const { searchOptions, options } = generatePaginationOptions({
      limit,
      page,
      sortDir,
      sortBy,
      query,
    });
    return UserModel.paginate(searchOptions, options);
  }

  @Mutation(() => UserPayloadType)
  async createUser(@Arg('input') input: CreateUserInput): Promise<UserPayloadType> {
    try {
      await createUserSchema.validate(input);

      const exists = await UserModel.exists({ email: input.email });
      if (exists) {
        return {
          success: false,
          message: 'Пользователь с данным Email уже существует.',
        };
      }

      const password = generator.generate({
        length: 10,
        numbers: true,
      });

      const user = await UserModel.create({ ...input, password });

      if (!user) {
        return {
          success: false,
          message: 'Ошибка создания пользователя.',
        };
      }

      return {
        success: true,
        message: 'Пользователь создан.',
        user,
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  @Mutation(() => UserPayloadType)
  async updateUser(@Arg('input') input: UpdateUserInput) {
    try {
      await updateUserSchema.validate(input);

      const { id, ...values } = input;
      const user = await UserModel.findByIdAndUpdate(id, values, { new: true });

      if (!user) {
        return {
          success: false,
          message: 'Пользователь не найден.',
        };
      }

      return {
        success: true,
        message: 'Пользователь изменён.',
        user,
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  @Mutation(() => UserPayloadType)
  async deleteUser(@Arg('id', (_type) => ID) id: string) {
    try {
      const user = await UserModel.findByIdAndDelete(id);

      if (!user) {
        return {
          success: false,
          message: 'Ошибка удаления пользователя.',
        };
      }

      return {
        success: true,
        message: 'Пользователь удалён.',
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  @Mutation(() => UserPayloadType)
  async signUp(@Arg('input') input: SignUpInput) {
    try {
      await signUpValidationSchema.validate(input);

      const password = await hash(input.password, 10);

      const user = await UserModel.create({
        ...input,
        password,
      });

      if (!user) {
        return {
          success: false,
          message: 'Ошибка создания пользователя.',
        };
      }

      // TODO [Slava] send email confirmation

      return {
        success: true,
        message: 'Пользователь создан.',
        user,
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  @Mutation(() => UserPayloadType)
  async signIn(@Arg('input') input: SignInInput, @Ctx() ctx: ContextInterface) {
    try {
      await signInValidationSchema.validate(input);

      const isSignedOut = ensureSignedOut(ctx.req);

      if (!isSignedOut) {
        return {
          success: false,
          message: 'Вы уже авторизованы.',
        };
      }

      const { user, message } = await attemptSignIn(input.email, input.password);

      if (!user) {
        return {
          success: false,
          message,
        };
      }

      ctx.req.session!.userId = user.id;
      ctx.req.session!.userRole = user.role;
      ctx.req.session!.isAdmin = user.role === ROLE_ADMIN;
      ctx.req.session!.isCustomer = user.role === ROLE_CUSTOMER;
      ctx.req.session!.isManager = user.role === ROLE_MANAGER;
      // req.session.cartId = user.cart;

      return {
        success: true,
        message,
        user,
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  @Mutation(() => UserPayloadType)
  async signOut(@Ctx() ctx: ContextInterface) {
    try {
      const isSignedOut = await attemptSignOut(ctx.req);

      if (!isSignedOut) {
        return {
          success: false,
          message: 'Вы не авторизованы.',
        };
      }
      return {
        success: true,
        message: 'Вы вышли из аккаунта.',
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  @FieldResolver()
  fullName(@Root() user: DocumentType<User>): string {
    const { name, lastName, secondName } = user;
    return `${lastName ? `${lastName} ` : ''}${name}${secondName ? ` ${secondName}` : ''}`;
  }

  @FieldResolver()
  shortName(@Root() user: DocumentType<User>): string {
    const { name, lastName } = user;
    if (lastName && lastName.length > 0) {
      return `${name.charAt(0)}.${lastName}`;
    }
    return name;
  }

  @FieldResolver()
  isAdmin(@Ctx() ctx: ContextInterface): boolean {
    return ctx.req.session!.isAdmin;
  }

  @FieldResolver()
  isCustomer(@Ctx() ctx: ContextInterface): boolean {
    return ctx.req.session!.isCustomer;
  }

  @FieldResolver()
  isManager(@Ctx() ctx: ContextInterface): boolean {
    return ctx.req.session!.isManager;
  }
}
