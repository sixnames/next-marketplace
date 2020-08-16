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
import {
  attemptSignIn,
  ensureSignedOut,
  attemptSignOut,
  getOperationsConfigs,
} from '../../utils/auth/auth';
import { hash } from 'bcryptjs';
import { UserPaginateInput } from './UserPaginateInput';
import generatePaginationOptions from '../../utils/generatePaginationOptions';
import PaginateType from '../common/PaginateType';
import PayloadType from '../common/PayloadType';
import { DocumentType } from '@typegoose/typegoose';
import { ROLE_SLUG_GUEST } from '../../config';
import getApiMessage from '../../utils/translations/getApiMessage';
import { Role, RoleModel } from '../../entities/Role';
import {
  createUserSchema,
  signInValidationSchema,
  signUpValidationSchema,
  updateUserSchema,
} from '../../validation/userSchema';
import {
  CustomFilter,
  Localization,
  LocalizationPayloadInterface,
  SessionUserId,
} from '../../decorators/parameterDecorators';
import { AuthMethod, ValidateMethod } from '../../decorators/methodDecorators';
import { FilterQuery } from 'mongoose';

const {
  operationConfigCreate,
  operationConfigRead,
  operationConfigUpdate,
  operationConfigDelete,
} = getOperationsConfigs(User.name);

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
  async me(@SessionUserId() sessionUserId: string) {
    return UserModel.findById(sessionUserId);
  }

  @Query(() => User, { nullable: true })
  @AuthMethod(operationConfigRead)
  async getUser(
    @CustomFilter(operationConfigRead) customFilter: FilterQuery<User>,
    @Arg('id', (_type) => ID) id: string,
  ): Promise<User | null> {
    return UserModel.findOne({ _id: id, ...customFilter });
  }

  @Query(() => PaginatedUsersResponse)
  @AuthMethod(operationConfigRead)
  async getAllUsers(
    @CustomFilter(operationConfigRead) customFilter: FilterQuery<User>,
    @Arg('input') input: UserPaginateInput,
  ): Promise<PaginatedUsersResponse> {
    const { limit = 100, page = 1, search, sortBy = 'createdAt', sortDir = 'desc' } = input;
    const { searchOptions, options } = generatePaginationOptions({
      limit,
      page,
      sortDir,
      sortBy,
      search,
    });

    return UserModel.paginate({ ...searchOptions, ...customFilter }, options);
  }

  @Mutation(() => UserPayloadType)
  @AuthMethod(operationConfigCreate)
  @ValidateMethod({
    schema: createUserSchema,
  })
  async createUser(
    @Localization() { lang }: LocalizationPayloadInterface,
    @Arg('input') input: CreateUserInput,
  ): Promise<UserPayloadType> {
    try {
      const exists = await UserModel.exists({ email: input.email });
      if (exists) {
        return {
          success: false,
          message: await getApiMessage({ key: `users.create.duplicate`, lang }),
        };
      }

      const password = generator.generate({
        length: 10,
        numbers: true,
      });
      const { role, ...values } = input;
      const user = await UserModel.create({
        ...values,
        itemId: '1',
        password,
        role,
      });

      if (!user) {
        return {
          success: false,
          message: await getApiMessage({ key: `users.create.error`, lang }),
        };
      }

      return {
        success: true,
        message: await getApiMessage({ key: `users.create.success`, lang }),
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
  @AuthMethod(operationConfigUpdate)
  @ValidateMethod({
    schema: updateUserSchema,
  })
  async updateUser(
    @Localization() { lang }: LocalizationPayloadInterface,
    @Arg('input') input: UpdateUserInput,
    @CustomFilter(operationConfigUpdate) customFilter: FilterQuery<User>,
  ) {
    try {
      const { id, ...values } = input;

      const exists = await UserModel.exists({ _id: { $ne: id }, email: input.email });
      if (exists) {
        return {
          success: false,
          message: await getApiMessage({ key: `users.update.duplicate`, lang }),
        };
      }

      const user = await UserModel.findOneAndUpdate({ _id: id, ...customFilter }, values, {
        new: true,
      });

      if (!user) {
        return {
          success: false,
          message: await getApiMessage({ key: `users.update.error`, lang }),
        };
      }

      return {
        success: true,
        message: await getApiMessage({ key: `users.update.success`, lang }),
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
  @AuthMethod(operationConfigDelete)
  async deleteUser(
    @Localization() { lang }: LocalizationPayloadInterface,
    @Arg('id', (_type) => ID) id: string,
  ) {
    try {
      const user = await UserModel.findByIdAndDelete(id);

      if (!user) {
        return {
          success: false,
          message: await getApiMessage({ key: `users.delete.error`, lang }),
        };
      }

      return {
        success: true,
        message: await getApiMessage({ key: `users.delete.success`, lang }),
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  @Mutation(() => UserPayloadType)
  @ValidateMethod({
    schema: signUpValidationSchema,
  })
  async signUp(
    @Localization() { lang }: LocalizationPayloadInterface,
    @Arg('input') input: SignUpInput,
  ) {
    try {
      const exists = await UserModel.exists({ email: input.email });
      if (exists) {
        return {
          success: false,
          message: await getApiMessage({ key: `users.create.duplicate`, lang }),
        };
      }

      const password = await hash(input.password, 10);
      let guestRoleId = ROLE_SLUG_GUEST;
      const guestRole = await RoleModel.findOne({ slug: ROLE_SLUG_GUEST });
      if (guestRole) {
        guestRoleId = guestRole.id;
      }

      const user = await UserModel.create({
        ...input,
        itemId: '1',
        password,
        role: guestRoleId,
      });

      if (!user) {
        return {
          success: false,
          message: await getApiMessage({ key: `users.create.error`, lang }),
        };
      }

      // TODO send email confirmation

      return {
        success: true,
        message: await getApiMessage({ key: `users.create.success`, lang }),
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
  @ValidateMethod({
    schema: signInValidationSchema,
  })
  async signIn(
    @Ctx() ctx: ContextInterface,
    @Localization() { lang }: LocalizationPayloadInterface,
    @Arg('input') input: SignInInput,
  ) {
    try {
      const isSignedOut = ensureSignedOut(ctx.req);

      if (!isSignedOut) {
        return {
          success: false,
          message: await getApiMessage({ key: `users.signIn.authorized`, lang }),
        };
      }

      const { user, message } = await attemptSignIn(input.email, input.password, lang);

      if (!user) {
        return {
          success: false,
          message,
        };
      }

      const userRole = await RoleModel.findById(user.role);

      ctx.req.session!.user = user;
      ctx.req.session!.userId = user.id;
      ctx.req.session!.roleId = userRole ? userRole._id : null;
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
  async signOut(
    @Ctx() ctx: ContextInterface,
    @Localization() { lang }: LocalizationPayloadInterface,
  ) {
    try {
      const isSignedOut = await attemptSignOut(ctx.req);

      if (!isSignedOut) {
        return {
          success: false,
          message: await getApiMessage({ key: `users.signOut.error`, lang }),
        };
      }
      return {
        success: true,
        message: await getApiMessage({ key: `users.signOut.success`, lang }),
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
  async role(@Root() user: DocumentType<User>): Promise<Role> {
    const role = await RoleModel.findById(user.role);
    if (!role) {
      throw new Error('Role not found');
    }
    return role;
  }
}
