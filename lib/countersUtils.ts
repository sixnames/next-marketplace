import { getDatabase } from 'db/mongodb';
import { FilterQuery } from 'mongodb';

export interface UpdateModelViewsInterface {
  sessionCity: string;
  collectionName: string;
  queryFilter: FilterQuery<any>;
}

export async function updateModelViews({
  sessionCity,
  queryFilter,
  collectionName,
}: UpdateModelViewsInterface) {
  const db = await getDatabase();
  const collection = db.collection(collectionName);
  await collection.updateMany(queryFilter, {
    $inc: {
      [`views.${sessionCity}`]: 1,
    },
  });
}
