import { ObjectId } from 'mongodb';
import { getDatabase } from 'db/mongodb';
import {
  COL_CITIES,
  COL_PRODUCT_FACETS,
  COL_PRODUCTS,
  COL_SHOP_PRODUCTS,
  COL_SHOPS,
} from 'db/collectionNames';
import {
  CitiesBooleanModel,
  CitiesCounterModel,
  CityModel,
  ObjectIdModel,
  ProductFacetModel,
  ProductModel,
  ShopModel,
  ShopProductModel,
} from 'db/dbModels';

interface UpdateProductShopsDataInterface {
  productId: ObjectId;
}
export async function updateProductShopsData({
  productId,
}: UpdateProductShopsDataInterface): Promise<ProductModel> {
  const db = await getDatabase();
  const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
  const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
  const productFacetsCollection = db.collection<ProductFacetModel>(COL_PRODUCT_FACETS);
  const citiesCollection = db.collection<CityModel>(COL_CITIES);
  const cities = await citiesCollection.find({}).toArray();

  const availabilityCities: CitiesBooleanModel = {};
  const shopProductsCountCities: CitiesCounterModel = {};
  const minPriceCities: CitiesCounterModel = {};
  const maxPriceCities: CitiesCounterModel = {};
  let shopProductsIds: ObjectIdModel[] = [];

  for await (const city of cities) {
    const citySlug = city.slug;

    // Get shop products data for current product and city
    const shopProductsData = await shopProductsCollection
      .aggregate<any>([
        { $match: { productId, citySlug } },
        {
          $group: {
            _id: '$citySlug',
            count: { $sum: 1 },
            prices: { $push: '$price' },
            ids: { $push: '$_id' },
            available: { $push: '$available' },
          },
        },
        {
          $addFields: {
            minPrice: { $min: '$prices' },
            maxPrice: { $max: '$prices' },
            available: { $max: '$available' },
          },
        },
      ])
      .toArray();

    if (shopProductsData.length < 1) {
      shopProductsCountCities[citySlug] = 0;
      minPriceCities[citySlug] = 0;
      maxPriceCities[citySlug] = 0;
      availabilityCities[citySlug] = false;
      continue;
    }

    // Cast shop products data
    const cityShopProductsIds = shopProductsData.reduce((acc: ObjectId[], group) => {
      const { ids = [], minPrice, maxPrice, count, available } = group;
      shopProductsCountCities[citySlug] = count || 0;
      minPriceCities[citySlug] = minPrice || 0;
      maxPriceCities[citySlug] = maxPrice || 0;
      availabilityCities[citySlug] = available > 0;

      return [...acc, ...ids];
    }, []);

    shopProductsIds = [...shopProductsIds, ...cityShopProductsIds];
  }

  // Update product with new shops products data
  const updatedProductResult = await productsCollection.findOneAndUpdate(
    { _id: productId },
    {
      $set: {
        active: shopProductsIds.length > 0,
        shopProductsCountCities,
        minPriceCities,
        maxPriceCities,
        availabilityCities,
      },
    },
    {
      returnOriginal: false,
    },
  );
  const updatedProductFacetResult = await productFacetsCollection.findOneAndUpdate(
    { _id: productId },
    {
      $set: {
        active: shopProductsIds.length > 0,
        minPriceCities,
        maxPriceCities,
        availabilityCities,
      },
    },
    {
      returnOriginal: false,
    },
  );
  if (
    !updatedProductResult.ok ||
    !updatedProductResult.value ||
    !updatedProductFacetResult.ok ||
    !updatedProductFacetResult.value
  ) {
    throw Error('Product shops data update error');
  }

  return updatedProductResult.value;
}

interface UpdateProductsShopsDataOnShopsArchiveInterface {
  shopsIds: ObjectId[];
}

export async function updateProductsShopsDataOnShopsArchive({
  shopsIds,
}: UpdateProductsShopsDataOnShopsArchiveInterface) {
  const db = await getDatabase();
  const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
  const shopsCollection = db.collection<ShopModel>(COL_SHOPS);

  // Get all shops of company then get shop products ids from shops
  const shops = await shopsCollection.find({ _id: { $in: shopsIds } }).toArray();
  const shopsProductsIds: ObjectId[] = [];
  for await (const shop of shops) {
    const shopProducts = await shopProductsCollection.find({ shopId: shop._id }).toArray();
    const localShopProductsIds = shopProducts.map(({ _id }) => _id);
    localShopProductsIds.forEach((_id) => shopsProductsIds.push(_id));
  }

  // Update all products of shops
  for await (const shopProductId of shopsProductsIds) {
    const shopProduct = await shopProductsCollection.findOne({ _id: shopProductId });
    if (!shopProduct) {
      throw Error('Shop product not found in updateProductsShopsDataOnShopArchive');
    }
    await updateProductShopsData({ productId: shopProduct.productId });
  }
}
