import { COL_ID_COUNTERS } from 'db/collectionNames';
import { IdCounterModel } from 'db/dbModels';
import { DEFAULT_ID_COUNTER, ID_COUNTER_STEP } from 'config/common';
import { getDatabase } from 'db/mongodb';

export async function setCollectionItemId(collectionName: string, counter: number) {
  const db = await getDatabase();
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

export async function getNextItemId(collectionName: string) {
  const db = await getDatabase();
  const idCountersCollection = db.collection(COL_ID_COUNTERS);
  const idCounter = await idCountersCollection.findOne<IdCounterModel>({
    collection: collectionName,
  });

  if (idCounter) {
    const nextCounterValue = idCounter.counter + ID_COUNTER_STEP;
    const updatedCounter = await idCountersCollection.findOneAndUpdate(
      { collection: collectionName },
      {
        $set: {
          counter: nextCounterValue,
        },
      },
    );

    if (!updatedCounter.ok) {
      throw Error(`${COL_ID_COUNTERS} update error`);
    }

    return nextCounterValue;
  }

  const createdCounter = await idCountersCollection.insertOne({
    collection: collectionName,
    counter: DEFAULT_ID_COUNTER,
  });

  if (!createdCounter.result.ok) {
    throw Error(`${COL_ID_COUNTERS} create error`);
  }

  return DEFAULT_ID_COUNTER;
}
