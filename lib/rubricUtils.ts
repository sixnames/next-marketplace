import {
  ATTRIBUTE_VARIANT_MULTIPLE_SELECT,
  ATTRIBUTE_VARIANT_SELECT,
  CATALOGUE_OPTION_SEPARATOR,
} from 'config/common';
import { COL_PRODUCTS, COL_RUBRICS } from 'db/collectionNames';
import {
  GenderModel,
  ObjectIdModel,
  ProductModel,
  ProductOptionInterface,
  RubricAttributeModel,
  RubricModel,
  RubricOptionModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { getI18nLocaleValue } from 'lib/i18n';
import { noNaN } from 'lib/numbers';

export interface RecalculateRubricOptionProductCountersInterface {
  option: RubricOptionModel;
  rubricGender: GenderModel;
  visibleOptionsSlugs: string[];
}

export async function recalculateRubricOptionProductCounters({
  option,
  rubricGender,
  visibleOptionsSlugs,
}: RecalculateRubricOptionProductCountersInterface): Promise<RubricOptionModel> {
  const currentVariant = option.variants[rubricGender];
  const optionNameTranslations = currentVariant || option.nameI18n;
  const isSelected = visibleOptionsSlugs.includes(option.slug);

  const options: RubricOptionModel[] = [];
  for await (const nestedOption of option.options) {
    const recalculatedOption = await recalculateRubricOptionProductCounters({
      option: nestedOption,
      rubricGender,
      visibleOptionsSlugs,
    });
    options.push(recalculatedOption);
  }

  return {
    ...option,
    nameI18n: optionNameTranslations,
    options,
    isSelected,
  };
}

export interface RecalculateRubricProductCountersInterface {
  rubricId: ObjectIdModel;
}

export async function recalculateRubricProductCounters({
  rubricId,
}: RecalculateRubricProductCountersInterface): Promise<RubricModel | null> {
  try {
    const db = await getDatabase();
    const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
    const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);

    const rubric = await rubricsCollection.findOne({ _id: rubricId });
    if (!rubric) {
      return null;
    }

    const productOptionsAggregation = await productsCollection
      .aggregate<ProductOptionInterface>([
        {
          $match: {
            rubricId,
            active: true,
            archive: false,
          },
        },
        {
          $project: {
            selectedOptionsSlugs: 1,
          },
        },
        {
          $unwind: '$selectedOptionsSlugs',
        },
        {
          $group: {
            _id: '$selectedOptionsSlugs',
          },
        },
        {
          $addFields: {
            slugArray: {
              $split: ['$_id', CATALOGUE_OPTION_SEPARATOR],
            },
          },
        },
        {
          $addFields: {
            attributeSlug: {
              $arrayElemAt: ['$slugArray', 0],
            },
          },
        },
        {
          $group: {
            _id: '$attributeSlug',
            optionsSlugs: {
              $addToSet: '$_id',
            },
          },
        },
      ])
      .toArray();

    // Update rubric attributes
    const updatedAttributes: RubricAttributeModel[] = [];
    for await (const attribute of rubric.attributes) {
      const updatedOptions: RubricOptionModel[] = [];

      const attributeInConfig = productOptionsAggregation.find(({ _id }) => _id === attribute.slug);
      if (!attributeInConfig) {
        for await (const option of attribute.options) {
          updatedOptions.push({
            ...option,
            isSelected: false,
          });
        }
      } else {
        for await (const option of attribute.options) {
          const updatedOption = await recalculateRubricOptionProductCounters({
            visibleOptionsSlugs: attributeInConfig.optionsSlugs,
            rubricGender: rubric.catalogueTitle.gender,
            option,
          });
          updatedOptions.push(updatedOption);
        }
      }

      updatedAttributes.push({
        ...attribute,
        options: updatedOptions,
      });
    }

    // Update rubric counters
    const aggregationResult = await productsCollection
      .aggregate([
        {
          $match: {
            rubricId: rubricId,
            archive: false,
          },
        },
        {
          $project: {
            shopProductsCountCities: 1,
            active: 1,
          },
        },
      ])
      .toArray();

    const productsCount = aggregationResult.length;
    let activeProductsCount = 0;

    aggregationResult.forEach(({ active }) => {
      if (active) {
        activeProductsCount = activeProductsCount + 1;
      }
    });

    const updatedRubricResult = await rubricsCollection.findOneAndUpdate(
      {
        _id: rubricId,
      },
      {
        $set: {
          attributes: updatedAttributes,
          productsCount,
          activeProductsCount,
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

export interface GetRubricCatalogueOptionsInterface {
  options: RubricOptionModel[];
  maxVisibleOptions: number;
  visibleOptionsSlugs: string[];
  city: string;
}

export function getRubricCatalogueOptions({
  options,
  maxVisibleOptions,
  visibleOptionsSlugs,
  city,
}: GetRubricCatalogueOptionsInterface): RubricOptionModel[] {
  const visibleOptions = options.filter(({ slug }) => {
    return visibleOptionsSlugs.includes(slug);
  });

  const sortedOptions = visibleOptions.sort((optionA, optionB) => {
    const optionACounter = noNaN(optionA.views[city]) + noNaN(optionA.priorities[city]);
    const optionBCounter = noNaN(optionB.views[city]) + noNaN(optionB.priorities[city]);
    return optionBCounter - optionACounter;
  });
  // .slice(0, maxVisibleOptions);

  return sortedOptions.map((option) => {
    return {
      ...option,
      options: getRubricCatalogueOptions({
        options: option.options,
        maxVisibleOptions,
        visibleOptionsSlugs,
        city,
      }),
    };
  });
}

export interface GetRubricCatalogueAttributesInterface {
  city: string;
  attributes: RubricAttributeModel[];
  visibleOptionsCount: number;
  config: ProductOptionInterface[];
}

export async function getRubricCatalogueAttributes({
  city,
  attributes,
  visibleOptionsCount,
  config,
}: GetRubricCatalogueAttributesInterface): Promise<RubricAttributeModel[]> {
  const sortedAttributes: RubricAttributeModel[] = [];
  attributes.forEach((attribute) => {
    const attributeInConfig = config.find(({ _id }) => _id === attribute.slug);
    if (
      !attributeInConfig ||
      !attribute.showInCatalogueFilter ||
      !(
        attribute.variant === ATTRIBUTE_VARIANT_MULTIPLE_SELECT ||
        attribute.variant === ATTRIBUTE_VARIANT_SELECT
      )
    ) {
      return;
    }

    sortedAttributes.push({
      ...attribute,
      options: getRubricCatalogueOptions({
        options: attribute.options,
        maxVisibleOptions: visibleOptionsCount,
        visibleOptionsSlugs: attributeInConfig.optionsSlugs,
        city,
      }),
    });
  });

  return sortedAttributes;
}

export interface GetRubricNavOptionsInterface {
  options: RubricOptionModel[];
  locale: string;
  maxVisibleOptions: number;
  city: string;
}

export function getRubricNavOptions({
  options,
  maxVisibleOptions,
  city,
  locale,
}: GetRubricNavOptionsInterface): RubricOptionModel[] {
  const visibleOptions = options.filter(({ isSelected }) => {
    return isSelected;
  });

  const sortedOptions = visibleOptions
    .sort((optionA, optionB) => {
      const optionACounter = noNaN(optionA.views[city]) + noNaN(optionA.priorities[city]);
      const optionBCounter = noNaN(optionB.views[city]) + noNaN(optionB.priorities[city]);
      return optionBCounter - optionACounter;
    })
    .slice(0, maxVisibleOptions);

  return sortedOptions.map((option) => {
    return {
      ...option,
      name: getI18nLocaleValue(option.nameI18n, locale),
      options: getRubricNavOptions({
        options: option.options,
        maxVisibleOptions,
        city,
        locale,
      }),
    };
  });
}

export interface GetRubricNavAttributesInterface {
  city: string;
  locale: string;
  attributes: RubricAttributeModel[];
  visibleOptionsCount: number;
  visibleAttributesCount: number;
}

export function getRubricNavAttributes({
  city,
  locale,
  attributes,
  visibleOptionsCount,
  visibleAttributesCount,
}: GetRubricNavAttributesInterface): RubricAttributeModel[] {
  const visibleAttributes = attributes
    .filter((attribute) => {
      return (
        attribute.showInCatalogueNav &&
        (attribute.variant === ATTRIBUTE_VARIANT_MULTIPLE_SELECT ||
          attribute.variant === ATTRIBUTE_VARIANT_SELECT)
      );
    })
    .slice(0, visibleAttributesCount);

  const sortedAttributes: RubricAttributeModel[] = [];
  visibleAttributes.forEach((attribute) => {
    sortedAttributes.push({
      ...attribute,
      name: getI18nLocaleValue(attribute.nameI18n, locale),
      options: getRubricNavOptions({
        options: attribute.options,
        maxVisibleOptions: visibleOptionsCount,
        city,
        locale,
      }),
    });
  });

  return sortedAttributes;
}
