import { arg, inputObjectType, mutationType, nonNull, objectType, queryType } from 'nexus';
import {
  getRequestParams,
  getResolverValidationSchema,
  getSessionRole,
  getSessionUser,
} from 'lib/sessionHelpers';
import { getDatabase } from 'db/mongodb';
import {
  CompanyModel,
  FormattedPhoneModel,
  OrderModel,
  OrdersPaginationPayloadModel,
  RoleModel,
  UserModel,
  UserPayloadModel,
  UsersPaginationPayloadModel,
} from 'db/dbModels';
import { COL_COMPANIES, COL_ORDERS, COL_ROLES, COL_USERS } from 'db/collectionNames';
import { ROLE_SLUG_COMPANY_MANAGER, ROLE_SLUG_COMPANY_OWNER, ROLE_SLUG_GUEST } from 'config/common';
import { getFullName, getShortName } from 'lib/nameUtils';
import { phoneToRaw, phoneToReadable } from 'lib/phoneUtils';
import { aggregatePagination } from 'db/aggregatePagination';
import { noNaN } from 'lib/numbers';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import generator from 'generate-password';
import { compare, hash } from 'bcryptjs';
import { getNextItemId } from 'lib/itemIdUtils';
import { sendPasswordUpdatedEmail } from 'emails/passwordUpdatedEmail';
import { signUpEmail } from 'emails/signUpEmail';
import {
  createUserSchema,
  signUpSchema,
  updateMyPasswordSchema,
  updateMyProfileSchema,
  updateUserSchema,
} from 'validation/userSchema';

// User type
export const User = objectType({
  name: 'User',
  definition(t) {
    t.implements('Base');
    t.implements('Timestamp');
    t.nonNull.string('name');
    t.string('lastName');
    t.string('secondName');
    t.nonNull.email('email');
    t.nonNull.phone('phone');
    t.nonNull.objectId('roleId');

    // User fullName field resolver
    t.nonNull.field('fullName', {
      type: 'String',
      resolve: (source): string => {
        return getFullName(source);
      },
    });

    // User shortName field resolver
    t.nonNull.field('shortName', {
      type: 'String',
      resolve: (source): string => {
        return getShortName(source);
      },
    });

    // User formattedPhone field resolver
    t.nonNull.field('formattedPhone', {
      type: 'FormattedPhone',
      resolve: (source): FormattedPhoneModel => {
        try {
          return {
            raw: phoneToRaw(source.phone),
            readable: phoneToReadable(source.phone),
          };
        } catch (e) {
          console.log(e);
          return {
            raw: '',
            readable: '',
          };
        }
      },
    });

    // User Role field resolver
    t.nonNull.field('role', {
      type: 'Role',
      resolve: async (source): Promise<RoleModel> => {
        const db = await getDatabase();
        const rolesCollection = db.collection<RoleModel>(COL_ROLES);
        const role = await rolesCollection.findOne({ _id: source.roleId });
        if (!role) {
          console.log('User role not found. Assigning Guest role');
          const guestRole = await rolesCollection.findOne({ slug: ROLE_SLUG_GUEST });
          if (!guestRole) {
            throw Error('Guest role not found in User.role resolver');
          }
          return guestRole;
        }
        return role;
      },
    });

    // User order field resolver
    t.nonNull.field('orders', {
      type: 'OrdersPaginationPayload',
      args: {
        input: arg({
          type: 'PaginationInput',
        }),
      },
      resolve: async (source, args, context): Promise<OrdersPaginationPayloadModel> => {
        const { city } = await getRequestParams(context);
        const paginationResult = await aggregatePagination<OrderModel>({
          pipeline: [{ $match: { _id: { $in: source.ordersIds } } }],
          collectionName: COL_ORDERS,
          input: args.input,
          city,
        });
        return paginationResult;
      },
    });
  },
});

export const UsersPaginationPayload = objectType({
  name: 'UsersPaginationPayload',
  definition(t) {
    t.implements('PaginationPayload');
    t.nonNull.list.nonNull.field('docs', {
      type: 'User',
    });
  },
});

// User Queries
export const UserQuery = queryType({
  definition(t) {
    // Should return session user if authenticated
    t.nullable.field('me', {
      type: 'User',
      description: 'Should return session user if authenticated',
      resolve: async (_source, _args, context): Promise<UserModel | null> => {
        return getSessionUser(context);
      },
    });

    // Should return user by _id
    t.nonNull.field('getUser', {
      type: 'User',
      description: 'Should return user by _id',
      args: {
        _id: nonNull(
          arg({
            type: 'ObjectId',
          }),
        ),
      },
      resolve: async (_source, args): Promise<UserModel> => {
        const db = await getDatabase();
        const collection = db.collection<UserModel>(COL_USERS);
        const user = await collection.findOne({ _id: args._id });
        if (!user) {
          throw Error('User not found by given id');
        }
        return user;
      },
    });

    // Should return paginated users
    t.nonNull.field('getAllUsers', {
      type: 'UsersPaginationPayload',
      description: 'Should return paginated users',
      args: {
        input: arg({
          type: 'PaginationInput',
        }),
      },
      resolve: async (_source, args, context): Promise<UsersPaginationPayloadModel> => {
        const { city } = await getRequestParams(context);
        const { input } = args;
        const { search } = input || { search: null };

        const searchPipeline = search
          ? [
              {
                $match: {
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
                },
              },
            ]
          : [];

        const paginationResult = await aggregatePagination<UserModel>({
          input: args.input,
          collectionName: COL_USERS,
          pipeline: searchPipeline,
          city,
        });
        return paginationResult;
      },
    });

    // Should return user company
    t.field('getUserCompany', {
      type: 'Company',
      description: 'Should return user company',
      resolve: async (_source, _args, context): Promise<CompanyModel | null> => {
        try {
          const db = await getDatabase();
          const companiesCollection = db.collection<CompanyModel>(COL_COMPANIES);
          const { user, role } = await getSessionRole(context);

          if (user && role.slug === ROLE_SLUG_COMPANY_OWNER) {
            const company = await companiesCollection.findOne({ ownerId: user._id });
            return company;
          }

          if (user && role.slug === ROLE_SLUG_COMPANY_MANAGER) {
            const company = await companiesCollection.findOne({ staffIds: user._id });
            return company;
          }

          return null;
        } catch (e) {
          console.log(e);
          return null;
        }
      },
    });
  },
});

export const UserPayload = objectType({
  name: 'UserPayload',
  definition(t) {
    t.implements('Payload');
    t.field('payload', {
      type: 'User',
    });
  },
});

export const CreateUserInput = inputObjectType({
  name: 'CreateUserInput',
  definition(t) {
    t.nonNull.string('name');
    t.string('lastName');
    t.string('secondName');
    t.nonNull.email('email');
    t.nonNull.phone('phone');
    t.nonNull.objectId('roleId');
  },
});

export const UpdateUserInput = inputObjectType({
  name: 'UpdateUserInput',
  definition(t) {
    t.nonNull.objectId('userId');
    t.nonNull.string('name');
    t.string('lastName');
    t.string('secondName');
    t.nonNull.email('email');
    t.nonNull.phone('phone');
    t.nonNull.objectId('roleId');
  },
});

export const UpdateMyProfileInput = inputObjectType({
  name: 'UpdateMyProfileInput',
  definition(t) {
    t.nonNull.string('name');
    t.string('lastName');
    t.string('secondName');
    t.nonNull.email('email');
    t.nonNull.phone('phone');
  },
});

export const SignUpInput = inputObjectType({
  name: 'SignUpInput',
  definition(t) {
    t.nonNull.string('name');
    t.string('lastName');
    t.string('secondName');
    t.nonNull.email('email');
    t.nonNull.phone('phone');
    t.nonNull.string('password');
  },
});

export const UpdateMyPasswordInput = inputObjectType({
  name: 'UpdateMyPasswordInput',
  definition(t) {
    t.nonNull.string('oldPassword');
    t.nonNull.string('newPassword');
    t.nonNull.string('newPasswordB');
  },
});

// User Mutations
export const UserMutations = mutationType({
  definition(t) {
    // Should create user
    t.nonNull.field('createUser', {
      type: 'UserPayload',
      description: 'Should create user',
      args: {
        input: nonNull(
          arg({
            type: 'CreateUserInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<UserPayloadModel> => {
        try {
          // Validate
          const validationSchema = await getResolverValidationSchema({
            context,
            schema: createUserSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
          const usersCollection = db.collection<UserModel>(COL_USERS);
          const { input } = args;

          // Check if user already exist
          const exist = await usersCollection.findOne({
            $or: [{ email: input.email }, { phone: input.phone }],
          });
          if (exist) {
            return {
              success: false,
              message: await getApiMessage('users.create.duplicate'),
            };
          }

          // Create password for user
          const newPassword = generator.generate({
            length: 10,
            numbers: true,
          });
          const password = await hash(newPassword, 10);

          // Create user
          const itemId = await getNextItemId(COL_USERS);
          const createdUserResult = await usersCollection.insertOne({
            ...input,
            phone: phoneToRaw(input.phone),
            itemId,
            password,

            ordersIds: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          const createdUser = createdUserResult.ops[0];
          if (!createdUserResult.result.ok || !createdUser) {
            return {
              success: false,
              message: await getApiMessage('users.create.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('users.create.success'),
            payload: createdUser,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should update user
    t.nonNull.field('updateUser', {
      type: 'UserPayload',
      description: 'Should update user',
      args: {
        input: nonNull(
          arg({
            type: 'UpdateUserInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<UserPayloadModel> => {
        try {
          // Validate
          const validationSchema = await getResolverValidationSchema({
            context,
            schema: updateUserSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
          const usersCollection = db.collection<UserModel>(COL_USERS);
          const { input } = args;
          const { userId, ...values } = input;

          // Check if user already exist
          const exist = await usersCollection.findOne({
            _id: { $ne: userId },
            $or: [{ email: input.email }, { phone: input.phone }],
          });
          if (exist) {
            return {
              success: false,
              message: await getApiMessage('users.update.duplicate'),
            };
          }

          // Update user
          const updatedUserResult = await usersCollection.findOneAndUpdate(
            { _id: userId },
            {
              $set: {
                ...values,
                phone: phoneToRaw(input.phone),
                updatedAt: new Date(),
              },
            },
            { returnOriginal: false },
          );
          const updatedUser = updatedUserResult.value;
          if (!updatedUserResult.ok || !updatedUser) {
            return {
              success: false,
              message: await getApiMessage('users.update.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('users.update.success'),
            payload: updatedUser,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should update session user profile
    t.nonNull.field('updateMyProfile', {
      type: 'UserPayload',
      description: 'Should update session user profile',
      args: {
        input: nonNull(
          arg({
            type: 'UpdateMyProfileInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<UserPayloadModel> => {
        try {
          // Validate
          const validationSchema = await getResolverValidationSchema({
            context,
            schema: updateMyProfileSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const sessionUser = await getSessionUser(context);
          const db = await getDatabase();
          const usersCollection = db.collection<UserModel>(COL_USERS);
          const { input } = args;

          // Check if user is authenticated
          if (!sessionUser) {
            return {
              success: false,
              message: await getApiMessage('users.update.error'),
            };
          }

          // Check if user already exist
          const exist = await usersCollection.findOne({
            _id: { $ne: sessionUser._id },
            $or: [{ email: input.email }, { phone: input.phone }],
          });
          if (exist) {
            return {
              success: false,
              message: await getApiMessage('users.update.duplicate'),
            };
          }

          // Update user
          const updatedUserResult = await usersCollection.findOneAndUpdate(
            { _id: sessionUser._id },
            {
              $set: {
                ...input,
                phone: phoneToRaw(input.phone),
                updatedAt: new Date(),
              },
            },
            { returnOriginal: false },
          );
          const updatedUser = updatedUserResult.value;
          if (!updatedUserResult.ok || !updatedUser) {
            return {
              success: false,
              message: await getApiMessage('users.update.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('users.update.success'),
            payload: updatedUser,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should update session user password
    t.nonNull.field('updateMyPassword', {
      type: 'UserPayload',
      description: 'Should update session user password',
      args: {
        input: nonNull(
          arg({
            type: 'UpdateMyPasswordInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<UserPayloadModel> => {
        try {
          // Validate
          const validationSchema = await getResolverValidationSchema({
            context,
            schema: updateMyPasswordSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const sessionUser = await getSessionUser(context);
          const db = await getDatabase();
          const usersCollection = db.collection<UserModel>(COL_USERS);
          const { input } = args;
          const { oldPassword, newPassword } = input;

          // Check if user is authorised
          if (!sessionUser) {
            return {
              success: false,
              message: await getApiMessage('users.update.error'),
            };
          }

          // Check if old password matches
          const matches = await compare(oldPassword, sessionUser.password);
          if (!matches) {
            return {
              success: false,
              message: await getApiMessage(`users.update.error`),
            };
          }

          // Update user
          const password = await hash(newPassword, 10);
          const updatedUserResult = await usersCollection.findOneAndUpdate(
            { _id: sessionUser._id },
            {
              $set: {
                password,
              },
            },
            { returnOriginal: false },
          );
          const updatedUser = updatedUserResult.value;
          if (!updatedUserResult.ok || !updatedUser) {
            return {
              success: false,
              message: await getApiMessage('users.update.error'),
            };
          }

          // Send email confirmation
          await sendPasswordUpdatedEmail({
            to: updatedUser.email,
            userName: updatedUser.name,
          });

          return {
            success: true,
            message: await getApiMessage('users.update.success'),
            payload: updatedUser,
          };
        } catch (e) {
          console.log(e);
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should sign up user
    t.nonNull.field('signUp', {
      type: 'UserPayload',
      description: 'Should sign up user',
      args: {
        input: nonNull(
          arg({
            type: 'SignUpInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<UserPayloadModel> => {
        try {
          // Validate
          const validationSchema = await getResolverValidationSchema({
            context,
            schema: signUpSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
          const usersCollection = db.collection<UserModel>(COL_USERS);
          const rolesCollection = db.collection<RoleModel>(COL_ROLES);
          const { input } = args;

          // Check if user already exist
          const exist = await usersCollection.findOne({
            $or: [{ email: input.email }, { phone: input.phone }],
          });
          if (exist) {
            return {
              success: false,
              message: await getApiMessage('users.create.duplicate'),
            };
          }

          // Create password for user
          const password = await hash(input.password, 10);
          const guestRole = await rolesCollection.findOne({ slug: ROLE_SLUG_GUEST });
          if (!guestRole) {
            return {
              success: false,
              message: await getApiMessage('users.create.error'),
            };
          }

          // Create user
          const itemId = await getNextItemId(COL_USERS);
          const createdUserResult = await usersCollection.insertOne({
            ...input,
            phone: phoneToRaw(input.phone),
            itemId,
            password,

            ordersIds: [],
            roleId: guestRole._id,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          const createdUser = createdUserResult.ops[0];
          if (!createdUserResult.result.ok || !createdUser) {
            return {
              success: false,
              message: await getApiMessage('users.create.error'),
            };
          }

          // Send user creation email confirmation
          await signUpEmail({
            to: createdUser.email,
            userName: createdUser.name,
          });

          return {
            success: true,
            message: await getApiMessage('users.create.success'),
            payload: createdUser,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });
  },
});
