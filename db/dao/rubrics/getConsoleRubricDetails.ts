import { ObjectId } from 'mongodb';
import {
  CATALOGUE_SEO_TEXT_POSITION_BOTTOM,
  CATALOGUE_SEO_TEXT_POSITION_TOP,
} from '../../../config/common';
import { getFieldStringLocale } from '../../../lib/i18n';
import { getRubricAllSeoContents } from '../../../lib/seoContentUtils';
import { COL_RUBRICS } from '../../collectionNames';
import { RubricModel } from '../../dbModels';
import { getDatabase } from '../../mongodb';
import { RubricInterface, SeoContentCitiesInterface } from '../../uiInterfaces';

interface GetConsoleRubricDetailsPayloadInterface {
  rubric: RubricInterface;
  seoDescriptionTop: SeoContentCitiesInterface;
  seoDescriptionBottom: SeoContentCitiesInterface;
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

  const seoDescriptionTop = await getRubricAllSeoContents({
    rubricSlug: rubric.slug,
    rubricId: rubric._id,
    position: CATALOGUE_SEO_TEXT_POSITION_TOP,
    companySlug,
    locale,
  });

  const seoDescriptionBottom = await getRubricAllSeoContents({
    rubricSlug: rubric.slug,
    rubricId: rubric._id,
    position: CATALOGUE_SEO_TEXT_POSITION_BOTTOM,
    companySlug,
    locale,
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
