import { CATALOGUE_SEO_TEXT_POSITION_BOTTOM, CATALOGUE_SEO_TEXT_POSITION_TOP } from 'config/common';
import { COL_CATEGORIES, COL_ICONS, COL_RUBRICS } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { CategoryInterface, SeoContentCitiesInterface } from 'db/uiInterfaces';
import { getFieldStringLocale } from 'lib/i18n';
import { getCategoryAllSeoTexts } from 'lib/seoTextUtils';
import { ObjectId } from 'mongodb';

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

  const seoDescriptionTop = await getCategoryAllSeoTexts({
    companySlug,
    categoryId: category._id,
    position: CATALOGUE_SEO_TEXT_POSITION_TOP,
  });

  const seoDescriptionBottom = await getCategoryAllSeoTexts({
    companySlug,
    categoryId: category._id,
    position: CATALOGUE_SEO_TEXT_POSITION_BOTTOM,
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
