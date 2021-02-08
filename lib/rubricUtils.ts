import { COL_CITIES, COL_PRODUCTS, COL_RUBRICS } from 'db/collectionNames';
import {
  CitiesCounterModel,
  CityModel,
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

  const shopProductsCountCities: CitiesCounterModel = {};

  for (const city of cities) {
    const citySlug = city.slug;
    const cityCounter = aggregationResult.reduce((acc, { shopProductsCountCities }) => {
      const productCityCounter = noNaN(shopProductsCountCities[citySlug]);
      if (productCityCounter > 0) {
        return acc + 1;
      }
      return acc;
    }, 0);
    shopProductsCountCities[citySlug] = cityCounter;
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
    shopProductsCountCities,
    options,
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

    const updatedRubricResult = await rubricsCollection.findOneAndUpdate(
      {
        _id: rubricId,
      },
      {
        $set: {
          attributes: updatedAttributes,
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
