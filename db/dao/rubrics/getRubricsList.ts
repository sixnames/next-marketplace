import { castRubricForUI } from 'db/cast/castRubricForUI';
import { getDbCollections } from 'db/mongodb';
import { DaoPropsInterface, RubricInterface } from 'db/uiInterfaces';
import { sortObjectsByField } from 'lib/arrayUtils';
import { SORT_DESC } from 'lib/config/common';
import { getRequestParams } from 'lib/sessionHelpers';

export interface GetRubricsListInputInterface {}

export async function getRubricsList({
  context,
}: DaoPropsInterface<GetRubricsListInputInterface>): Promise<RubricInterface[]> {
  try {
    const { locale } = await getRequestParams(context);
    const collections = await getDbCollections();
    const rubricsCollection = collections.rubricsCollection();

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
    console.log('getRubricsList error', e);
    return [];
  }
}
