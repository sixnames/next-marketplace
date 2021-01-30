import { getDatabase } from 'db/mongodb';
import { OptionalId, WithId } from 'mongodb';

export interface CreateDbNodeInterface<TModel> {
  collectionName: string;
  template: OptionalId<TModel>;
}

export async function createDbNode<TModel>({
  collectionName,
  template,
}: CreateDbNodeInterface<TModel>): Promise<WithId<TModel>> {
  const db = await getDatabase();
  const collection = db.collection<TModel>(collectionName);
  const createdNode = await collection.insertOne(template);

  if (!createdNode.result.ok) {
    throw Error(`${collectionName} creation error`);
  }

  return createdNode.ops[0];
}
