import { SORT_DESC } from 'config/common';
import { COL_EVENT_RUBRICS } from 'db/collectionNames';
import { sortObjectsByField } from 'lib/arrayUtils';
import { getRequestParams } from 'lib/sessionHelpers';
import { getDatabase } from 'db/mongodb';
import { DaoPropsInterface, EventRubricInterface, RubricInterface } from 'db/uiInterfaces';
import { castEventRubricForUI } from 'db/dao/ssr/castRubricForUI';

export interface GetRubricsListInputInterface {}

export async function getEventRubricsList({
  context,
}: DaoPropsInterface<GetRubricsListInputInterface>): Promise<EventRubricInterface[]> {
  try {
    const { locale } = await getRequestParams(context);
    const { db } = await getDatabase();
    const rubricsCollection = db.collection<EventRubricInterface>(COL_EVENT_RUBRICS);

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
      return castEventRubricForUI({ rubric, locale });
    });

    return sortObjectsByField(rubrics, 'name');
  } catch (e) {
    console.log('getEventRubricsList error', e);
    return [];
  }
}
