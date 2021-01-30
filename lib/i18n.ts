import { DEFAULT_CITY, DEFAULT_LOCALE, SECONDARY_LOCALE } from 'config/common';
import { noNaN } from 'lib/numbers';

export function getI18nLocaleValue<T>(i18nField: Record<string, T>, locale: string): T {
  let translation: T = i18nField[locale];

  // Get fallback language if chosen not found
  if (!translation) {
    translation = i18nField[SECONDARY_LOCALE];
  }

  // Get default language if fallback not found
  if (!translation) {
    translation = i18nField[DEFAULT_LOCALE];
  }

  return translation;
}

export function getCityFieldData<T>(cityField: Record<string, T>, city: string): T {
  let fieldData: T = cityField[city];

  // Get default city data if chosen not found
  if (!fieldData) {
    fieldData = cityField[DEFAULT_CITY];
  }

  return fieldData;
}

export interface GetCurrencyStringInterface {
  locale: string;
  value?: number | string | null;
}

export const getCurrencyString = ({ locale, value }: GetCurrencyStringInterface): string => {
  return new Intl.NumberFormat(locale).format(noNaN(value)).replace(',', ' ');
};
