function toggleIdInArray(array: any[], item: any) {
  const isString = (item: any) => typeof item === 'string';

  const castedArray = array.map((item) => {
    if (!isString(item)) {
      return item.toString();
    }
    return item;
  });
  const castedItem = isString(item) ? item : item.toString();

  if (castedArray.includes(castedItem)) {
    return castedArray.filter((inArray) => inArray !== castedItem);
  }
  return [...array, item];
}

export default toggleIdInArray;
