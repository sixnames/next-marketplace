import { CATALOGUE_OPTION_SEPARATOR } from 'config/common';
import { COL_PRODUCT_FACETS, COL_PRODUCTS, COL_RUBRICS } from 'db/collectionNames';
import {
  GenderModel,
  ObjectIdModel,
  ProductModel,
  CatalogueProductOptionInterface,
  RubricAttributeModel,
  RubricModel,
  RubricOptionModel,
  ProductFacetModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { getI18nLocaleValue } from 'lib/i18n';

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
    const productFacetsCollection = db.collection<ProductFacetModel>(COL_PRODUCT_FACETS);
    const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);

    const rubric = await rubricsCollection.findOne({ _id: rubricId });
    if (!rubric) {
      return null;
    }

    const productOptionsAggregation = await productFacetsCollection
      .aggregate<CatalogueProductOptionInterface>([
        {
          $match: {
            rubricId,
            active: true,
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

export interface GetRubricNavOptionsInterface {
  options: RubricOptionModel[];
  locale: string;
}

export function getRubricNavOptions({
  options,
  locale,
}: GetRubricNavOptionsInterface): RubricOptionModel[] {
  return options.map((option) => {
    return {
      ...option,
      name: getI18nLocaleValue(option.nameI18n, locale),
      options: getRubricNavOptions({
        options: option.options,
        locale,
      }),
    };
  });
}

export interface GetRubricNavAttributesInterface {
  locale: string;
  attributes: RubricAttributeModel[];
}

export function getRubricNavAttributes({
  locale,
  attributes,
}: GetRubricNavAttributesInterface): RubricAttributeModel[] {
  const sortedAttributes: RubricAttributeModel[] = [];
  attributes.forEach((attribute) => {
    sortedAttributes.push({
      ...attribute,
      metric: attribute.metric
        ? {
            ...attribute.metric,
            name: getI18nLocaleValue(attribute.metric.nameI18n, locale),
          }
        : null,
      name: getI18nLocaleValue(attribute.nameI18n, locale),
      options: getRubricNavOptions({
        options: attribute.options,
        locale,
      }),
    });
  });

  return sortedAttributes;
}
