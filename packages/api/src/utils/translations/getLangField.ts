import { DEFAULT_LANG, LANG_NOT_FOUND_FIELD_MESSAGE, SECONDARY_LANG } from '@yagu/config';
import { LanguageType } from '../../entities/commonEntities';

function getLangField(
  languages: LanguageType[] | null | undefined,
  chosenLanguage: string,
): string {
  if (!languages) {
    return LANG_NOT_FOUND_FIELD_MESSAGE;
  }

  const currentLang = languages.find(({ key }) => key === chosenLanguage);
  const defaultLang = languages.find(({ key }) => key === DEFAULT_LANG);
  const defaultLangValue = defaultLang ? defaultLang.value : LANG_NOT_FOUND_FIELD_MESSAGE;

  if (!currentLang && chosenLanguage !== DEFAULT_LANG) {
    const universalLang = languages.find(({ key }) => key === SECONDARY_LANG);

    if (!universalLang) {
      return defaultLangValue;
    }

    return universalLang ? universalLang.value : LANG_NOT_FOUND_FIELD_MESSAGE;
  }

  if (!currentLang) {
    return defaultLangValue;
  }

  return currentLang ? currentLang.value : LANG_NOT_FOUND_FIELD_MESSAGE;
}

export default getLangField;
