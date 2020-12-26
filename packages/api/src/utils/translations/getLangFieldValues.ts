import { DEFAULT_LANG, LANG_NOT_FOUND_FIELD_MESSAGE, SECONDARY_LANG } from '@yagu/shared';

export interface LanguageWithMultipleValuesInterface {
  key: string;
  value: string[];
}

function getLangFieldValues(
  languages: LanguageWithMultipleValuesInterface[] | null | undefined,
  chosenLanguage: string,
): string[] {
  const fallbackValue = [LANG_NOT_FOUND_FIELD_MESSAGE];

  if (!languages) {
    return fallbackValue;
  }

  const currentLang = languages.find(({ key }) => key === chosenLanguage);
  const defaultLang = languages.find(({ key }) => key === DEFAULT_LANG);
  const defaultLangValue = defaultLang ? defaultLang.value : fallbackValue;

  if (!currentLang && chosenLanguage !== DEFAULT_LANG) {
    const universalLang = languages.find(({ key }) => key === SECONDARY_LANG);

    if (!universalLang) {
      return defaultLangValue;
    }

    return universalLang ? universalLang.value : fallbackValue;
  }

  if (!currentLang) {
    return defaultLangValue;
  }

  return currentLang ? currentLang.value : fallbackValue;
}

export default getLangFieldValues;
