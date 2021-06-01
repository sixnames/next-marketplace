import { COL_ID_COUNTERS } from 'db/collectionNames';
import { IdCounterModel } from 'db/dbModels';
import { ID_COUNTER_STEP, ID_COUNTER_DIGITS } from 'config/common';
import { getDatabase } from 'db/mongodb';
import addZero from 'add-zero';

export async function updateCollectionItemId(collectionName: string) {
  const { db } = await getDatabase();
  const entityCollection = db.collection(collectionName);
  const idCountersCollection = db.collection(COL_ID_COUNTERS);
  const counter = await entityCollection.countDocuments();

  await idCountersCollection.findOneAndUpdate(
    { collection: collectionName },
    {
      $set: {
        counter: counter,
      },
    },
    {
      upsert: true,
    },
  );
}

export async function setCollectionItemId(collectionName: string, counter: number) {
  const { db } = await getDatabase();
  const idCountersCollection = db.collection(COL_ID_COUNTERS);
  await idCountersCollection.findOneAndUpdate(
    { collection: collectionName },
    {
      $set: {
        counter: counter,
      },
    },
    {
      upsert: true,
    },
  );
}

export async function getNextItemId(collectionName: string): Promise<string> {
  const { db } = await getDatabase();
  const idCountersCollection = db.collection<IdCounterModel>(COL_ID_COUNTERS);

  const updatedCounter = await idCountersCollection.findOneAndUpdate(
    { collection: collectionName },
    {
      $inc: {
        counter: ID_COUNTER_STEP,
      },
    },
    {
      upsert: true,
      returnOriginal: false,
    },
  );

  if (!updatedCounter.ok || !updatedCounter.value) {
    throw Error(`${collectionName} id counter update error`);
  }

  return addZero(updatedCounter.value.counter, ID_COUNTER_DIGITS);
}
