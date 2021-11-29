import { PAGE_EDITOR_DEFAULT_VALUE_STRING } from '../config/common';

export function sortStringArray(list: string[]): any[] {
  return [...list].sort((a, b) => {
    const nameA = `${a}`.toUpperCase();
    const nameB = `${b}`.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });
}

export function getConstructorContentFromText(text: string) {
  try {
    const result = `{"id":"1","version":1,"rows":[{"id":"hjao4p","cells":[{"id":"kax19a","size":12,"plugin":{"id":"ory/editor/core/content/slate","version":1},"dataI18n":{"ru":{"slate":[{"type":"PARAGRAPH/PARAGRAPH","children":[{"text":"${text}"}]}]}},"rows":[],"inline":null}]}]}`;
    JSON.parse(result);
    return result;
  } catch (e) {
    console.log('getConstructorContentFromText Error >>>>>>>', e);
    return PAGE_EDITOR_DEFAULT_VALUE_STRING;
  }
}
