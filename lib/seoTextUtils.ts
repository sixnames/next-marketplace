import { PAGE_EDITOR_DEFAULT_VALUE_STRING } from 'config/common';
import { COL_SEO_CONTENTS } from 'db/collectionNames';
import { getCitiesList } from 'db/dao/cities/getCitiesList';
import { DescriptionPositionType, ObjectIdModel, SeoContentModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { SeoContentCitiesInterface } from 'db/uiInterfaces';
import {
  getCategorySeoTextSlug,
  getProductSeoTextSlug,
  getRubricSeoTextSlug,
} from 'lib/textUniquenessUtils';

// rubric
interface GetRubricSeoTextInterface {
  companySlug: string;
  position: DescriptionPositionType;
  rubricSlug: string;
  rubricId: ObjectIdModel;
  citySlug: string;
}

export async function getRubricSeoText({
  companySlug,
  position,
  rubricSlug,
  rubricId,
  citySlug,
}: GetRubricSeoTextInterface): Promise<SeoContentModel | null> {
  const { db } = await getDatabase();

  const seoTextSlugPayload = await getRubricSeoTextSlug({
    rubricId,
    companySlug,
    rubricSlug,
    citySlug,
  });
  if (!seoTextSlugPayload) {
    return null;
  }

  const seoContentsCollection = db.collection<SeoContentModel>(COL_SEO_CONTENTS);
  const seoText = await seoContentsCollection.findOne({
    slug: seoTextSlugPayload.seoTextSlug,
    position,
  });

  if (!seoText) {
    const newSeoTextResult = await seoContentsCollection.insertOne({
      url: seoTextSlugPayload.url,
      slug: seoTextSlugPayload.seoTextSlug,
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
  rubricId,
}: GetRubricAllSeoTextsInterface): Promise<SeoContentCitiesInterface> {
  const cities = await getCitiesList();
  let payload: SeoContentCitiesInterface = {};
  for await (const city of cities) {
    const seoText = await getRubricSeoText({
      companySlug,
      position,
      rubricSlug,
      rubricId,
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
  const seoTextSlugPayload = await getCategorySeoTextSlug({
    categoryId,
    companySlug,
    citySlug,
  });
  if (!seoTextSlugPayload) {
    return null;
  }

  const seoContentsCollection = db.collection<SeoContentModel>(COL_SEO_CONTENTS);
  const seoText = await seoContentsCollection.findOne({
    slug: seoTextSlugPayload.seoTextSlug,
    position,
  });

  if (!seoText) {
    const newSeoTextResult = await seoContentsCollection.insertOne({
      url: seoTextSlugPayload.url,
      slug: seoTextSlugPayload.seoTextSlug,
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
interface GetProductSeoTextInterface {
  companySlug: string;
  citySlug: string;
  position: DescriptionPositionType;
  productId: ObjectIdModel;
  productSlug: string;
}

export async function getProductSeoText({
  companySlug,
  position,
  productId,
  citySlug,
  productSlug,
}: GetProductSeoTextInterface): Promise<SeoContentModel | null> {
  const { db } = await getDatabase();
  const seoContentsCollection = db.collection<SeoContentModel>(COL_SEO_CONTENTS);

  const seoTextSlugPayload = await getProductSeoTextSlug({
    companySlug,
    productId,
    citySlug,
    productSlug,
  });
  if (!seoTextSlugPayload) {
    return null;
  }

  const seoText = await seoContentsCollection.findOne({
    slug: seoTextSlugPayload.seoTextSlug,
    position,
  });

  if (!seoText) {
    const newSeoTextResult = await seoContentsCollection.insertOne({
      url: seoTextSlugPayload.url,
      slug: seoTextSlugPayload.seoTextSlug,
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

interface GetProductAllSeoTextsInterface extends Omit<GetProductSeoTextInterface, 'citySlug'> {}
export async function getProductAllSeoTexts({
  companySlug,
  position,
  productId,
  productSlug,
}: GetProductAllSeoTextsInterface): Promise<SeoContentCitiesInterface> {
  const cities = await getCitiesList();
  let payload: SeoContentCitiesInterface = {};
  for await (const city of cities) {
    const seoText = await getProductSeoText({
      companySlug,
      position,
      productId,
      productSlug,
      citySlug: city.slug,
    });
    if (seoText) {
      payload[city.slug] = seoText;
    }
  }
  return payload;
}
