import { createParamDecorator } from 'type-graphql';
import { ContextInterface } from '../types/context';
import { AuthDecoratorConfigInterface } from './methodDecorators';
import { MessageKey, ROLE_SLUG_ADMIN } from '@yagu/config';
import getApiMessage from '../utils/translations/getApiMessage';
import getLangField from '../utils/translations/getLangField';
import { LanguageType } from '../entities/commonEntities';

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
    const { roleRules, session, role } = context.req;
    if (role.slug === ROLE_SLUG_ADMIN) {
      return {};
    }

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
  getApiMessage: (key: MessageKey) => Promise<string>;
  getLangField: (translations: LanguageType[] | null | undefined) => string;
}

export function Localization() {
  return createParamDecorator<ContextInterface>(({ context }) => {
    const { lang, defaultLang, city } = context.req;
    return {
      lang,
      defaultLang,
      city,
      getApiMessage: (key: MessageKey) => getApiMessage({ lang, key }),
      getLangField: (translations: LanguageType[] | null | undefined) => {
        return getLangField(translations, lang);
      },
    };
  });
}
