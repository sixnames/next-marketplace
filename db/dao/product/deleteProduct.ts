import { ObjectId } from 'mongodb';
import { deleteProductAlgoliaObjects } from '../../../lib/algolia/productAlgoliaUtils';
import { deleteUpload } from '../../../lib/assetUtils/assetUtils';
import getResolverErrorMessage from '../../../lib/getResolverErrorMessage';
import { getOperationPermission, getRequestParams } from '../../../lib/sessionHelpers';
import {
  COL_PRODUCT_FACETS,
  COL_RUBRICS,
  COL_SHOP_PRODUCTS,
  COL_PRODUCT_SUMMARIES,
} from '../../collectionNames';
import {
  ProductFacetModel,
  ProductPayloadModel,
  RubricModel,
  ShopProductModel,
  ProductSummaryModel,
} from '../../dbModels';
import { getDatabase } from '../../mongodb';
import { DaoPropsInterface } from '../../uiInterfaces';

export interface DeleteProductInputInterface {
  productId: string;
}

export async function deleteProduct({
  context,
  input,
}: DaoPropsInterface<DeleteProductInputInterface>): Promise<ProductPayloadModel> {
  const { getApiMessage } = await getRequestParams(context);
  const { db, client } = await getDatabase();
  const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
  const productSummariesCollection = db.collection<ProductSummaryModel>(COL_PRODUCT_SUMMARIES);
  const productFacetsCollection = db.collection<ProductFacetModel>(COL_PRODUCT_FACETS);
  const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);

  const session = client.startSession();

  let mutationPayload: ProductPayloadModel = {
    success: false,
    message: await getApiMessage(`rubrics.deleteProduct.error`),
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
        slug: 'deleteProduct',
      });
      if (!allow) {
        mutationPayload = {
          success: false,
          message,
        };
        await session.abortTransaction();
        return;
      }

      const { productId } = input;

      // check rubric and product availability
      const productObjectId = new ObjectId(productId);
      const product = await productSummariesCollection.findOne({
        _id: productObjectId,
      });
      if (!product) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('rubrics.deleteProduct.notFound'),
        };
        await session.abortTransaction();
        return;
      }

      const rubric = await rubricsCollection.findOne({ _id: product.rubricId });
      if (!rubric) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('rubrics.deleteProduct.notFound'),
        };
        await session.abortTransaction();
        return;
      }

      // delete algolia product object
      await deleteProductAlgoliaObjects({
        productIds: [product._id],
      });

      // delete product assets
      for await (const asset of product.assets) {
        await deleteUpload(asset);
      }

      // delete product
      const removedFacetResult = await productFacetsCollection.findOneAndDelete({
        _id: product._id,
      });
      const removedSummaryResult = await productSummariesCollection.findOneAndDelete({
        _id: product._id,
      });
      const removedShopProductResult = await shopProductsCollection.deleteMany({
        productId: product._id,
      });
      if (
        !removedFacetResult.ok ||
        !removedSummaryResult.ok ||
        !removedShopProductResult.acknowledged
      ) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`rubrics.deleteProduct.error`),
        };
        await session.abortTransaction();
        return;
      }

      mutationPayload = {
        success: true,
        message: await getApiMessage('rubrics.deleteProduct.success'),
      };
    });

    return mutationPayload;
  } catch (e) {
    console.log(e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  } finally {
    await session.endSession();
  }
}
