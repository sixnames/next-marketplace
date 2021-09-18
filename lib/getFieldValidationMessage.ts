import { DEFAULT_LOCALE, SECONDARY_LOCALE } from '../config/common';
import { MessageSlug } from '../types/messageSlugTypes';
import { ValidationSchemaArgsInterface } from '../types/validataionTypes';

export interface GetFieldValidationMessageInterface extends ValidationSchemaArgsInterface {
  slug: MessageSlug;
}

export function getFieldValidationMessage({
  locale,
  messages,
  slug,
}: GetFieldValidationMessageInterface): string {
  const currentMessage = messages.find((message) => message.slug === slug);
  const errorMessage = `${slug} field message not found`;
  if (!currentMessage) {
    return errorMessage;
  }

  const { messageI18n } = currentMessage;

  const currentLocale = messageI18n[locale];
  const defaultLocale = messageI18n[DEFAULT_LOCALE];

  if (!currentLocale && locale !== DEFAULT_LOCALE) {
    const universalLocale = messageI18n[SECONDARY_LOCALE];

    if (!universalLocale) {
      if (!defaultLocale) {
        return errorMessage;
      }

      return defaultLocale;
    }

    return universalLocale;
  }

  if (!currentLocale) {
    if (!defaultLocale) {
      return errorMessage;
    }

    return defaultLocale;
  }

  return currentLocale;
}
