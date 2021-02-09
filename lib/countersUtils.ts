import { VIEWS_COUNTER_STEP } from 'config/common';
import { COL_RUBRICS } from 'db/collectionNames';
import { RubricAttributeModel, RubricModel, RubricOptionModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { noNaN } from 'lib/numbers';
import { FilterQuery } from 'mongodb';

export interface UpdateModelViewsInterface {
  sessionCity: string;
  collectionName: string;
  queryFilter: FilterQuery<any>;
}

export async function updateModelViews({
  sessionCity,
  queryFilter,
  collectionName,
}: UpdateModelViewsInterface) {
  const db = await getDatabase();
  const collection = db.collection(collectionName);
  await collection.updateMany(queryFilter, {
    $inc: {
      [`views.${sessionCity}`]: VIEWS_COUNTER_STEP,
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
      option.views[city] = noNaN(option.views[city]) + VIEWS_COUNTER_STEP;
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
  city: string;
  selectedOptionsSlugs: string[];
  selectedBrands: string[];
  selectedBrandCollections: string[];
  selectedManufacturers: string[];
  rubricSlug: string;
}

export async function updateRubricViews({
  rubricSlug,
  selectedOptionsSlugs,
  city,
}: UpdateRubricViewsInterface): Promise<RubricModel | null> {
  try {
    const db = await getDatabase();
    const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
    const attributesSlugs = selectedOptionsSlugs.map((selectedSlug) => {
      return selectedSlug.split('-')[0];
    });

    const rubric = await rubricsCollection.findOne({ slug: rubricSlug });
    if (!rubric) {
      return null;
    }

    const updatedAttributes: RubricAttributeModel[] = [];
    rubric.attributes.forEach((attribute) => {
      if (attributesSlugs.includes(attribute.slug)) {
        attribute.views[city] = noNaN(attribute.views[city]) + VIEWS_COUNTER_STEP;
        const updatedOptions = updateRubricOptionsViews({
          selectedOptionsSlugs,
          options: attribute.options,
          city,
        }).sort((optionA, optionB) => {
          const optionACounter =
            noNaN(optionA.views[city]) +
            noNaN(optionA.priorities[city]) +
            noNaN(optionA.shopProductsCountCities[city]);
          const optionBCounter =
            noNaN(optionB.views[city]) +
            noNaN(optionB.priorities[city]) +
            noNaN(optionA.shopProductsCountCities[city]);
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
        $inc: {
          [`views.${city}`]: VIEWS_COUNTER_STEP,
        },
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
