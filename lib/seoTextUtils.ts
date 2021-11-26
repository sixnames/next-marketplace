import {
  FILTER_CATEGORY_KEY,
  FILTER_SEPARATOR,
  PAGE_EDITOR_DEFAULT_VALUE_STRING,
  ROUTE_CATALOGUE,
  SORT_ASC,
} from 'config/common';
import { COL_CATEGORIES, COL_CITIES, COL_SEO_CONTENTS } from 'db/collectionNames';
import {
  CategoryModel,
  CityModel,
  DescriptionPositionType,
  ObjectIdModel,
  SeoContentModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { SeoContentCitiesInterface } from 'db/uiInterfaces';
import { sortStringArray } from 'lib/stringUtils';
import { getCatalogueSeoTextSlug } from 'lib/textUniquenessUtils';

async function getCitiesList(): Promise<CityModel[]> {
  const { db } = await getDatabase();
  return db
    .collection<CityModel>(COL_CITIES)
    .find(
      {},
      {
        sort: {
          _id: SORT_ASC,
        },
      },
    )
    .toArray();
}

// rubric
interface GetRubricSeoTextInterface {
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
}: GetRubricSeoTextInterface): Promise<SeoContentModel | null> {
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

interface GetRubricAllSeoTextsInterface extends Omit<GetRubricSeoTextInterface, 'citySlug'> {}
export async function getRubricAllSeoTexts({
  companySlug,
  position,
  rubricSlug,
}: GetRubricAllSeoTextsInterface): Promise<SeoContentCitiesInterface> {
  const cities = await getCitiesList();
  let payload: SeoContentCitiesInterface = {};
  for await (const city of cities) {
    const seoText = await getRubricSeoText({
      companySlug,
      position,
      rubricSlug,
      citySlug: city.slug,
    });
    if (seoText) {
      payload[city.slug] = seoText;
    }
  }
  return payload;
}

// category
interface GetCategorySeoTextInterface {
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
}: GetCategorySeoTextInterface): Promise<SeoContentModel | null> {
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

interface GetCategoryAllSeoTextsInterface extends Omit<GetCategorySeoTextInterface, 'citySlug'> {}
export async function getCategoryAllSeoTexts({
  companySlug,
  position,
  categoryId,
}: GetCategoryAllSeoTextsInterface): Promise<SeoContentCitiesInterface> {
  const cities = await getCitiesList();
  let payload: SeoContentCitiesInterface = {};
  for await (const city of cities) {
    const seoText = await getCategorySeoText({
      companySlug,
      position,
      categoryId,
      citySlug: city.slug,
    });
    if (seoText) {
      payload[city.slug] = seoText;
    }
  }
  return payload;
}

// product
