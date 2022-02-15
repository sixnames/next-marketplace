import { SORT_DESC } from 'config/common';
import { castRubricForUI } from 'db/cast/castRubricForUI';
import { getTreeFromList } from 'lib/treeUtils';
import { COL_CATEGORIES, COL_RUBRICS } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { RubricInterface } from 'db/uiInterfaces';

export async function getConfigRubrics(locale: string) {
  const { db } = await getDatabase();
  const rubricsCollection = db.collection<RubricInterface>(COL_RUBRICS);
  const rubricsAggregation = await rubricsCollection
    .aggregate<RubricInterface>([
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
    const castedRubric = castRubricForUI({
      locale,
      rubric,
    });

    return {
      ...castedRubric,
      categories: getTreeFromList({
        list: castedRubric.categories,
        childrenFieldName: 'categories',
        locale,
      }),
    };
  });
  return rubrics;
}
