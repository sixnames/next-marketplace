import { noNaN } from '../../../lib/numbers';
import { FILTER_SEPARATOR, SORT_ASC } from '../../../config/common';
import { ObjectId } from 'mongodb';
import { ObjectIdModel, ProductAttributeModel } from '../../../db/dbModels';
import { OptionInterface, OptionsGroupInterface } from '../../../db/uiInterfaces';
import {
  COL_OPTIONS,
  COL_OPTIONS_GROUPS,
  COL_PRODUCT_ATTRIBUTES,
} from '../../../db/collectionNames';
import { dbsConfig, getProdDb } from './getProdDb';
require('dotenv').config();

interface LostGroup {
  _id: ObjectIdModel;
  options: OptionInterface[];
}

async function updateProds() {
  for await (const dbConfig of dbsConfig) {
    const { db, client } = await getProdDb(dbConfig);
    const optionsGroupsCollection = await db.collection<OptionsGroupInterface>(COL_OPTIONS_GROUPS);
    const optionsCollection = await db.collection<OptionInterface>(COL_OPTIONS);
    const productAttributesCollection =
      db.collection<ProductAttributeModel>(COL_PRODUCT_ATTRIBUTES);

    console.log(' ');
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>');
    console.log(' ');
    console.log(`Updating options in ${dbConfig.dbName} db`);
    const optionGroups = await optionsGroupsCollection
      .aggregate([
        {
          $match: {
            _id: new ObjectId('608d83289af8419114a31a8a'),
          },
        },
        {
          $lookup: {
            from: COL_OPTIONS,
            as: 'options',
            let: { optionsGroupId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$optionsGroupId', '$$optionsGroupId'],
                  },
                },
              },
            ],
          },
        },
      ])
      .toArray();
    const optionsGroup = optionGroups[0];

    if (optionsGroup) {
      let lostGroups: LostGroup[] = [];
      const initialOptions = optionsGroup.options || [];
      initialOptions.forEach((option) => {
        const { parentId } = option;
        if (parentId) {
          const parent = initialOptions.some(({ _id }) => _id.equals(parentId));
          if (!parent) {
            const existingGroupIndex = lostGroups.findIndex(({ _id }) => _id.equals(parentId));
            const existingGroup = lostGroups[existingGroupIndex];
            if (existingGroupIndex > -1 && existingGroup) {
              lostGroups[existingGroupIndex] = {
                _id: parentId,
                options: [...existingGroup.options, option],
              };
            } else {
              lostGroups.push({
                _id: parentId,
                options: [option],
              });
            }
          }
        }
      });

      const lostIds = lostGroups.reduce((acc: ObjectIdModel[], { options }) => {
        const optionIds = options.map(({ _id }) => _id);
        return [...acc, ...optionIds];
      }, []);

      const productAttributes = await productAttributesCollection
        .aggregate([
          {
            $match: {
              optionsGroupId: optionsGroup._id,
            },
          },
          {
            $unwind: {
              path: '$selectedOptionsIds',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $match: {
              selectedOptionsIds: {
                $in: lostIds,
              },
            },
          },
          {
            $group: {
              _id: '$_id',
              selectedOptionsSlugs: {
                $first: '$selectedOptionsSlugs',
              },
            },
          },
        ])
        .toArray();
      console.log('lostIds.length ', lostIds.length);
      console.log('productAttributes.length ', productAttributes.length);

      for await (const productAttribute of productAttributes) {
        const { selectedOptionsSlugs, _id } = productAttribute;
        console.log('Updating ', _id);

        const optionSlugs = selectedOptionsSlugs.reduce((acc: string[], slug) => {
          const slugParts = slug.split(FILTER_SEPARATOR);
          const optionSlug = slugParts[1];
          if (optionSlug) {
            return [...acc, optionSlug];
          }
          return acc;
        }, []);

        // get options
        const attributeOptions = await optionsCollection
          .aggregate([
            {
              $match: {
                slug: {
                  $in: optionSlugs,
                },
              },
            },
            {
              $sort: {
                slug: SORT_ASC,
              },
            },
          ])
          .toArray();
        const selectedOptionsIds = attributeOptions.map(({ _id }) => _id);
        const entries = Object.entries(attributeOptions);

        for await (const [indexString, option] of entries) {
          const index = noNaN(indexString);
          const prevOption = attributeOptions[index - 1];
          if (prevOption) {
            await optionsCollection.findOneAndUpdate(
              {
                _id: option._id,
              },
              {
                $set: {
                  parentId: prevOption._id,
                },
              },
            );
          }
        }

        // update attribute
        await productAttributesCollection.findOneAndUpdate(
          {
            _id,
          },
          {
            $set: {
              selectedOptionsIds,
            },
          },
        );
      }
    }

    console.log(`Done options in ${dbConfig.dbName} db`);
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
