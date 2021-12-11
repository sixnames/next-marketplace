import { COL_RUBRICS } from 'db/collectionNames';
import { castRubricForUI } from 'db/dao/rubrics/castRubricForUI';
import { getDatabase } from 'db/mongodb';
import { DaoPropsInterface, RubricInterface } from 'db/uiInterfaces';
import { sortObjectsByField } from 'lib/arrayUtils';
import { getRequestParams } from 'lib/sessionHelpers';

export interface GetRubricsListInputInterface {}

export async function getRubricsList({
  context,
}: DaoPropsInterface<GetRubricsListInputInterface>): Promise<RubricInterface[]> {
  try {
    const { locale } = await getRequestParams(context);
    const { db } = await getDatabase();
    const rubricsCollection = db.collection<RubricInterface>(COL_RUBRICS);

    const rubricsAggregationResult = await rubricsCollection
      .aggregate<RubricInterface>([])
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
