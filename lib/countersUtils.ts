import { VIEWS_COUNTER_STEP } from 'config/common';
import {
  COL_BRAND_COLLECTIONS,
  COL_BRANDS,
  COL_MANUFACTURERS,
  COL_RUBRICS,
} from 'db/collectionNames';
import {
  BrandCollectionModel,
  BrandModel,
  ManufacturerModel,
  RoleModel,
  RubricAttributeModel,
  RubricModel,
  RubricOptionModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { noNaN } from 'lib/numbers';
import { FilterQuery } from 'mongodb';

export interface UpdateModelViewsInterface {
  city: string;
  collectionName: string;
  queryFilter: FilterQuery<any>;
}

export async function updateModelViews({
  city,
  queryFilter,
  collectionName,
}: UpdateModelViewsInterface) {
  const db = await getDatabase();
  const collection = db.collection(collectionName);
  await collection.updateMany(queryFilter, {
    $inc: {
      [`views.${city}`]: VIEWS_COUNTER_STEP,
    },
  });
}

export interface GetRubricCatalogueOptionsInterface {
  options: RubricOptionModel[];
  selectedOptionsSlugs: string[];
  city: string;
}

export function updateRubricOptionsViews({
  options,
  selectedOptionsSlugs,
  city,
}: GetRubricCatalogueOptionsInterface): RubricOptionModel[] {
  return options.map((option) => {
    if (selectedOptionsSlugs.includes(option.slug)) {
      if (!option.views) {
        option.views = { [city]: VIEWS_COUNTER_STEP };
      } else {
        option.views[city] = noNaN(option.views[city]) + VIEWS_COUNTER_STEP;
      }
    }

    return {
      ...option,
      options: updateRubricOptionsViews({
        options: option.options,
        selectedOptionsSlugs,
        city,
      }),
    };
  });
}

export interface UpdateRubricViewsInterface {
  sessionRole: RoleModel;
  city: string;
  rubricSlug: string;
  selectedOptionsSlugs: string[];
  selectedBrandSlugs: string[];
  selectedBrandCollectionSlugs: string[];
  selectedManufacturerSlugs: string[];
}

export async function updateRubricViews({
  city,
  rubricSlug,
  sessionRole,
  selectedOptionsSlugs,
  selectedBrandSlugs,
  selectedBrandCollectionSlugs,
  selectedManufacturerSlugs,
}: UpdateRubricViewsInterface): Promise<RubricModel | null> {
  try {
    const db = await getDatabase();
    const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
    const brandsCollection = db.collection<BrandModel>(COL_BRANDS);
    const brandCollectionsCollection = db.collection<BrandCollectionModel>(COL_BRAND_COLLECTIONS);
    const manufacturersCollection = db.collection<ManufacturerModel>(COL_MANUFACTURERS);

    const rubric = await rubricsCollection.findOne({ slug: rubricSlug });
    if (!rubric) {
      return null;
    }

    if (sessionRole.isStaff) {
      return rubric;
    }

    const counterUpdater = {
      $inc: {
        [`views.${city}`]: VIEWS_COUNTER_STEP,
      },
    };

    // Update brand counters
    if (selectedBrandSlugs.length > 0) {
      await brandsCollection.updateMany({ slug: { $in: selectedBrandSlugs } }, counterUpdater);
    }

    // Update brand collection counters
    if (selectedBrandCollectionSlugs.length > 0) {
      await brandCollectionsCollection.updateMany(
        { slug: { $in: selectedBrandCollectionSlugs } },
        counterUpdater,
      );
    }

    // Update manufacturer counters
    if (selectedManufacturerSlugs.length > 0) {
      await manufacturersCollection.updateMany(
        { slug: { $in: selectedManufacturerSlugs } },
        counterUpdater,
      );
    }

    // Update rubric counters
    const attributesSlugs = selectedOptionsSlugs.map((selectedSlug) => {
      return selectedSlug.split('-')[0];
    });

    const updatedAttributes: RubricAttributeModel[] = [];
    rubric.attributes.forEach((attribute) => {
      if (attributesSlugs.includes(attribute.slug)) {
        attribute.views[city] = noNaN(attribute.views[city]) + VIEWS_COUNTER_STEP;
        const updatedOptions = updateRubricOptionsViews({
          selectedOptionsSlugs,
          options: attribute.options,
          city,
        }).sort((optionA, optionB) => {
          const optionACounter = noNaN(optionA.views[city]) + noNaN(optionA.priorities[city]);
          const optionBCounter = noNaN(optionB.views[city]) + noNaN(optionB.priorities[city]);
          return optionBCounter - optionACounter;
        });

        attribute.options = updatedOptions;
      }
      updatedAttributes.push(attribute);
    });

    const sortedAttributes = updatedAttributes.sort((attributeA, attributeB) => {
      const optionACounter = noNaN(attributeA.views[city]) + noNaN(attributeA.priorities[city]);
      const optionBCounter = noNaN(attributeB.views[city]) + noNaN(attributeB.priorities[city]);
      return optionBCounter - optionACounter;
    });

    const updatedRubricResult = await rubricsCollection.findOneAndUpdate(
      { slug: rubricSlug },
      {
        ...counterUpdater,
        $set: {
          attributes: sortedAttributes,
        },
      },
      { returnOriginal: false },
    );
    const updatedRubric = updatedRubricResult.value;
    if (!updatedRubricResult.ok || !updatedRubric) {
      return null;
    }
    return updatedRubric;
  } catch (e) {
    console.log(e);
    return null;
  }
}
