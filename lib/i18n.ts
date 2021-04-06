import {
  DEFAULT_CITY,
  DEFAULT_LOCALE,
  LOCALE_NOT_FOUND_FIELD_MESSAGE,
  SECONDARY_LOCALE,
} from 'config/common';
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

export function getFieldStringLocale(
  i18nField?: Record<string, string> | null,
  locale: string | undefined = DEFAULT_LOCALE,
): string {
  if (!i18nField) {
    return '';
  }

  let translation = getI18nLocaleValue<string>(i18nField, locale);

  // Get fallback language if chosen not found
  if (!translation) {
    translation = i18nField[SECONDARY_LOCALE];
  }

  // Get default language if fallback not found
  if (!translation) {
    translation = i18nField[DEFAULT_LOCALE];
  }

  // Set warning massage if fallback language not found
  if (!translation) {
    translation = LOCALE_NOT_FOUND_FIELD_MESSAGE;
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

interface GetCityFieldLocaleStringInterface {
  cityField: Record<string, Record<string, any>>;
  city: string;
  locale: string;
}

export function getCityFieldLocaleString({
  cityField,
  city,
  locale,
}: GetCityFieldLocaleStringInterface): any {
  const cityData = getCityFieldData(cityField, city);
  if (!cityData) {
    throw Error('getCityLocale error');
  }
  const cityLocale = getI18nLocaleValue(cityData, locale);
  if (!cityLocale) {
    throw Error('getCityLocale error');
  }
  return cityLocale;
}

export interface GetCurrencyStringInterface {
  locale: string;
  value?: number | string | null;
}

export const getCurrencyString = ({ locale, value }: GetCurrencyStringInterface): string => {
  return new Intl.NumberFormat(locale).format(noNaN(value)).replace(',', ' ');
};

export function getNumWord(value: number, words: string[]) {
  value = Math.abs(value) % 100;
  const num = value % 10;
  if (value > 10 && value < 20) {
    return words[2];
  }
  if (num > 1 && num < 5) {
    return words[1];
  }
  if (num === 1) {
    return words[0];
  }
  return words[2];
}
