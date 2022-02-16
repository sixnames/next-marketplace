import addZero from 'add-zero';
import { COL_ORDERS } from 'db/collectionNames';
import { getDbCollections } from 'db/mongodb';
import { ID_COUNTER_DIGITS, ID_COUNTER_ORDER_DIGITS, ID_COUNTER_STEP } from 'lib/config/common';

export async function getNextItemId(
  collectionName: string,
  digits: number = ID_COUNTER_DIGITS,
): Promise<string> {
  const collections = await getDbCollections();
  const idCountersCollection = collections.idCountersCollection();

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

export async function getNextNumberItemId(collectionName: string): Promise<string> {
  const collections = await getDbCollections();
  const idCountersCollection = collections.idCountersCollection();

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

  return `${updatedCounter.value.counter}`;
}

export async function getOrderNextItemId(companySlug: string): Promise<string> {
  return getNextItemId(`${COL_ORDERS}-${companySlug}`, ID_COUNTER_ORDER_DIGITS);
}
