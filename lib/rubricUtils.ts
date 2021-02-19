import {
  ATTRIBUTE_VARIANT_MULTIPLE_SELECT,
  ATTRIBUTE_VARIANT_SELECT,
  CATALOGUE_NAV_VISIBLE_OPTIONS,
  DEFAULT_LOCALE,
} from 'config/common';
import { COL_CITIES, COL_CONFIGS, COL_PRODUCTS, COL_RUBRICS } from 'db/collectionNames';
import {
  CitiesBooleanModel,
  CitiesCounterModel,
  CityModel,
  ConfigModel,
  GenderModel,
  ObjectIdModel,
  ProductModel,
  RubricAttributeModel,
  RubricModel,
  RubricOptionModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { noNaN } from 'lib/numbers';
import { Collection } from 'mongodb';

export interface RecalculateRubricOptionProductCountersInterface {
  rubricId: ObjectIdModel;
  option: RubricOptionModel;
  cities: CityModel[];
  productsCollection: Collection<ProductModel>;
  rubricGender: GenderModel;
}

export async function recalculateRubricOptionProductCounters({
  rubricId,
  option,
  cities,
  productsCollection,
  rubricGender,
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

  const visibleInCatalogueCities: CitiesBooleanModel = {};
  for (const city of cities) {
    const citySlug = city.slug;
    const cityCounter = noNaN(optionShopProductsCountCities[citySlug]);
    visibleInCatalogueCities[citySlug] = cityCounter > 0;
  }

  const currentVariant = option.variants[rubricGender];
  const optionNameTranslations = currentVariant || option.nameI18n;

  const options: RubricOptionModel[] = [];
  for await (const nestedOption of option.options) {
    const recalculatedOption = await recalculateRubricOptionProductCounters({
      cities,
      productsCollection,
      option: nestedOption,
      rubricId,
      rubricGender,
    });
    options.push(recalculatedOption);
  }

  return {
    ...option,
    nameI18n: optionNameTranslations,
    options,
    shopProductsCountCities: optionShopProductsCountCities,
    productsCount,
    activeProductsCount,
    visibleInCatalogueCities,
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
          rubricGender: rubric.catalogueTitle.gender,
          option,
        });

        updatedOptions.push(updatedOption);
      }

      const visibleInCatalogueCities: CitiesBooleanModel = {};
      for (const city of cities) {
        const citySlug = city.slug;
        visibleInCatalogueCities[citySlug] = updatedOptions.some(({ visibleInCatalogueCities }) => {
          return noNaN(visibleInCatalogueCities[citySlug]) > 0;
        });
      }

      updatedAttributes.push({
        ...attribute,
        options: updatedOptions,
        visibleInCatalogueCities,
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

    const visibleInCatalogueCities: CitiesBooleanModel = {};
    for (const city of cities) {
      const citySlug = city.slug;
      const cityCounter = noNaN(rubricShopProductsCountCities[citySlug]);
      visibleInCatalogueCities[citySlug] = cityCounter > 0;
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
          visibleInCatalogueCities,
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

export async function getCatalogueVisibleOptionsCount(city: string): Promise<number> {
  const db = await getDatabase();
  const configsCollection = db.collection<ConfigModel>(COL_CONFIGS);

  // Get catalogue options config
  const visibleOptionsConfig = await configsCollection.findOne({
    slug: 'stickyNavVisibleOptionsCount',
  });
  let maxVisibleOptions = CATALOGUE_NAV_VISIBLE_OPTIONS;
  if (visibleOptionsConfig) {
    const configCityData = visibleOptionsConfig.cities[city];
    if (configCityData && configCityData[DEFAULT_LOCALE]) {
      maxVisibleOptions = configCityData[DEFAULT_LOCALE][0] || CATALOGUE_NAV_VISIBLE_OPTIONS;
    }
  }
  return noNaN(maxVisibleOptions);
}

export interface GetRubricCatalogueOptionsInterface {
  options: RubricOptionModel[];
  maxVisibleOptions: number;
  city: string;
}

export function getRubricCatalogueOptions({
  options,
  maxVisibleOptions,
  city,
}: GetRubricCatalogueOptionsInterface): RubricOptionModel[] {
  /*const visibleOptions = options.filter(({ visibleInCatalogueCities }) => {
    return visibleInCatalogueCities[city];
  });*/

  const sortedOptions = options
    .sort((optionA, optionB) => {
      const optionACounter =
        noNaN(optionA.views[city]) +
        noNaN(optionA.priorities[city]) +
        noNaN(optionA.shopProductsCountCities[city]);
      const optionBCounter =
        noNaN(optionB.views[city]) +
        noNaN(optionB.priorities[city]) +
        noNaN(optionA.shopProductsCountCities[city]);
      return optionBCounter - optionACounter;
    })
    .slice(0, maxVisibleOptions);

  return sortedOptions.map((option) => {
    return {
      ...option,
      options: getRubricCatalogueOptions({
        options: option.options,
        maxVisibleOptions,
        city,
      }),
    };
  });
}

export interface GetRubricCatalogueAttributesInterface {
  city: string;
  attributes: RubricAttributeModel[];
  visibleAttributesCount: number;
  visibleOptionsCount: number;
}

export async function getRubricCatalogueAttributes({
  city,
  attributes,
  visibleAttributesCount,
  visibleOptionsCount,
}: GetRubricCatalogueAttributesInterface): Promise<RubricAttributeModel[]> {
  const visibleAttributes = attributes
    .filter(({ showInCatalogueFilter, variant }) => {
      return (
        showInCatalogueFilter &&
        (variant === ATTRIBUTE_VARIANT_MULTIPLE_SELECT || variant === ATTRIBUTE_VARIANT_SELECT)
      );
    })
    .slice(0, visibleAttributesCount);

  const sortedAttributes: RubricAttributeModel[] = [];
  visibleAttributes.forEach((attribute) => {
    sortedAttributes.push({
      ...attribute,
      options: getRubricCatalogueOptions({
        options: attribute.options,
        maxVisibleOptions: visibleOptionsCount,
        city,
      }),
    });
  });

  return sortedAttributes;
}
