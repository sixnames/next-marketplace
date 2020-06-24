import { DEFAULT_LANG } from '../config';

export interface LanguageInterface {
  key: string;
  value: string;
}

function getLangField(languages: LanguageInterface[], chosenLanguage: string) {
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
