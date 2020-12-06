import bcrypt from 'bcryptjs';
import { User, UserModel } from '../entities/User';
import { buildContext, GraphQLLocalStrategy } from 'graphql-passport';
import { RoleRuleModel, RoleRuleOperationModel } from '../entities/RoleRule';
import { RoleModel } from '../entities/Role';
import { ROLE_SLUG_GUEST } from '@yagu/config';
import passport from 'passport';

passport.serializeUser(function (user: User, done) {
  done(null, user);
});

passport.deserializeUser(function (user: User, done) {
  done(null, user);
});

passport.use(
  new GraphQLLocalStrategy((email: any, password: any, done: any) => {
    UserModel.findOne({ email }, (e, user) => {
      if (e || !user) {
        new Error('no matching user');
      }
      const error = user ? null : new Error('no matching user');

      bcrypt.compare(password, `${user?.password}`, (err, success) => {
        if (err || !success) {
          done(error, success);
          return;
        }
        const document = user?.toJSON();
        done(error, {
          id: `${user?._id}`,
          ...document,
        });
      });
    });
  }),
);

export const visitorMiddleware = async (ctx: any) => {
  const context: any = buildContext(ctx);
  // Set request role
  const roleRuleOperationsPopulate = {
    path: 'operations',
    model: RoleRuleOperationModel,
    options: {
      sort: {
        order: 1,
      },
    },
  };

  const user = context.getUser();

  if (user) {
    let userRole = await RoleModel.findOne({ _id: user.role });
    if (!userRole) {
      userRole = await RoleModel.findOne({ slug: ROLE_SLUG_GUEST });
    }

    if (!userRole) {
      throw Error('Guest role not found for request user');
    }

    context.req.role = userRole;
    context.req.roleRules = await RoleRuleModel.find({
      roleId: userRole.id,
    }).populate(roleRuleOperationsPopulate);
  } else {
    const guestRole = await RoleModel.findOne({ slug: ROLE_SLUG_GUEST });
    if (!guestRole) {
      throw Error('Guest role not found');
    }

    context.req.role = guestRole;
    context.req.roleRules = await RoleRuleModel.find({
      roleId: guestRole.id,
    }).populate(roleRuleOperationsPopulate);
  }

  // Final context
  return context;
};

export default passport;
