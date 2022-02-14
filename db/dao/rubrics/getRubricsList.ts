import { SORT_DESC } from 'config/common';
import { sortObjectsByField } from 'lib/arrayUtils';
import { getRequestParams } from 'lib/sessionHelpers';
import { COL_RUBRICS } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { DaoPropsInterface, RubricInterface } from 'db/uiInterfaces';
import { castRubricForUI } from 'db/dao/ssr/castRubricForUI';

export interface GetRubricsListInputInterface {}

export async function getRubricsList({
  context,
}: DaoPropsInterface<GetRubricsListInputInterface>): Promise<RubricInterface[]> {
  try {
    const { locale } = await getRequestParams(context);
    const { db } = await getDatabase();
    const rubricsCollection = db.collection<RubricInterface>(COL_RUBRICS);

    const rubricsAggregationResult = await rubricsCollection
      .aggregate<RubricInterface>([
        {
          $sort: {
            _id: SORT_DESC,
          },
        },
      ])
      .toArray();

    const rubrics = rubricsAggregationResult.map((rubric) => {
      return castRubricForUI({ rubric, locale });
    });

    return sortObjectsByField(rubrics, 'name');
  } catch (e) {
    console.log(e);
    return [];
  }
}
