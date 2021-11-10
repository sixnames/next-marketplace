import { dbsConfig, getProdDb } from './getProdDb';
import { COL_PRODUCTS } from '../../../db/collectionNames';
import { ProductModel, TranslationModel } from '../../../db/dbModels';
import trim from 'trim';

require('dotenv').config();

/*async function getNextNumberItemId(collectionName: string, db: Db): Promise<string> {
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

  return `${updatedCounter.value.counter}`;
}*/

interface TrimProductNameInterface {
  originalName?: string | null;
  nameI18n?: TranslationModel | null;
}
function trimProductName({ originalName, nameI18n }: TrimProductNameInterface) {
  const translation = nameI18n || {};
  return {
    originalName: originalName ? trim(originalName) : '',
    nameI18n: Object.keys(translation).reduce((acc: TranslationModel, key) => {
      const value = translation[key];
      if (!value) {
        return acc;
      }
      acc[key] = trim(value);
      return acc;
    }, {}),
  };
}

async function updateProds() {
  for await (const dbConfig of dbsConfig) {
    console.log(' ');
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>');
    console.log(' ');
    console.log(`Updating ${dbConfig.dbName} db`);
    const { db, client } = await getProdDb(dbConfig);
    const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);

    const products = await productsCollection.find({}).toArray();

    for await (const product of products) {
      const { nameI18n, originalName } = trimProductName({
        originalName: product.originalName,
        nameI18n: product.nameI18n,
      });
      await productsCollection.findOneAndUpdate(
        {
          _id: product._id,
        },
        {
          $set: {
            originalName,
            nameI18n,
          },
        },
      );
    }

    // disconnect form db
    await client.close();
    console.log(`Done ${dbConfig.dbName}`);
    console.log(' ');
  }
}

(() => {
  updateProds()
    .then(() => {
      console.log('Success!');
      process.exit();
    })
    .catch((e) => {
      console.log(e);
      process.exit();
    });
})();
