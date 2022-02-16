import { castRubricForUI } from 'db/cast/castRubricForUI';
import { COL_CATEGORIES } from 'db/collectionNames';
import { getDbCollections } from 'db/mongodb';
import { RubricInterface } from 'db/uiInterfaces';
import { SORT_DESC } from 'lib/config/common';
import { getTreeFromList } from 'lib/treeUtils';

export async function getConfigRubrics(locale: string) {
  const collections = await getDbCollections();
  const rubricsCollection = collections.rubricsCollection();
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
