import { createParamDecorator } from 'type-graphql';
import { ContextInterface } from '../types/context';

export function SessionUser() {
  return createParamDecorator<ContextInterface>(({ context }) => context.req.session!.user);
}

export function SessionUserId() {
  return createParamDecorator<ContextInterface>(({ context }) => context.req.session!.userId);
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
