import { COL_ATTRIBUTES, COL_CITIES, COL_PRODUCTS, COL_RUBRICS } from 'db/collectionNames';
import {
  AttributeModel,
  CitiesBooleanModel,
  CitiesCounterModel,
  CityModel,
  ObjectIdModel,
  OptionModel,
  ProductModel,
  RubricAttributeModel,
  RubricModel,
  RubricOptionModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { noNaN } from 'lib/numbers';
import {
  castOptionsForAttribute,
  castOptionsForRubric,
  findRubricOptionInTree,
  updateRubricOptionInTree,
} from 'lib/optionsUtils';
import { Collection } from 'mongodb';

export interface RecalculateRubricOptionProductCountersInterface {
  rubricId: ObjectIdModel;
  option: RubricOptionModel;
  cities: CityModel[];
  productsCollection: Collection<ProductModel>;
}

export async function recalculateRubricOptionProductCounters({
  rubricId,
  option,
  cities,
  productsCollection,
}: RecalculateRubricOptionProductCountersInterface): Promise<RubricOptionModel> {
  const aggregationResult = await productsCollection
    .aggregate([
      {
        $match: {
          rubricsIds: rubricId,
          selectedOptionsSlugs: option.slug,
          active: true,
          archive: false,
        },
      },
    ])
    .toArray();

  const optionShopProductsCountCities: CitiesCounterModel = {};
  const productsCount = aggregationResult.length;
  let activeProductsCount = 0;

  aggregationResult.forEach(({ shopProductsCountCities, active }) => {
    for (const city of cities) {
      const citySlug = city.slug;
      const productCityCounter = noNaN(shopProductsCountCities[citySlug]);
      if (productCityCounter > 0) {
        optionShopProductsCountCities[citySlug] = optionShopProductsCountCities[citySlug]
          ? optionShopProductsCountCities[citySlug] + 1
          : 1;
      }
    }

    if (active) {
      activeProductsCount = activeProductsCount + 1;
    }
  });

  const visibleInNavCities: CitiesBooleanModel = {};
  for (const city of cities) {
    const citySlug = city.slug;
    const cityCounter = noNaN(optionShopProductsCountCities[citySlug]);
    visibleInNavCities[citySlug] = cityCounter > 0;
  }

  const options: RubricOptionModel[] = [];
  for await (const nestedOption of option.options) {
    const recalculatedOption = await recalculateRubricOptionProductCounters({
      cities,
      productsCollection,
      option: nestedOption,
      rubricId,
    });
    options.push(recalculatedOption);
  }

  return {
    ...option,
    options,
    shopProductsCountCities: optionShopProductsCountCities,
    productsCount,
    activeProductsCount,
    visibleInNavCities,
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
    const citiesCollection = db.collection<CityModel>(COL_CITIES);
    const cities = await citiesCollection.find({}).toArray();

    const rubric = await rubricsCollection.findOne({ _id: rubricId });
    if (!rubric) {
      return null;
    }

    // Update rubric attributes
    const updatedAttributes: RubricAttributeModel[] = [];
    for await (const attribute of rubric.attributes) {
      const updatedOptions: RubricOptionModel[] = [];

      for await (const option of attribute.options) {
        const updatedOption = await recalculateRubricOptionProductCounters({
          cities,
          productsCollection,
          rubricId: rubric._id,
          option,
        });

        updatedOptions.push(updatedOption);
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
            rubricsIds: rubricId,
            archive: false,
          },
        },
      ])
      .toArray();

    const rubricShopProductsCountCities: CitiesCounterModel = {};
    const productsCount = aggregationResult.length;
    let activeProductsCount = 0;

    aggregationResult.forEach(({ shopProductsCountCities, active }) => {
      for (const city of cities) {
        const citySlug = city.slug;
        const productCityCounter = noNaN(shopProductsCountCities[citySlug]);
        if (productCityCounter > 0) {
          rubricShopProductsCountCities[citySlug] = rubricShopProductsCountCities[citySlug]
            ? rubricShopProductsCountCities[citySlug] + 1
            : 1;
        }
      }

      if (active) {
        activeProductsCount = activeProductsCount + 1;
      }
    });

    const visibleInNavCities: CitiesBooleanModel = {};
    for (const city of cities) {
      const citySlug = city.slug;
      const cityCounter = noNaN(rubricShopProductsCountCities[citySlug]);
      visibleInNavCities[citySlug] = cityCounter > 0;
    }

    const updatedRubricResult = await rubricsCollection.findOneAndUpdate(
      {
        _id: rubricId,
      },
      {
        $set: {
          attributes: updatedAttributes,
          productsCount,
          activeProductsCount,
          shopProductsCountCities: rubricShopProductsCountCities,
          visibleInNavCities,
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

export interface UpdateOptionsListInterface {
  optionsGroupId: ObjectIdModel;
  options: OptionModel[];
}

export async function updateOptionsList({
  options,
  optionsGroupId,
}: UpdateOptionsListInterface): Promise<boolean> {
  try {
    const db = await getDatabase();
    const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
    const attributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);

    const attributes = await attributesCollection.find({ optionsGroupId }).toArray();

    // Update attributes options list
    const updatedAttributes: AttributeModel[] = [];
    for await (const attribute of attributes) {
      const updatedAttributeResult = await attributesCollection.findOneAndUpdate(
        { _id: attribute._id },
        {
          $set: {
            options: castOptionsForAttribute({ options, attributeSlug: attribute.slug }),
          },
        },
        {
          returnOriginal: false,
        },
      );

      if (!updatedAttributeResult.ok || !updatedAttributeResult.value) {
        continue;
      }
      updatedAttributes.push(updatedAttributeResult.value);
    }
    if (updatedAttributes.length !== attributes.length) {
      return false;
    }

    // Update rubrics options list
    const updatedRubrics: RubricModel[] = [];
    const attributesIds = updatedAttributes.map(({ _id }) => _id);
    const rubrics = await rubricsCollection
      .find({ 'attributes._id': { $in: attributesIds } })
      .toArray();

    for await (const rubric of rubrics) {
      const rubricAttributes = rubric.attributes.reduce(
        (acc: RubricAttributeModel[], rubricAttribute) => {
          const attribute = updatedAttributes.find(({ _id }) => _id.equals(rubricAttribute._id));
          if (attribute) {
            const castedOptions = castOptionsForRubric(attribute.options);
            return [
              ...acc,
              {
                ...rubricAttribute,
                options: updateRubricOptionInTree({
                  options: castedOptions,
                  condition: (treeOption) => {
                    const exist = findRubricOptionInTree({
                      options: rubricAttribute.options,
                      condition: (rubricTreeOption) => {
                        return treeOption._id.equals(rubricTreeOption._id);
                      },
                    });
                    return Boolean(exist);
                  },
                  updater: (treeOption) => {
                    const rubricOption = findRubricOptionInTree({
                      options: rubricAttribute.options,
                      condition: (rubricTreeOption) => {
                        return treeOption._id.equals(rubricTreeOption._id);
                      },
                    });
                    return {
                      ...rubricOption,
                      ...treeOption,
                    };
                  },
                }),
              },
            ];
          }
          return [...acc, rubricAttribute];
        },
        [],
      );

      const updatedRubricResult = await rubricsCollection.findOneAndUpdate(
        { _id: rubric._id },
        {
          $set: {
            attributes: rubricAttributes,
          },
        },
      );
      if (!updatedRubricResult.ok || !updatedRubricResult.value) {
        continue;
      }
      updatedRubrics.push(updatedRubricResult.value);
    }

    if (updatedRubrics.length !== rubrics.length) {
      return false;
    }
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}
