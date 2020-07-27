import { DEFAULT_LANG, LANG_NOT_FOUND_FIELD_MESSAGE, SECONDARY_LANG } from '../../config';

export interface LanguageInterface {
  key: string;
  value: string;
}

function getLangField(
  languages: LanguageInterface[] | null | undefined,
  chosenLanguage: string,
): string {
  if (!languages) {
    return LANG_NOT_FOUND_FIELD_MESSAGE;
  }

  const currentLang = languages.find(({ key }) => key === chosenLanguage);
  const defaultLangValue = languages.find(({ key }) => key === DEFAULT_LANG)!.value;

  if (!currentLang && chosenLanguage !== DEFAULT_LANG) {
    const universalLang = languages.find(({ key }) => key === SECONDARY_LANG);

    if (!universalLang) {
      return defaultLangValue;
    }

    return universalLang.value;
  }

  if (!currentLang) {
    return defaultLangValue;
  }

  return currentLang.value;
}

export default getLangField;
