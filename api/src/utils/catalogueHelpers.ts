export function getOptionFromParam(paramString: string): { key: string; value: string[] } {
  const param = paramString.split('-');
  return { key: `${param[0]}`, value: [`${param[1]}`] };
}

export function attributesReducer(acc: { key: string; value: string[] }[] = [], item: string) {
  const param = getOptionFromParam(item);
  const existingParam = acc.findIndex((item) => item.key === param.key);
  if (existingParam >= 0) {
    const existingItem = acc[existingParam];
    acc[existingParam] = {
      key: param.key,
      value: [...existingItem.value, ...param.value],
    };
    return [...acc];
  }
  return [...acc, { key: param.key, value: param.value }];
}
