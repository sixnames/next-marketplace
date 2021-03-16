import { getDatabase } from 'db/mongodb';

export async function clearTestData() {
  const db = await getDatabase();
  /*const collections = await db.collections();
  for await (const collection of collections) {
    await collection.deleteMany({});
  }*/
  await db.dropDatabase();
}
