import { COL_ID_COUNTERS, COL_ORDERS } from '../db/collectionNames';
import { IdCounterModel } from '../db/dbModels';
import { ID_COUNTER_STEP, ID_COUNTER_DIGITS, ID_COUNTER_ORDER_DIGITS } from '../config/common';
import { getDatabase } from '../db/mongodb';
import addZero from 'add-zero';

export async function getNextItemId(
  collectionName: string,
  digits: number = ID_COUNTER_DIGITS,
): Promise<string> {
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
      returnDocument: 'after',
    },
  );

  if (!updatedCounter.ok || !updatedCounter.value) {
    throw Error(`${collectionName} id counter update error`);
  }

  return addZero(updatedCounter.value.counter, digits);
}

export async function getOrderNextItemId(companySlug: string): Promise<string> {
  return getNextItemId(`${COL_ORDERS}-${companySlug}`, ID_COUNTER_ORDER_DIGITS);
}
