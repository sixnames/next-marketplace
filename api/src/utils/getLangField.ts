import { DEFAULT_LANG, LANG_NOT_FOUND_FIELD_MESSAGE } from '../config';

export interface LanguageInterface {
  key: string;
  value: string;
}

function getLangField(languages: LanguageInterface[] | null | undefined, chosenLanguage: string) {
  if (!languages) {
    return LANG_NOT_FOUND_FIELD_MESSAGE;
  }

  let result;
  const currentLang = languages.find(({ key }) => key === chosenLanguage);
  if (currentLang) {
    result = currentLang.value;
  } else {
    result = languages.find(({ key }) => key === DEFAULT_LANG)!.value;
  }

  return result;
}

export default getLangField;
