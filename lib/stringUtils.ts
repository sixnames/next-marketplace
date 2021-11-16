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
  return `{"id":"1","version":1,"rows":[{"id":"hjao4p","cells":[{"id":"kax19a","size":12,"plugin":{"id":"ory/editor/core/content/slate","version":1},"dataI18n":{"ru":{"slate":[{"type":"PARAGRAPH/PARAGRAPH","children":[{"text":"${text}"}]}]}},"rows":[],"inline":null}]}]}`;
}
