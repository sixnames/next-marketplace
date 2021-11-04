import { dbsConfig, getProdDb } from './getProdDb';
import { COL_ATTRIBUTES } from '../../../db/collectionNames';
import { AttributeModel } from '../../../db/dbModels';

require('dotenv').config();

async function updateProds() {
  for await (const dbConfig of dbsConfig) {
    console.log(' ');
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>');
    console.log(' ');
    console.log(`Updating ${dbConfig.dbName} db`);
    const { db, client } = await getProdDb(dbConfig);
    const attributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);

    await attributesCollection.updateMany(
      {},
      {
        $set: {
          showInCatalogueTitle: true,
        },
      },
    );

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
