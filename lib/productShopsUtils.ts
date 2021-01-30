import { ObjectId } from 'mongodb';
import { getDatabase } from 'db/mongodb';
import { COL_PRODUCTS, COL_SHOP_PRODUCTS, COL_SHOPS } from 'db/collectionNames';
import { ProductModel, ShopModel, ShopProductModel, TranslationModel } from 'db/dbModels';

interface UpdateProductShopsDataInterface {
  productId: ObjectId;
}
export async function updateProductShopsData({
  productId,
}: UpdateProductShopsDataInterface): Promise<ProductModel> {
  const db = await getDatabase();
  const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
  const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);

  // Get shop products data for current product
  const shopProductsData = await shopProductsCollection
    .aggregate<any>([
      { $match: { productId, archive: false } },
      {
        $group: {
          _id: '$citySlug',
          count: { $sum: 1 },
          prices: { $push: '$price' },
          ids: { $push: '$_id' },
        },
      },
      {
        $addFields: {
          minPrice: { $min: '$prices' },
          maxPrice: { $max: '$prices' },
        },
      },
    ])
    .toArray();

  // Cast shop products data
  const shopProductsCountCities: TranslationModel = {};
  const minPriceCities: TranslationModel = {};
  const maxPriceCities: TranslationModel = {};

  const shopProductsIds = shopProductsData.reduce((acc: ObjectId[], group) => {
    const { ids = [], _id, minPrice, maxPrice, count } = group;
    shopProductsCountCities[_id] = count;
    minPriceCities[_id] = minPrice;
    maxPriceCities[_id] = maxPrice;

    return [...acc, ...ids];
  }, []);

  // Update product with new shops products data
  const updatedProductResult = await productsCollection.findOneAndUpdate(
    { _id: productId },
    {
      $set: {
        shopProductsIds,
        shopProductsCountCities,
        minPriceCities,
        maxPriceCities,
      },
    },
    {
      returnOriginal: false,
    },
  );
  if (!updatedProductResult.ok || !updatedProductResult.value) {
    console.log(updatedProductResult);
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
    const shopProducts = await shopProductsCollection
      .find({ _id: { $in: shop.shopProductsIds } })
      .toArray();
    const shopProductsIds = shopProducts.map(({ _id }) => _id);
    shopProductsIds.forEach((_id) => shopsProductsIds.push(_id));
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
