import { getDatabase } from 'db/mongodb';

export async function clearTestData() {
  const db = await getDatabase();
  await db.dropDatabase();
}
