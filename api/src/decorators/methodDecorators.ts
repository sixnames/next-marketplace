import { createMethodDecorator, MiddlewareFn } from 'type-graphql';
import { ContextInterface } from '../types/context';
import { MessageKey } from '../config/apiMessages/messagesKeys';
import { MultiLangSchemaMessagesInterface } from '../validation/getFieldValidationMessage';
import { ObjectSchema } from 'yup';
import getMessagesByKeys from '../utils/translations/getMessagesByKeys';

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

export type DecoratorOperationType = 'create' | 'read' | 'update' | 'delete';

export interface AuthDecoratorConfigInterface {
  entity: string;
  operationType: DecoratorOperationType;
}
export function AuthMethod(operationConfig: AuthDecoratorConfigInterface) {
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

export interface ValidateMethodConfigInterface {
  messages?: MessageKey[];
  schema: (args: MultiLangSchemaMessagesInterface) => ObjectSchema;
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
