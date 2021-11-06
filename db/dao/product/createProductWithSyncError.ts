import { DEFAULT_COUNTERS_OBJECT, IMAGE_FALLBACK } from 'config/common';
import {
  COL_NOT_SYNCED_PRODUCTS,
  COL_PRODUCTS,
  COL_RUBRICS,
  COL_SHOP_PRODUCTS,
  COL_SHOPS,
} from 'db/collectionNames';
import { CreateProductInputInterface } from 'db/dao/product/createProduct';
import {
  ProductModel,
  ProductPayloadModel,
  RubricModel,
  ShopModel,
  ShopProductModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { DaoPropsInterface } from 'db/uiInterfaces';
import { saveAlgoliaObjects } from 'lib/algoliaUtils';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getNextItemId } from 'lib/itemIdUtils';
import { checkBarcodeIntersects } from 'lib/productUtils';
import { getOperationPermission, getRequestParams } from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';

export interface CreateProductWithSyncErrorInputInterface {
  shopId: string;
  available: number;
  price: number;
  productFields: CreateProductInputInterface;
}

export async function createProductWithSyncError({
  context,
  input,
}: DaoPropsInterface<CreateProductWithSyncErrorInputInterface>): Promise<ProductPayloadModel> {
  const { getApiMessage, locale } = await getRequestParams(context);
  const { db, client } = await getDatabase();
  const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
  const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
  const shopsCollection = db.collection<ShopModel>(COL_SHOPS);
  const notSyncedProductsCollection = db.collection<ShopModel>(COL_NOT_SYNCED_PRODUCTS);
  const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);

  const session = client.startSession();

  let mutationPayload: ProductPayloadModel = {
    success: false,
    message: await getApiMessage(`products.update.error`),
  };

  try {
    await session.withTransaction(async () => {
      // check input
      if (!input) {
        await session.abortTransaction();
        return;
      }

      // permission
      const { allow, message } = await getOperationPermission({
        context,
        slug: 'createProduct',
      });
      if (!allow) {
        mutationPayload = {
          success: false,
          message,
        };
        await session.abortTransaction();
        return;
      }

      const { productFields, available, price, shopId } = input;

      // check barcode intersects
      const barcodeDoubles = await checkBarcodeIntersects({
        locale,
        barcode: productFields.barcode,
        productId: null,
      });
      if (barcodeDoubles.length > 0) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`products.create.error`),
          barcodeDoubles,
        };
        await session.abortTransaction();
        return;
      }

      // get selected rubric
      const rubricObjectId = new ObjectId(productFields.rubricId);
      const rubric = await rubricsCollection.findOne({ _id: rubricObjectId });
      if (!rubric) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`products.create.error`),
        };
        await session.abortTransaction();
        return;
      }

      // check shop availability
      const shopObjectId = new ObjectId(shopId);
      const shop = await shopsCollection.findOne({ _id: shopObjectId });
      if (!shop) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`shops.update.notFound`),
        };
        await session.abortTransaction();
        return;
      }

      // check if shop product already exist
      const existingShopProducts: ShopProductModel[] = [];
      for await (const barcode of productFields.barcode) {
        const shopProduct = await shopProductsCollection.findOne({
          barcode,
          shopId: shop._id,
        });
        if (shopProduct) {
          existingShopProducts.push(shopProduct);
        }
      }
      if (existingShopProducts.length > 0) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`shopProducts.create.duplicate`),
        };
        await session.abortTransaction();
        return;
      }

      // create product
      const productItemId = await getNextItemId(COL_PRODUCTS);
      const productId = new ObjectId();
      const createdProductResult = await productsCollection.insertOne({
        ...productFields,
        _id: productId,
        itemId: productItemId,
        slug: productItemId,
        mainImage: IMAGE_FALLBACK,
        rubricId: rubric._id,
        rubricSlug: rubric.slug,
        active: false,
        selectedOptionsSlugs: [],
        selectedAttributesIds: [],
        titleCategoriesSlugs: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const createdProduct = await productsCollection.findOne({
        _id: createdProductResult.insertedId,
      });
      if (!createdProductResult.acknowledged || !createdProduct) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`products.create.error`),
        };
        await session.abortTransaction();
        return;
      }

      // create product algolia object
      const productAlgoliaResult = await saveAlgoliaObjects({
        indexName: `${process.env.ALG_INDEX_PRODUCTS}`,
        objects: [
          {
            _id: createdProduct._id.toHexString(),
            objectID: createdProduct._id.toHexString(),
            itemId: createdProduct.itemId,
            originalName: createdProduct.originalName,
            nameI18n: createdProduct.nameI18n,
            descriptionI18n: createdProduct.descriptionI18n,
            barcode: createdProduct.barcode,
          },
        ],
      });
      if (!productAlgoliaResult) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`products.create.error`),
        };
        await session.abortTransaction();
        return;
      }

      // delete sync errors
      const removedNotSyncedProductsResult = await notSyncedProductsCollection.deleteMany({
        barcode: {
          $in: productFields.barcode,
        },
      });
      if (!removedNotSyncedProductsResult.acknowledged) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`products.create.error`),
        };
        await session.abortTransaction();
        return;
      }

      const shopProductItemId = await getNextItemId(COL_SHOP_PRODUCTS);
      const createdShopProductResult = await shopProductsCollection.insertOne({
        barcode: productFields.barcode,
        available,
        price,
        itemId: shopProductItemId,
        productId,
        discountedPercent: 0,
        shopId: shop._id,
        citySlug: shop.citySlug,
        oldPrices: [],
        rubricId: createdProduct.rubricId,
        rubricSlug: createdProduct.rubricSlug,
        companyId: shop.companyId,
        brandSlug: createdProduct.brandSlug,
        mainImage: createdProduct.mainImage,
        brandCollectionSlug: createdProduct.brandCollectionSlug,
        manufacturerSlug: createdProduct.manufacturerSlug,
        selectedOptionsSlugs: createdProduct.selectedOptionsSlugs,
        updatedAt: new Date(),
        createdAt: new Date(),
        ...DEFAULT_COUNTERS_OBJECT,
      });
      if (!createdShopProductResult.acknowledged) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`shopProducts.create.error`),
        };
        await session.abortTransaction();
        return;
      }

      mutationPayload = {
        success: true,
        message: await getApiMessage('shopProducts.create.success'),
        payload: createdProduct,
      };
    });

    return mutationPayload;
  } catch (e) {
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  } finally {
    await session.endSession();
  }
}
