import { getProdDb, GetProdDd, updateIndexes } from './getProdDb';

const dbConfig: GetProdDd = {
  uri: '',
  dbName: '',
};

async function seedNewDb() {
  const { db, client } = await getProdDb(dbConfig);

  console.log(db);

  // disconnect form db
  await client.close();

  // create indexes
  await updateIndexes(db);
}

(() => {
  seedNewDb()
    .then(() => {
      console.log('Success!');
      process.exit();
    })
    .catch((e) => {
      console.log(e);
      process.exit();
    });
})();
