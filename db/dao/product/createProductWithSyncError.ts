import { ObjectId } from 'mongodb';
import { DEFAULT_LOCALE, IMAGE_FALLBACK } from '../../../config/common';
import getResolverErrorMessage from '../../../lib/getResolverErrorMessage';
import { getNextItemId } from '../../../lib/itemIdUtils';
import {
  castSummaryToFacet,
  castSummaryToShopProduct,
  checkBarcodeIntersects,
  updateProductTitles,
} from '../../../lib/productUtils';
import { getOperationPermission, getRequestParams } from '../../../lib/sessionHelpers';
import {
  COL_NOT_SYNCED_PRODUCTS,
  COL_PRODUCT_FACETS,
  COL_PRODUCT_SUMMARIES,
  COL_RUBRIC_VARIANTS,
  COL_RUBRICS,
  COL_SHOP_PRODUCTS,
  COL_SHOPS,
} from '../../collectionNames';
import {
  ProductFacetModel,
  ProductPayloadModel,
  ProductSummaryModel,
  RubricModel,
  RubricVariantModel,
  ShopModel,
  ShopProductModel,
} from '../../dbModels';
import { getDatabase } from '../../mongodb';
import { DaoPropsInterface } from '../../uiInterfaces';
import { CreateProductInputInterface } from './createProduct';

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
  const productFacetsCollection = db.collection<ProductFacetModel>(COL_PRODUCT_FACETS);
  const productSummariesCollection = db.collection<ProductSummaryModel>(COL_PRODUCT_SUMMARIES);
  const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
  const shopsCollection = db.collection<ShopModel>(COL_SHOPS);
  const notSyncedProductsCollection = db.collection<ShopModel>(COL_NOT_SYNCED_PRODUCTS);
  const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
  const rubricVariantsCollection = db.collection<RubricVariantModel>(COL_RUBRIC_VARIANTS);

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

      // get rubric variant
      const rubricVariant = await rubricVariantsCollection.findOne({ _id: rubric.variantId });
      if (!rubricVariant) {
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
      const productItemId = await getNextItemId(COL_PRODUCT_FACETS);
      const productId = new ObjectId();
      const createdProductSummaryResult = await productSummariesCollection.insertOne({
        ...productFields,
        _id: productId,
        itemId: productItemId,
        slug: productItemId,
        snippetTitleI18n: {
          [DEFAULT_LOCALE]: productFields.originalName || '',
        },
        cardTitleI18n: {
          [DEFAULT_LOCALE]: productFields.originalName || '',
        },
        mainImage: IMAGE_FALLBACK,
        rubricId: rubric._id,
        rubricSlug: rubric.slug,
        active: true,
        allowDelivery: Boolean(rubricVariant.allowDelivery),
        filterSlugs: [],
        attributeIds: [],
        attributes: [],
        categorySlugs: [],
        variants: [],
        assets: [IMAGE_FALLBACK],
        titleCategorySlugs: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const createdProductSummary = await productSummariesCollection.findOne({
        _id: createdProductSummaryResult.insertedId,
      });
      if (!createdProductSummaryResult.acknowledged || !createdProductSummary) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`products.create.error`),
        };
        await session.abortTransaction();
        return;
      }
      const facet = castSummaryToFacet({
        summary: createdProductSummary,
      });
      const createdFacetResult = await productFacetsCollection.insertOne(facet);
      if (!createdFacetResult.acknowledged) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`products.create.error`),
        };
        await session.abortTransaction();
        return;
      }

      // create product algolia object
      await updateProductTitles({
        _id: createdProductSummary._id,
      });

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
      const newShopProduct = castSummaryToShopProduct({
        summary: createdProductSummary,
        itemId: shopProductItemId,
        shopId: shop._id,
        available,
        price,
        barcode: productFields.barcode,
        citySlug: shop.citySlug,
        companyId: shop.companyId,
        companySlug: shop.companySlug,
      });
      const createdShopProductResult = await shopProductsCollection.insertOne(newShopProduct);
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
        payload: createdProductSummary,
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
