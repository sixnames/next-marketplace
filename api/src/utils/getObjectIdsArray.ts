import { Types } from 'mongoose';
import { alwaysArray } from './alwaysArray';

export function getObjectIdsArray(arr: string[] | string): Types.ObjectId[] {
  const castedIds = alwaysArray(arr).map((id) => {
    return id ? new Types.ObjectId(id) : null;
  });

  return castedIds.reduce((acc: Types.ObjectId[], id) => {
    return id ? [...acc, id] : acc;
  }, []);
}
