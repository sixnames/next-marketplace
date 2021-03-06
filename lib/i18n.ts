import { TranslationModel } from 'db/dbModels';
import trim from 'trim';
import { DEFAULT_CITY, DEFAULT_LOCALE, SECONDARY_LOCALE } from './config/common';

export function getI18nLocaleValue<T>(i18nField: Record<string, T>, locale: string): T {
  let translation: T = i18nField[locale];

  // Get fallback language if chosen has not found
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

  // Get default language if fallback not found
  if (!translation) {
    translation = i18nField[DEFAULT_LOCALE];
  }

  // Set warning massage if fallback language not found
  if (!translation) {
    translation = '';
  }

  return translation;
}

export function getCityFieldData<T>(cityField: Record<string, T>, city: string): T {
  let fieldData: T = cityField[city];

  // Get default city data if chosen has not found
  if (!fieldData) {
    fieldData = cityField[DEFAULT_CITY];
  }

  return fieldData;
}

interface GetCityFieldLocaleStringInterface {
  cityField: Record<string, Record<string, any>>;
  citySlug: string;
  locale: string;
}

export function getCityFieldLocaleString({
  cityField,
  citySlug,
  locale,
}: GetCityFieldLocaleStringInterface): any {
  const cityData = getCityFieldData(cityField, citySlug);
  if (!cityData) {
    throw Error('getCityLocale error');
  }
  const cityLocale = getI18nLocaleValue(cityData, locale);
  if (!cityLocale) {
    throw Error('getCityLocale error');
  }
  return cityLocale;
}

export function getNumWord(value: number | undefined, words: string[]): string {
  if (!value) {
    return '';
  }

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

export function trimTranslationField(fieldII18n?: TranslationModel | null) {
  const field = fieldII18n || {};
  return Object.keys(field).reduce((acc: TranslationModel, key) => {
    const value = field[key];
    if (!value) {
      return acc;
    }
    acc[key] = trim(value);
    return acc;
  }, {});
}

interface TrimProductNameInterface {
  originalName?: string | null;
  nameI18n?: TranslationModel | null;
}

export function trimProductName({ originalName, nameI18n }: TrimProductNameInterface) {
  return {
    originalName: originalName ? trim(originalName) : '',
    nameI18n: trimTranslationField(nameI18n),
  };
}
