import { createParamDecorator } from 'type-graphql';
import { ContextInterface } from '../types/context';
import { AuthDecoratorConfigInterface } from './methodDecorators';

export function SessionUser() {
  return createParamDecorator<ContextInterface>(({ context }) => {
    return context.req.session!.user;
  });
}

export function SessionUserId() {
  return createParamDecorator<ContextInterface>(({ context }) => {
    return context.req.session!.userId;
  });
}

export function SessionRoleId() {
  return createParamDecorator<ContextInterface>(({ context }) => {
    return context.req.session!.roleId;
  });
}

export function SessionRole() {
  return createParamDecorator<ContextInterface>(async ({ context }) => {
    return context.req.role;
  });
}

export function CustomFilter(operationConfig: AuthDecoratorConfigInterface) {
  return createParamDecorator<ContextInterface>(async ({ context }) => {
    const { roleRules, session } = context.req;
    const currentRule = roleRules.find(({ entity }) => entity === operationConfig.entity);

    if (!currentRule) {
      return {};
    }

    const currentOperation: any | undefined = currentRule.operations.find(
      ({ operationType }: any) => operationType === operationConfig.operationType,
    );

    if (!currentOperation) {
      return {};
    }

    const { customFilter = '{}' } = currentOperation;
    const customFilterResult = customFilter.replace(/__authenticatedUser/gi, `${session!.userId}`);
    return JSON.parse(customFilterResult);
  });
}

export interface LocalizationPayloadInterface {
  lang: string;
  defaultLang: string;
  city: string;
}

export function Localization() {
  return createParamDecorator<ContextInterface>(({ context }) => {
    const { lang, defaultLang, city } = context.req;
    return {
      lang,
      defaultLang,
      city,
    };
  });
}
