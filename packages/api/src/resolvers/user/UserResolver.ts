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
import { getMessageTranslation } from '../../config/translations';

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
  async createUser(
    @Ctx() ctx: ContextInterface,
    @Arg('input') input: CreateUserInput,
  ): Promise<UserPayloadType> {
    try {
      await createUserSchema.validate(input);

      const lang = ctx.req.session!.lang;
      const exists = await UserModel.exists({ email: input.email });
      if (exists) {
        return {
          success: false,
          message: getMessageTranslation(`user.create.duplicate.${lang}`),
        };
      }

      const password = generator.generate({
        length: 10,
        numbers: true,
      });
      const { role, ...values } = input;
      const user = await UserModel.create({
        ...values,
        password,
        role: role || ROLE_CUSTOMER,
      });

      if (!user) {
        return {
          success: false,
          message: getMessageTranslation(`user.create.error.${lang}`),
        };
      }

      return {
        success: true,
        message: getMessageTranslation(`user.create.success.${lang}`),
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
  async updateUser(@Ctx() ctx: ContextInterface, @Arg('input') input: UpdateUserInput) {
    try {
      await updateUserSchema.validate(input);
      const lang = ctx.req.session!.lang;

      const { id, ...values } = input;
      const user = await UserModel.findByIdAndUpdate(id, values, { new: true });
      const exists = await UserModel.exists({ _id: { $ne: id }, email: input.email });
      if (exists) {
        return {
          success: false,
          message: getMessageTranslation(`user.update.duplicate.${lang}`),
        };
      }

      if (!user) {
        return {
          success: false,
          message: getMessageTranslation(`user.update.error.${lang}`),
        };
      }

      return {
        success: true,
        message: getMessageTranslation(`user.update.success.${lang}`),
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
  async deleteUser(@Ctx() ctx: ContextInterface, @Arg('id', (_type) => ID) id: string) {
    try {
      const lang = ctx.req.session!.lang;
      const user = await UserModel.findByIdAndDelete(id);

      if (!user) {
        return {
          success: false,
          message: getMessageTranslation(`user.delete.error.${lang}`),
        };
      }

      return {
        success: true,
        message: getMessageTranslation(`user.delete.success.${lang}`),
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  @Mutation(() => UserPayloadType)
  async signUp(@Ctx() ctx: ContextInterface, @Arg('input') input: SignUpInput) {
    try {
      await signUpValidationSchema.validate(input);
      const lang = ctx.req.session!.lang;

      const exists = await UserModel.exists({ email: input.email });
      if (exists) {
        return {
          success: false,
          message: getMessageTranslation(`user.create.duplicate.${lang}`),
        };
      }

      const password = await hash(input.password, 10);

      const user = await UserModel.create({
        ...input,
        password,
        role: ROLE_CUSTOMER,
      });

      if (!user) {
        return {
          success: false,
          message: getMessageTranslation(`user.create.error.${lang}`),
        };
      }

      // TODO [Slava] send email confirmation

      return {
        success: true,
        message: getMessageTranslation(`user.create.success.${lang}`),
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
  async signIn(@Ctx() ctx: ContextInterface, @Arg('input') input: SignInInput) {
    try {
      await signInValidationSchema.validate(input);
      const lang = ctx.req.session!.lang;

      const isSignedOut = ensureSignedOut(ctx.req);

      if (!isSignedOut) {
        return {
          success: false,
          message: getMessageTranslation(`user.signIn.authorized.${lang}`),
        };
      }

      const { user, message } = await attemptSignIn(input.email, input.password, lang);

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
      const lang = ctx.req.session!.lang;

      if (!isSignedOut) {
        return {
          success: false,
          message: getMessageTranslation(`user.signOut.notAuthorized.error.${lang}`),
        };
      }
      return {
        success: true,
        message: getMessageTranslation(`user.signOut.notAuthorized.success.${lang}`),
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
