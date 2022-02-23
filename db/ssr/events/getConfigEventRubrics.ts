import { castEventRubricForUI } from 'db/cast/castRubricForUI';
import { getDbCollections } from 'db/mongodb';
import { EventRubricInterface } from 'db/uiInterfaces';
import { SORT_DESC } from 'lib/config/common';
import { ObjectId } from 'mongodb';

interface GetConfigEventRubricsInterface {
  locale: string;
  companyId?: string;
}

export async function getConfigEventRubrics({ locale, companyId }: GetConfigEventRubricsInterface) {
  const collections = await getDbCollections();
  const rubricsCollection = collections.eventRubricsCollection();
  const companyMatch = companyId
    ? [
        {
          $match: {
            companyId: new ObjectId(companyId),
          },
        },
      ]
    : [];
  const rubricsAggregation = await rubricsCollection
    .aggregate<EventRubricInterface>([
      ...companyMatch,
      {
        $sort: {
          _id: SORT_DESC,
        },
      },
    ])
    .toArray();
  const rubrics = rubricsAggregation.map((rubric) => {
    const castedRubric = castEventRubricForUI({
      locale,
      rubric,
    });

    return {
      ...castedRubric,
    };
  });
  return rubrics;
}
