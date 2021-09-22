import { dbsConfig, getProdDb } from './getProdDb';
import { COL_ATTRIBUTES, COL_PRODUCT_ATTRIBUTES } from '../../../db/collectionNames';
require('dotenv').config();

async function updateProds() {
  for await (const dbConfig of dbsConfig) {
    const { db, client } = await getProdDb(dbConfig);
    console.log(' ');
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>');
    console.log(' ');

    // update attributes
    console.log(`Updating attributes in ${dbConfig.dbName} db`);
    const rubricAttributesCollection = db.collection(COL_PRODUCT_ATTRIBUTES);
    const attributesCollection = db.collection(COL_ATTRIBUTES);
    const productAttributesList = await rubricAttributesCollection
      .aggregate([
        {
          $group: {
            _id: '$attributeId',
            ids: {
              $push: '$_id',
            },
          },
        },
      ])
      .toArray();

    for await (const rubricAttribute of productAttributesList) {
      const attribute = await attributesCollection.findOne({
        _id: rubricAttribute._id,
      });

      if (!attribute) {
        const res = await rubricAttributesCollection.countDocuments({
          _id: {
            $in: rubricAttribute.ids,
          },
        });
        console.log(res);
      }
    }
    console.log(`attributes updated in ${dbConfig.dbName} db`);

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
