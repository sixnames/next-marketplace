import { ObjectId } from 'mongodb';
import { DEFAULT_LOCALE, IMAGE_FALLBACK } from 'lib/config/common';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getNextItemId } from 'lib/itemIdUtils';
import {
  castSummaryToFacet,
  castSummaryToShopProduct,
  checkBarcodeIntersects,
} from 'lib/productUtils';
import { getOperationPermission, getRequestParams } from 'lib/sessionHelpers';
import { execUpdateProductTitles } from 'lib/updateProductTitles';
import { COL_PRODUCT_SUMMARIES, COL_SHOP_PRODUCTS } from 'db/collectionNames';
import { ProductPayloadModel, ShopProductModel } from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import { DaoPropsInterface } from 'db/uiInterfaces';
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
  const collections = await getDbCollections();
  const productFacetsCollection = collections.productFacetsCollection();
  const productSummariesCollection = collections.productSummariesCollection();
  const shopProductsCollection = collections.shopProductsCollection();
  const shopsCollection = collections.shopsCollection();
  const notSyncedProductsCollection = collections.notSyncedProductsCollection();
  const rubricsCollection = collections.rubricsCollection();
  const rubricVariantsCollection = collections.rubricVariantsCollection();

  const session = collections.client.startSession();

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
      const productItemId = await getNextItemId(COL_PRODUCT_SUMMARIES);
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
        variants: [],
        assets: [],
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

      // create algolia object
      execUpdateProductTitles(`productId=${createdProductSummary._id.toHexString()}`);

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
