import { ObjectId } from 'mongodb';
import {
  CATALOGUE_SEO_TEXT_POSITION_BOTTOM,
  CATALOGUE_SEO_TEXT_POSITION_TOP,
} from '../../../config/common';
import { getFieldStringLocale } from '../../../lib/i18n';
import { getCategoryAllSeoContents } from '../../../lib/seoContentUtils';
import { COL_CATEGORIES, COL_ICONS, COL_RUBRICS } from '../../collectionNames';
import { getDatabase } from '../../mongodb';
import { CategoryInterface, SeoContentCitiesInterface } from '../../uiInterfaces';

interface GetConsoleCategoryDetailsPayloadInterface {
  category: CategoryInterface;
  seoDescriptionTop: SeoContentCitiesInterface;
  seoDescriptionBottom: SeoContentCitiesInterface;
}

interface GetConsoleCategoryDetailsInterface {
  categoryId: string;
  companySlug: string;
  locale: string;
}

export async function getConsoleCategoryDetails({
  categoryId,
  companySlug,
  locale,
}: GetConsoleCategoryDetailsInterface): Promise<GetConsoleCategoryDetailsPayloadInterface | null> {
  const { db } = await getDatabase();
  const categoriesCollection = db.collection<CategoryInterface>(COL_CATEGORIES);
  const categoryAggregation = await categoriesCollection
    .aggregate<CategoryInterface>([
      {
        $match: {
          _id: new ObjectId(categoryId),
        },
      },
      {
        $lookup: {
          from: COL_RUBRICS,
          as: 'rubric',
          let: {
            rubricId: '$rubricId',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$rubricId'],
                },
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: COL_ICONS,
          as: 'icon',
          let: {
            documentId: '$_id',
          },
          pipeline: [
            {
              $match: {
                collectionName: COL_CATEGORIES,
                $expr: {
                  $eq: ['$documentId', '$$documentId'],
                },
              },
            },
          ],
        },
      },

      {
        $addFields: {
          icon: {
            $arrayElemAt: ['$icon', 0],
          },
          rubric: {
            $arrayElemAt: ['$rubric', 0],
          },
        },
      },
    ])
    .toArray();
  const initialCategory = categoryAggregation[0];
  if (!initialCategory) {
    return null;
  }

  const category: CategoryInterface = {
    ...initialCategory,
    name: getFieldStringLocale(initialCategory.nameI18n, locale),
    rubric: initialCategory.rubric
      ? {
          ...initialCategory.rubric,
          name: getFieldStringLocale(initialCategory.rubric.nameI18n, locale),
        }
      : null,
  };

  const seoDescriptionTop = await getCategoryAllSeoContents({
    companySlug,
    rubricSlug: category.rubricSlug,
    categoryId: category._id,
    position: CATALOGUE_SEO_TEXT_POSITION_TOP,
    locale,
  });

  const seoDescriptionBottom = await getCategoryAllSeoContents({
    companySlug,
    rubricSlug: category.rubricSlug,
    categoryId: category._id,
    position: CATALOGUE_SEO_TEXT_POSITION_BOTTOM,
    locale,
  });

  if (!seoDescriptionBottom || !seoDescriptionTop) {
    return null;
  }

  return {
    category,
    seoDescriptionTop,
    seoDescriptionBottom,
  };
}
