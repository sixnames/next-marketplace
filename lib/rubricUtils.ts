import {
  FILTER_CATEGORY_KEY,
  FILTER_SEPARATOR,
  PAGE_EDITOR_DEFAULT_VALUE_STRING,
  ROUTE_CATALOGUE,
} from 'config/common';
import { COL_CATEGORIES, COL_SEO_CONTENTS } from 'db/collectionNames';
import {
  CategoryModel,
  DescriptionPositionType,
  ObjectIdModel,
  SeoContentModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { sortStringArray } from 'lib/stringUtils';
import { getCatalogueSeoTextSlug } from 'lib/textUniquenessUtils';

interface getRubricSeoTextInterface {
  companySlug: string;
  position: DescriptionPositionType;
  rubricSlug: string;
  citySlug: string;
}

export async function getRubricSeoText({
  companySlug,
  position,
  rubricSlug,
  citySlug,
}: getRubricSeoTextInterface): Promise<SeoContentModel | null> {
  const { db } = await getDatabase();

  const seoTextSlug = await getCatalogueSeoTextSlug({
    filters: [],
    companySlug,
    rubricSlug,
    citySlug,
  });
  if (!seoTextSlug) {
    return null;
  }

  const seoContentsCollection = db.collection<SeoContentModel>(COL_SEO_CONTENTS);
  const seoText = await seoContentsCollection.findOne({
    slug: seoTextSlug,
    position,
  });

  const url = `/${companySlug}/${citySlug}${ROUTE_CATALOGUE}/${rubricSlug}`;
  if (!seoText) {
    const newSeoTextResult = await seoContentsCollection.insertOne({
      url,
      slug: seoTextSlug,
      content: PAGE_EDITOR_DEFAULT_VALUE_STRING,
      position,
    });
    if (!newSeoTextResult.acknowledged) {
      return null;
    }
    const newSeoText = await seoContentsCollection.findOne({
      _id: newSeoTextResult.insertedId,
    });
    return newSeoText;
  }

  return seoText;
}

interface getCategorySeoTextInterface {
  companySlug: string;
  citySlug: string;
  position: DescriptionPositionType;
  categoryId: ObjectIdModel;
}

export async function getCategorySeoText({
  companySlug,
  position,
  categoryId,
  citySlug,
}: getCategorySeoTextInterface): Promise<SeoContentModel | null> {
  const { db } = await getDatabase();
  const categoriesCollection = db.collection<CategoryModel>(COL_CATEGORIES);
  const category = await categoriesCollection.findOne({
    _id: categoryId,
  });
  if (!category) {
    return null;
  }
  const categoriesTree = await categoriesCollection
    .find({
      _id: {
        $in: category.parentTreeIds,
      },
    })
    .toArray();
  const filters = categoriesTree.map(({ slug }) => {
    return `${FILTER_CATEGORY_KEY}${FILTER_SEPARATOR}${slug}`;
  });
  const sortedFilters = sortStringArray(filters);
  const url = `/${companySlug}/${citySlug}${ROUTE_CATALOGUE}/${
    category.rubricSlug
  }/${sortedFilters.join('/')}`;

  const seoTextSlug = await getCatalogueSeoTextSlug({
    filters,
    companySlug,
    rubricSlug: category.rubricSlug,
    citySlug,
  });
  if (!seoTextSlug) {
    return null;
  }

  const seoContentsCollection = db.collection<SeoContentModel>(COL_SEO_CONTENTS);
  const seoText = await seoContentsCollection.findOne({
    slug: seoTextSlug,
    position,
  });

  if (!seoText) {
    const newSeoTextResult = await seoContentsCollection.insertOne({
      url,
      slug: seoTextSlug,
      content: PAGE_EDITOR_DEFAULT_VALUE_STRING,
      position,
    });
    if (!newSeoTextResult.acknowledged) {
      return null;
    }
    const newSeoText = await seoContentsCollection.findOne({
      _id: newSeoTextResult.insertedId,
    });
    return newSeoText;
  }

  return seoText;
}
