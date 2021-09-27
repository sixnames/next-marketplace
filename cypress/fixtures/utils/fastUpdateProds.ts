import { CategoryModel, ObjectIdModel, RubricModel } from '../../../db/dbModels';
import { dbsConfig, getProdDb } from './getProdDb';
import { COL_CATEGORIES, COL_RUBRICS } from '../../../db/collectionNames';
require('dotenv').config();

interface Temp {
  attributeId: ObjectIdModel;
  attributesGroupId: ObjectIdModel;
}

async function updateProds() {
  for await (const dbConfig of dbsConfig) {
    const { db, client } = await getProdDb(dbConfig);
    console.log(' ');
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>');
    console.log(' ');

    // update products
    console.log(`Updating rubrics in ${dbConfig.dbName} db`);
    const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
    const categoriesCollection = db.collection<CategoryModel>(COL_CATEGORIES);
    const rubricAttributesCollection = db.collection<Temp>('rubricAttributes');

    const rubrics = await rubricsCollection.find({}).toArray();
    for await (const rubric of rubrics) {
      const attributesGroupIds: ObjectIdModel[] = [];
      const filterVisibleAttributeIds: ObjectIdModel[] = [];

      const rubricAttributes = await rubricAttributesCollection
        .find({
          rubricId: rubric._id,
        })
        .toArray();
      rubricAttributes.forEach(({ attributeId, attributesGroupId }) => {
        const attributeIdExist = filterVisibleAttributeIds.some((_id) => {
          return _id.equals(attributeId);
        });
        if (!attributeIdExist) {
          filterVisibleAttributeIds.push(attributeId);
        }

        const attributesGroupIdExist = attributesGroupIds.some((_id) => {
          return _id.equals(attributesGroupId);
        });
        if (!attributesGroupIdExist) {
          attributesGroupIds.push(attributesGroupId);
        }
      });

      console.log({
        attributesGroupIds: attributesGroupIds.length,
        filterVisibleAttributeIds: filterVisibleAttributeIds.length,
      });

      await rubricsCollection.findOneAndUpdate(
        { _id: rubric._id },
        {
          $unset: {
            attributesGroupIds: '',
            filterVisibleAttributeIds: '',
          },
        },
      );

      await rubricsCollection.findOneAndUpdate(
        { _id: rubric._id },
        {
          $set: {
            attributesGroupIds,
            filterVisibleAttributeIds,
          },
        },
      );
    }

    const categories = await categoriesCollection.find({});
    for await (const category of categories) {
      const attributesGroupIds: ObjectIdModel[] = [];
      const filterVisibleAttributeIds: ObjectIdModel[] = [];

      const rubricAttributes = await rubricAttributesCollection
        .find({
          categoryId: category._id,
        })
        .toArray();
      rubricAttributes.forEach(({ attributeId, attributesGroupId }) => {
        const attributeIdExist = filterVisibleAttributeIds.some((_id) => {
          return _id.equals(attributeId);
        });
        if (!attributeIdExist) {
          filterVisibleAttributeIds.push(attributeId);
        }

        const attributesGroupIdExist = attributesGroupIds.some((_id) => {
          return _id.equals(attributesGroupId);
        });
        if (!attributesGroupIdExist) {
          attributesGroupIds.push(attributesGroupId);
        }
      });

      console.log({
        attributesGroupIds: attributesGroupIds.length,
        filterVisibleAttributeIds: filterVisibleAttributeIds.length,
      });

      await categoriesCollection.findOneAndUpdate(
        { _id: category._id },
        {
          $unset: {
            attributesGroupIds: '',
            filterVisibleAttributeIds: '',
          },
        },
      );

      await categoriesCollection.findOneAndUpdate(
        { _id: category._id },
        {
          $set: {
            attributesGroupIds,
            filterVisibleAttributeIds,
          },
        },
      );
    }

    console.log(`rubrics updated in ${dbConfig.dbName} db`);

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
