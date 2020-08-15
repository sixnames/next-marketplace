import { createMethodDecorator, MiddlewareFn } from 'type-graphql';
import { ContextInterface } from '../types/context';

export const AuthField: MiddlewareFn<ContextInterface> = async (
  { info, context: { req } },
  next,
) => {
  const excludedParentTypes = ['Query', 'Mutation'];
  const { fieldName, parentType } = info;
  if (excludedParentTypes.includes(`${parentType}`)) {
    return next();
  }

  const currentRule = req.roleRules.find(({ entity }) => entity === `${parentType}`);

  if (!currentRule) {
    return next();
  }

  const isRestricted = currentRule.restrictedFields.includes(fieldName);
  if (isRestricted) {
    throw Error(`Access denied! You don't have permission to field ${fieldName}.`);
  }

  return next();
};

export interface AuthMethodConfigInterface {
  entity: string;
  operationType: 'create' | 'read' | 'update' | 'delete';
}
export function AuthMethod(operationConfig: AuthMethodConfigInterface) {
  return createMethodDecorator<ContextInterface>(async ({ context: { req }, info }, next) => {
    const { fieldName } = info;
    const currentRule = req.roleRules.find(({ entity }) => entity === operationConfig.entity);

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
