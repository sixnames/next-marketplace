import { ObjectId } from 'mongodb';
import getResolverErrorMessage from '../../../lib/getResolverErrorMessage';
import { getOperationPermission, getRequestParams } from '../../../lib/sessionHelpers';
import {
  COL_PRODUCT_FACETS,
  COL_PRODUCT_SUMMARIES,
  COL_SHOP_PRODUCTS,
} from '../../collectionNames';
import {
  ProductFacetModel,
  ProductPayloadModel,
  ProductSummaryModel,
  ShopProductModel,
} from '../../dbModels';
import { getDatabase } from '../../mongodb';
import { DaoPropsInterface } from '../../uiInterfaces';

export interface UpdateProductManufacturerInputInterface {
  productId: string;
  manufacturerSlug?: string | null;
}

export async function updateProductManufacturer({
  input,
  context,
}: DaoPropsInterface<UpdateProductManufacturerInputInterface>): Promise<ProductPayloadModel> {
  const { getApiMessage } = await getRequestParams(context);
  const { db, client } = await getDatabase();
  const productSummariesCollection = db.collection<ProductSummaryModel>(COL_PRODUCT_SUMMARIES);
  const productFacetsCollection = db.collection<ProductFacetModel>(COL_PRODUCT_FACETS);
  const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);

  const session = client.startSession();

  let mutationPayload: ProductPayloadModel = {
    success: false,
    message: await getApiMessage('products.update.error'),
  };

  try {
    await session.withTransaction(async () => {
      // permission
      const { allow, message } = await getOperationPermission({
        context,
        slug: 'updateProduct',
      });
      if (!allow) {
        mutationPayload = {
          success: false,
          message,
        };
        await session.abortTransaction();
        return;
      }

      // check input
      if (!input) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('products.update.error'),
        };
        await session.abortTransaction();
        return;
      }

      const { manufacturerSlug } = input;
      const productId = new ObjectId(input.productId);

      // Check product availability
      const summary = await productSummariesCollection.findOne({ _id: productId });
      if (!summary) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('products.update.error'),
        };
        await session.abortTransaction();
        return;
      }

      const updatedSummaryResult = await productSummariesCollection.findOneAndUpdate(
        {
          _id: productId,
        },
        {
          $set: {
            manufacturerSlug,
            updatedAt: new Date(),
          },
        },
        {
          returnDocument: 'after',
        },
      );
      if (!updatedSummaryResult.ok) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('products.update.error'),
        };
        await session.abortTransaction();
        return;
      }

      const updatedFacetResult = await productFacetsCollection.findOneAndUpdate(
        {
          _id: productId,
        },
        {
          $set: {
            manufacturerSlug,
          },
        },
        {
          returnDocument: 'after',
        },
      );
      if (!updatedFacetResult.ok) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('products.update.error'),
        };
        await session.abortTransaction();
        return;
      }

      const updatedShopProduct = await shopProductsCollection.updateMany(
        {
          productId,
        },
        {
          $set: {
            manufacturerSlug,
            updatedAt: new Date(),
          },
        },
      );
      if (!updatedShopProduct.acknowledged) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('products.update.error'),
        };
        await session.abortTransaction();
        return;
      }

      mutationPayload = {
        success: true,
        message: await getApiMessage('products.update.success'),
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
