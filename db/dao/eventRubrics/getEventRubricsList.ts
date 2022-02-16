import { castEventRubricForUI } from 'db/cast/castRubricForUI';
import { getDbCollections } from 'db/mongodb';
import { DaoPropsInterface, EventRubricInterface } from 'db/uiInterfaces';
import { sortObjectsByField } from 'lib/arrayUtils';
import { SORT_DESC } from 'lib/config/common';
import { getRequestParams } from 'lib/sessionHelpers';

export interface GetRubricsListInputInterface {}

export async function getEventRubricsList({
  context,
}: DaoPropsInterface<GetRubricsListInputInterface>): Promise<EventRubricInterface[]> {
  try {
    const { locale } = await getRequestParams(context);
    const collections = await getDbCollections();
    const rubricsCollection = collections.eventRubricsCollection();

    const rubricsAggregationResult = await rubricsCollection
      .aggregate<EventRubricInterface>([
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
