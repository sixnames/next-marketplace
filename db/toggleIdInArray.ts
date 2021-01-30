import { ObjectId } from 'mongodb';

export function toggleIdInArray(array: ObjectId[], item: ObjectId) {
  const includes = array.some((inArray) => inArray.equals(item));

  if (includes) {
    return array.filter((inArray) => !inArray.equals(item));
  }
  return [...array, item];
}
