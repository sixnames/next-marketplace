import { UserModel } from '../../../db/dbModels';
import { COL_USERS } from '../../../db/collectionNames';
import { dbsConfig, getProdDb } from './getProdDb';
require('dotenv').config();

async function updateProds() {
  for await (const dbConfig of dbsConfig) {
    const { db, client } = await getProdDb(dbConfig);
    const usersCollection = await db.collection<UserModel>(COL_USERS);

    console.log(' ');
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>');
    console.log(' ');
    console.log(`Updating ${dbConfig.dbName} db`);

    await usersCollection.updateMany(
      {},
      {
        $set: {
          categoryIds: [],
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
