import { ProductAttributeModel } from '../../../db/dbModels';
import { COL_CATEGORIES, COL_PRODUCT_ATTRIBUTES } from '../../../db/collectionNames';
import { dbsConfig, getProdDb } from './getProdDb';
require('dotenv').config();

/*export async function getNextItemId(collectionName: string, db: Db): Promise<string> {
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

  return addZero(updatedCounter.value.counter, ID_COUNTER_DIGITS);
}*/

async function updateProds() {
  for await (const dbConfig of dbsConfig) {
    const { db, client } = await getProdDb(dbConfig);

    const productAttributesCollection = await db.collection<ProductAttributeModel>(
      COL_PRODUCT_ATTRIBUTES,
    );
    const categoriesCollection = await db.collection<any>(COL_CATEGORIES);

    console.log(' ');
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>');
    console.log(' ');
    console.log(`Updating ${dbConfig.dbName} db`);

    await categoriesCollection.updateMany(
      {},
      {
        $unset: {
          textTopI18n: '',
          textBottomI18n: '',
        },
      },
    );

    await productAttributesCollection.updateMany(
      {},
      {
        $unset: {
          slug: '',
          attributesGroupId: '',
          nameI18n: '',
          optionsGroupId: '',
          metric: '',
          capitalise: '',
          variant: '',
          viewVariant: '',
          positioningInTitle: '',
          positioningInCardTitle: '',
          showAsBreadcrumb: '',
          showAsCatalogueBreadcrumb: '',
          notShowAsAlphabet: '',
          showInSnippet: '',
          showInCard: '',
          showInCatalogueFilter: '',
          showInCatalogueNav: '',
          showInCatalogueTitle: '',
          showInCardTitle: '',
          showInSnippetTitle: '',
          showNameInTitle: '',
          showNameInSelectedAttributes: '',
          showNameInCardTitle: '',
          showNameInSnippetTitle: '',
          views: '',
          priorities: '',
        },
      },
    );

    console.log(`Done ${dbConfig.dbName} db`);
    console.log(' ');

    // disconnect form db
    await client.close();
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
