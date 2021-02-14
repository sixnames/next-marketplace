import { COL_RUBRICS } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';

export async function createIndexes() {
  const db = await getDatabase();

  // Products indexes
  const productsCollection = db.collection(COL_RUBRICS);
  await productsCollection.createIndex({ rubricsIds: 1, createdAt: -1 });
  await productsCollection.createIndex({ rubricsIds: 1, createdAt: 1 });
  const indexes = await productsCollection.listIndexes().toArray();
  console.log(indexes);
}
