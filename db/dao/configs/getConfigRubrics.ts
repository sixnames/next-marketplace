import { SORT_DESC } from 'config/common';
import { COL_CATEGORIES, COL_RUBRICS } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { RubricInterface } from 'db/uiInterfaces';
import { getFieldStringLocale } from 'lib/i18n';
import { getTreeFromList } from 'lib/optionUtils';

export async function getConfigRubrics(locale: string) {
  const { db } = await getDatabase();
  const rubricsCollection = db.collection<RubricInterface>(COL_RUBRICS);
  const rubricsAggregation = await rubricsCollection
    .aggregate([
      {
        $sort: {
          _id: SORT_DESC,
        },
      },
      {
        $lookup: {
          from: COL_CATEGORIES,
          as: 'categories',
          localField: '_id',
          foreignField: 'rubricId',
        },
      },
    ])
    .toArray();
  const rubrics = rubricsAggregation.map((rubric) => {
    return {
      ...rubric,
      name: getFieldStringLocale(rubric.nameI18n, locale),
      categories: getTreeFromList({
        list: rubric.categories,
        childrenFieldName: 'categories',
        locale,
      }),
    };
  });
  return rubrics;
}
