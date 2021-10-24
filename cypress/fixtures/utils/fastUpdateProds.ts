import { ProductCardDescriptionModel } from '../../../db/dbModels';
import { COL_PRODUCT_CARD_CONTENTS } from '../../../db/collectionNames';
import { dbsConfig, getProdDb } from './getProdDb';
require('dotenv').config();

async function updateProds() {
  for await (const dbConfig of dbsConfig) {
    const isToys = dbConfig.dbName === `${process.env.SC_DB_NAME}`;
    const companySlug = 'womens_secretary_000003';

    const { db, client } = await getProdDb(dbConfig);
    const productDescriptionsCollection = await db.collection<ProductCardDescriptionModel>(
      COL_PRODUCT_CARD_CONTENTS,
    );

    console.log(' ');
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>');
    console.log(' ');
    console.log(`Updating ${dbConfig.dbName} db`);

    if (isToys) {
      await productDescriptionsCollection.updateMany(
        {},
        {
          $set: {
            companySlug,
          },
        },
      );
    }

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
