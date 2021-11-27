import {
  CATALOGUE_SEO_TEXT_POSITION_BOTTOM,
  CATALOGUE_SEO_TEXT_POSITION_TOP,
  DEFAULT_CITY,
} from 'config/common';
import { COL_RUBRICS } from 'db/collectionNames';
import { RubricModel, SeoContentModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { RubricInterface } from 'db/uiInterfaces';
import { getFieldStringLocale } from 'lib/i18n';
import { getRubricSeoText } from 'lib/seoTextUtils';
import { ObjectId } from 'mongodb';

interface GetConsoleRubricDetailsPayloadInterface {
  rubric: RubricInterface;
  seoDescriptionTop: SeoContentModel;
  seoDescriptionBottom: SeoContentModel;
}

interface GetConsoleRubricDetailsInterface {
  rubricId: string;
  companySlug: string;
  locale: string;
}

export async function getConsoleRubricDetails({
  rubricId,
  companySlug,
  locale,
}: GetConsoleRubricDetailsInterface): Promise<GetConsoleRubricDetailsPayloadInterface | null> {
  const { db } = await getDatabase();
  const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
  const initialRubrics = await rubricsCollection
    .aggregate<RubricInterface>([
      {
        $match: {
          _id: new ObjectId(`${rubricId}`),
        },
      },

      {
        $project: {
          attributes: false,
          priorities: false,
          views: false,
        },
      },
    ])
    .toArray();
  const initialRubric = initialRubrics[0];
  if (!initialRubric) {
    return null;
  }

  const rubric = {
    ...initialRubric,
    name: getFieldStringLocale(initialRubric.nameI18n, locale),
  };

  const seoDescriptionTop = await getRubricSeoText({
    rubricSlug: rubric.slug,
    rubricId: rubric._id,
    position: CATALOGUE_SEO_TEXT_POSITION_TOP,
    citySlug: DEFAULT_CITY,
    companySlug,
  });

  const seoDescriptionBottom = await getRubricSeoText({
    rubricSlug: rubric.slug,
    rubricId: rubric._id,
    position: CATALOGUE_SEO_TEXT_POSITION_BOTTOM,
    citySlug: DEFAULT_CITY,
    companySlug,
  });

  if (!seoDescriptionBottom || !seoDescriptionTop) {
    return null;
  }

  return {
    rubric,
    seoDescriptionTop,
    seoDescriptionBottom,
  };
}
