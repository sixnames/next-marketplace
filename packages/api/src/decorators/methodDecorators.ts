import { createMethodDecorator, MiddlewareFn } from 'type-graphql';
import { ContextInterface } from '../types/context';
import getMessagesByKeys from '../utils/translations/getMessagesByKeys';
import { Role, RoleModel } from '../entities/Role';
import { RoleRule, RoleRuleModel, RoleRuleOperationModel } from '../entities/RoleRule';
import { User } from '../entities/User';
import {
  MessageKey,
  MultiLangSchemaMessagesInterface,
  NotRequiredArraySchema,
  ObjectSchema,
  ROLE_SLUG_ADMIN,
  ROLE_SLUG_GUEST,
} from '@yagu/shared';

export const getSessionRole = async (user?: User | null): Promise<Role> => {
  if (user) {
    let userRole = await RoleModel.findOne({ _id: user.role });
    if (!userRole) {
      userRole = await RoleModel.findOne({ slug: ROLE_SLUG_GUEST });
    }

    if (!userRole) {
      throw Error('Guest role not found for request user');
    }

    return userRole;
  } else {
    const guestRole = await RoleModel.findOne({ slug: ROLE_SLUG_GUEST });
    if (!guestRole) {
      throw Error('Guest role not found');
    }

    return guestRole;
  }
};

interface GetSessionRoleRulesPayloadInterface {
  role: Role;
  roleRules: RoleRule[];
}

export const getSessionRoleRules = async (
  user?: User | null,
): Promise<GetSessionRoleRulesPayloadInterface> => {
  const roleRuleOperationsPopulate = {
    path: 'operations',
    model: RoleRuleOperationModel,
    options: {
      sort: {
        order: 1,
      },
    },
  };

  const role = await getSessionRole(user);
  const roleRules = await RoleRuleModel.find({
    roleId: role.id,
  }).populate(roleRuleOperationsPopulate);

  return {
    role,
    roleRules,
  };
};

export const AuthField: MiddlewareFn<ContextInterface> = async ({ info, context }, next) => {
  const excludedParentTypes = ['Query', 'Mutation'];
  const { fieldName, parentType } = info;
  if (excludedParentTypes.includes(`${parentType}`)) {
    return next();
  }
  const user = context.getUser();
  const { roleRules } = await getSessionRoleRules(user);
  const currentRule = roleRules.find(({ entity }) => entity === `${parentType}`);

  if (!currentRule) {
    return next();
  }

  const isRestricted = currentRule.restrictedFields.includes(fieldName);
  if (isRestricted) {
    throw Error(`Access denied! You don't have permission to field ${fieldName}.`);
  }

  return next();
};

export type DecoratorOperationType = 'create' | 'read' | 'update' | 'delete';

export interface AuthDecoratorConfigInterface {
  entity: string;
  operationType: DecoratorOperationType;
}
export function AuthMethod(operationConfig: AuthDecoratorConfigInterface) {
  return createMethodDecorator<ContextInterface>(async ({ context, info }, next) => {
    const { fieldName } = info;
    const user = context.getUser();
    const { role, roleRules } = await getSessionRoleRules(user);

    if (role.slug === ROLE_SLUG_ADMIN) {
      return next();
    }

    const currentRule = roleRules.find(({ entity }) => entity === operationConfig.entity);

    if (!currentRule) {
      return next();
    }

    const currentOperation: any | undefined = currentRule.operations.find(
      ({ operationType }: any) => operationType === operationConfig.operationType,
    );

    if (!currentOperation) {
      return next();
    }

    if (!currentOperation.allow) {
      throw Error(`Access denied! You don't have permission for ${fieldName} action.`);
    }

    return next();
  });
}

export interface ValidateMethodConfigInterface {
  messages?: MessageKey[];
  schema: (
    args: MultiLangSchemaMessagesInterface,
  ) => ObjectSchema<any> | NotRequiredArraySchema<any>;
}
export function ValidateMethod(validationConfig: ValidateMethodConfigInterface) {
  return createMethodDecorator<ContextInterface>(async ({ args, context }, next) => {
    const { messages = [], schema } = validationConfig;
    const { lang, defaultLang } = context.req;
    const apiMessages = await getMessagesByKeys(messages);
    const validationSchema = schema({ messages: apiMessages, defaultLang, lang });
    await validationSchema.validate(args.input);

    return next();
  });
}
