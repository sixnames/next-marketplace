import { DEFAULT_CITY, PAGE_EDITOR_DEFAULT_VALUE_STRING } from 'config/common';
import { COL_CATEGORY_DESCRIPTIONS, COL_RUBRIC_DESCRIPTIONS } from 'db/collectionNames';
import { CategoryDescriptionModel, ObjectIdModel, RubricDescriptionModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';

interface getRubricSeoTextInterface {
  companySlug: string;
  position: 'top' | 'bottom';
  rubricId: ObjectIdModel;
  rubricSlug: string;
}

export async function getRubricSeoText({
  companySlug,
  position,
  rubricId,
  rubricSlug,
}: getRubricSeoTextInterface): Promise<RubricDescriptionModel | null> {
  const { db } = await getDatabase();
  const rubricDescriptionsCollection =
    db.collection<RubricDescriptionModel>(COL_RUBRIC_DESCRIPTIONS);
  const description = await rubricDescriptionsCollection.findOne({
    position,
    rubricId,
    companySlug,
  });

  if (!description) {
    const newDescriptionResult = await rubricDescriptionsCollection.insertOne({
      companySlug,
      rubricId,
      position,
      assetKeys: [],
      rubricSlug,
      content: {
        [DEFAULT_CITY]: PAGE_EDITOR_DEFAULT_VALUE_STRING,
      },
    });
    if (!newDescriptionResult.acknowledged) {
      return null;
    }
    const newDescription = await rubricDescriptionsCollection.findOne({
      _id: newDescriptionResult.insertedId,
    });
    return newDescription;
  }

  return description;
}

interface getCategorySeoTextInterface {
  companySlug: string;
  position: 'top' | 'bottom';
  categoryId: ObjectIdModel;
  categorySlug: string;
}

export async function getCategorySeoText({
  companySlug,
  position,
  categoryId,
  categorySlug,
}: getCategorySeoTextInterface): Promise<CategoryDescriptionModel | null> {
  const { db } = await getDatabase();
  const rubricDescriptionsCollection =
    db.collection<CategoryDescriptionModel>(COL_CATEGORY_DESCRIPTIONS);
  const description = await rubricDescriptionsCollection.findOne({
    position,
    categoryId,
    companySlug,
  });

  if (!description) {
    const newDescriptionResult = await rubricDescriptionsCollection.insertOne({
      companySlug,
      position,
      assetKeys: [],
      categoryId,
      categorySlug,
      content: {
        [DEFAULT_CITY]: PAGE_EDITOR_DEFAULT_VALUE_STRING,
      },
    });
    if (!newDescriptionResult.acknowledged) {
      return null;
    }
    const newDescription = await rubricDescriptionsCollection.findOne({
      _id: newDescriptionResult.insertedId,
    });
    return newDescription;
  }

  return description;
}
