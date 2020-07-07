function toggleItemInArray<T>(array: T[], item: T) {
  if (array.includes(item)) {
    return array.filter((inArray) => inArray !== item);
  }
  return [...array, item];
}

export default toggleItemInArray;
