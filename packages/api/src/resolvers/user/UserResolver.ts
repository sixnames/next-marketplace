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
import { UpdateMyProfileInput } from './UpdateMyProfileInput';
import { UpdateMyPasswordInput } from './UpdateMyPasswordInput';
import { SignUpInput } from './SignUpInput';
import { SignInInput } from './SignInInput';
import { ContextInterface } from '../../types/context';
import { compare, hash } from 'bcryptjs';
import { UserPaginateInput } from './UserPaginateInput';
import PaginateType from '../common/PaginateType';
import PayloadType from '../common/PayloadType';
import { DocumentType } from '@typegoose/typegoose';
import { ROLE_SLUG_GUEST } from '@yagu/config';
import { Role, RoleModel } from '../../entities/Role';
import {
  createUserSchema,
  signInValidationSchema,
  signUpValidationSchema,
  updateMyPasswordSchema,
  updateMyProfileSchema,
  updateUserSchema,
} from '@yagu/validation';
import {
  CustomFilter,
  Localization,
  LocalizationPayloadInterface,
  SessionUserId,
} from '../../decorators/parameterDecorators';
import { AuthMethod, ValidateMethod } from '../../decorators/methodDecorators';
import { FilterQuery } from 'mongoose';
import { RoleRuleModel } from '../../entities/RoleRule';
import { noNaN } from '@yagu/client/utils/noNaN';

const {
  operationConfigCreate,
  operationConfigRead,
  operationConfigUpdate,
  operationConfigDelete,
} = RoleRuleModel.getOperationsConfigs(User.name);

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
  async me(@SessionUserId() sessionUserId: string): Promise<User | null> {
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
    @Arg('input', { nullable: true, defaultValue: {} }) input: UserPaginateInput,
  ): Promise<PaginatedUsersResponse> {
    const { limit = 100, page = 1, search, sortBy = 'createdAt', sortDir = 'desc' } = input;

    const searchOptions = search
      ? {
          $or: [
            {
              email: search,
            },
            {
              name: search,
            },
            {
              lastName: search,
            },
            {
              secondName: search,
            },
            {
              phone: search,
            },
            {
              itemId: noNaN(search),
            },
          ],
        }
      : {};

    return UserModel.paginate(
      { ...searchOptions, ...customFilter },
      {
        limit,
        page,
        sort: `${sortBy} ${sortDir}`,
      },
    );
  }

  @Mutation(() => UserPayloadType)
  @AuthMethod(operationConfigCreate)
  @ValidateMethod({
    schema: createUserSchema,
  })
  async createUser(
    @Localization() { getApiMessage }: LocalizationPayloadInterface,
    @Arg('input') input: CreateUserInput,
  ): Promise<UserPayloadType> {
    try {
      const exists = await UserModel.exists({ email: input.email });
      if (exists) {
        return {
          success: false,
          message: await getApiMessage(`users.create.duplicate`),
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
        role,
      });

      if (!user) {
        return {
          success: false,
          message: await getApiMessage(`users.create.error`),
        };
      }

      return {
        success: true,
        message: await getApiMessage(`users.create.success`),
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
    @Localization() { getApiMessage }: LocalizationPayloadInterface,
    @Arg('input') input: UpdateUserInput,
    @CustomFilter(operationConfigUpdate) customFilter: FilterQuery<User>,
  ): Promise<UserPayloadType> {
    try {
      const { id, ...values } = input;

      const exists = await UserModel.exists({ _id: { $ne: id }, email: input.email });
      if (exists) {
        return {
          success: false,
          message: await getApiMessage(`users.update.duplicate`),
        };
      }

      const user = await UserModel.findOneAndUpdate({ _id: id, ...customFilter }, values, {
        new: true,
      });

      if (!user) {
        return {
          success: false,
          message: await getApiMessage(`users.update.error`),
        };
      }

      return {
        success: true,
        message: await getApiMessage(`users.update.success`),
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
    schema: updateMyProfileSchema,
  })
  async updateMyProfile(
    @Localization() { getApiMessage }: LocalizationPayloadInterface,
    @Arg('input') input: UpdateMyProfileInput,
    @SessionUserId() sessionUserId: string,
  ): Promise<UserPayloadType> {
    try {
      const { id, ...values } = input;

      if (id !== sessionUserId) {
        return {
          success: false,
          message: await getApiMessage(`users.update.error`),
        };
      }

      const exists = await UserModel.exists({ _id: { $ne: id }, email: input.email });
      if (exists) {
        return {
          success: false,
          message: await getApiMessage(`users.update.duplicate`),
        };
      }

      const user = await UserModel.findOneAndUpdate({ _id: id }, values, {
        new: true,
      });

      if (!user) {
        return {
          success: false,
          message: await getApiMessage(`users.update.error`),
        };
      }

      return {
        success: true,
        message: await getApiMessage(`users.update.success`),
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
    schema: updateMyPasswordSchema,
  })
  async updateMyPassword(
    @Localization() { getApiMessage }: LocalizationPayloadInterface,
    @Arg('input') input: UpdateMyPasswordInput,
    @SessionUserId() sessionUserId: string,
  ): Promise<UserPayloadType> {
    try {
      const { id, oldPassword, newPassword } = input;

      if (id !== sessionUserId) {
        return {
          success: false,
          message: await getApiMessage(`users.update.error`),
        };
      }

      const user = await UserModel.findById(id);
      if (!user) {
        return {
          success: false,
          message: await getApiMessage(`users.update.error`),
        };
      }

      const matches = await compare(oldPassword, user.password);
      if (!matches) {
        return {
          success: false,
          message: await getApiMessage(`users.update.error`),
        };
      }

      const password = await hash(newPassword, 10);
      const updatedUser = await UserModel.findOneAndUpdate(
        { _id: user.id },
        {
          password,
        },
        { new: true },
      );
      if (!updatedUser) {
        return {
          success: false,
          message: await getApiMessage(`users.update.error`),
        };
      }

      // TODO send email confirmation

      return {
        success: true,
        message: await getApiMessage(`users.update.passwordSuccess`),
        user: updatedUser,
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
    @Localization() { getApiMessage }: LocalizationPayloadInterface,
    @Arg('id', (_type) => ID) id: string,
  ): Promise<UserPayloadType> {
    try {
      const user = await UserModel.findByIdAndDelete(id);

      if (!user) {
        return {
          success: false,
          message: await getApiMessage(`users.delete.error`),
        };
      }

      return {
        success: true,
        message: await getApiMessage(`users.delete.success`),
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
    @Localization() { getApiMessage }: LocalizationPayloadInterface,
    @Arg('input') input: SignUpInput,
  ): Promise<UserPayloadType> {
    try {
      const exists = await UserModel.exists({ email: input.email });
      if (exists) {
        return {
          success: false,
          message: await getApiMessage(`users.create.duplicate`),
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
        password,
        role: guestRoleId,
      });

      if (!user) {
        return {
          success: false,
          message: await getApiMessage(`users.create.error`),
        };
      }

      // TODO send email confirmation

      return {
        success: true,
        message: await getApiMessage(`users.create.success`),
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
    @Localization() { getApiMessage, lang }: LocalizationPayloadInterface,
    @Arg('input') input: SignInInput,
  ): Promise<UserPayloadType> {
    try {
      const isSignedOut = UserModel.ensureSignedOut(ctx.req);

      if (!isSignedOut) {
        return {
          success: false,
          message: await getApiMessage(`users.signIn.authorized`),
        };
      }

      const { user, message } = await UserModel.attemptSignIn(input.email, input.password, lang);

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
    @Localization() { getApiMessage }: LocalizationPayloadInterface,
  ): Promise<UserPayloadType> {
    try {
      const isSignedOut = await UserModel.attemptSignOut(ctx.req);

      if (!isSignedOut) {
        return {
          success: false,
          message: await getApiMessage(`users.signOut.error`),
        };
      }
      return {
        success: true,
        message: await getApiMessage(`users.signOut.success`),
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
