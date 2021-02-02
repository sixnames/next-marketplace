import { COL_ID_COUNTERS } from 'db/collectionNames';
import { IdCounterModel } from 'db/dbModels';
import { DEFAULT_ID_COUNTER, ID_COUNTER_STEP, ID_COUNTER_DIGITS } from 'config/common';
import { getDatabase } from 'db/mongodb';
import addZero from 'add-zero';

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

export async function getNextItemId(collectionName: string): Promise<string> {
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

    return addZero(nextCounterValue, ID_COUNTER_DIGITS);
  }

  const createdCounter = await idCountersCollection.insertOne({
    collection: collectionName,
    counter: DEFAULT_ID_COUNTER,
  });

  if (!createdCounter.result.ok) {
    throw Error(`${COL_ID_COUNTERS} create error`);
  }

  return addZero(DEFAULT_ID_COUNTER, ID_COUNTER_DIGITS);
}
