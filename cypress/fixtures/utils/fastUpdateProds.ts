import { dbsConfig, getProdDb, updateIndexes } from './getProdDb';
import { COL_CITIES, COL_COUNTRIES } from '../../../db/collectionNames';
import { CityModel } from '../../../db/dbModels';

require('dotenv').config();

async function updateProds() {
  for await (const dbConfig of dbsConfig) {
    console.log(' ');
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>');
    console.log(' ');
    console.log(`Updating ${dbConfig.dbName} db`);
    const { db, client } = await getProdDb(dbConfig);
    const countriesCollection = db.collection<any>(COL_COUNTRIES);
    const citiesCollection = db.collection<CityModel>(COL_CITIES);

    const countries = await countriesCollection.find({}).toArray();
    for await (const country of countries) {
      await citiesCollection.updateMany(
        {
          _id: {
            $in: country.citiesIds,
          },
        },
        {
          $set: {
            countryId: country._id,
            currency: country.currency,
          },
        },
      );
      await countriesCollection.findOneAndUpdate(
        { _id: country._id },
        {
          $unset: {
            citiesIds: '',
          },
        },
      );
    }

    // update indexes
    console.log(`Updating indexes in ${dbConfig.dbName} db`);
    await updateIndexes(db);
    console.log(`Indexes updated in ${dbConfig.dbName} db`);

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
