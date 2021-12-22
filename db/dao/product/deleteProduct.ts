import { ObjectId } from 'mongodb';
import { deleteAlgoliaObjects } from '../../../lib/algolia/algoliaUtils';
import { deleteUpload } from '../../../lib/assetUtils/assetUtils';
import getResolverErrorMessage from '../../../lib/getResolverErrorMessage';
import { getOperationPermission, getRequestParams } from '../../../lib/sessionHelpers';
import {
  COL_PRODUCT_ASSETS,
  COL_PRODUCT_ATTRIBUTES,
  COL_PRODUCT_VARIANT_ITEMS,
  COL_PRODUCT_FACETS,
  COL_RUBRICS,
  COL_SHOP_PRODUCTS,
} from '../../collectionNames';
import {
  ProductAssetsModel,
  ProductAttributeModel,
  ProductVariantItemModel,
  ProductFacetModel,
  ProductPayloadModel,
  RubricModel,
  ShopProductModel,
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
  const productsCollection = db.collection<ProductFacetModel>(COL_PRODUCT_FACETS);
  const productAssetsCollection = db.collection<ProductAssetsModel>(COL_PRODUCT_ASSETS);
  const productAttributesCollection = db.collection<ProductAttributeModel>(COL_PRODUCT_ATTRIBUTES);
  const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
  const productConnectionItemsCollection =
    db.collection<ProductVariantItemModel>(COL_PRODUCT_VARIANT_ITEMS);

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
      const product = await productsCollection.findOne({
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
      const algoliaProductResult = await deleteAlgoliaObjects({
        indexName: `${process.env.ALG_INDEX_PRODUCTS}`,
        objectIDs: [product._id.toHexString()],
      });
      if (!algoliaProductResult) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`rubrics.deleteProduct.error`),
        };
        await session.abortTransaction();
        return;
      }

      // delete algolia shop product objects
      const shopProducts = await shopProductsCollection
        .find({
          productId: product._id,
        })
        .toArray();
      const shopProductIds: string[] = shopProducts.map(({ _id }) => _id.toHexString());
      const algoliaShopProductsResult = await deleteAlgoliaObjects({
        indexName: `${process.env.ALG_INDEX_PRODUCTS}`,
        objectIDs: shopProductIds,
      });
      if (!algoliaShopProductsResult) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`rubrics.deleteProduct.error`),
        };
        await session.abortTransaction();
        return;
      }

      // delete product assets from cloud
      const productAssets = await productAssetsCollection
        .find({
          productId: product._id,
        })
        .toArray();
      for await (const productAsset of productAssets) {
        for await (const asset of productAsset.assets) {
          await deleteUpload(asset.url);
        }
      }

      // delete product assets
      const removedProductAssetsResult = await productAssetsCollection.deleteMany({
        productId: product._id,
      });
      if (!removedProductAssetsResult.acknowledged) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`rubrics.deleteProduct.error`),
        };
        await session.abortTransaction();
        return;
      }

      // delete product attributes
      const removedProductAttributesResult = await productAttributesCollection.deleteMany({
        productId: product._id,
      });
      if (!removedProductAttributesResult.acknowledged) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`rubrics.deleteProduct.error`),
        };
        await session.abortTransaction();
        return;
      }

      // delete product card content assets from cloud
      /*const productCardContents = await productCardContentsCollection
        .find({
          productId: product._id,
        })
        .toArray();
      for await (const productCardContent of productCardContents) {
        for await (const filePath of productCardContent.assetKeys) {
          await deleteUpload(filePath);
        }
      }*/

      // delete product card content
      /*const removedProductCardContents = await productCardContentsCollection.deleteMany({
        productId: product._id,
      });
      if (!removedProductCardContents.acknowledged) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`rubrics.deleteProduct.error`),
        };
        await session.abortTransaction();
        return;
      }*/

      // delete product connections
      const removedProductConnectionsResult = await productConnectionItemsCollection.deleteMany({
        productId: product._id,
      });
      if (!removedProductConnectionsResult.acknowledged) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`rubrics.deleteProduct.error`),
        };
        await session.abortTransaction();
        return;
      }

      // delete product
      const removedProductResult = await productsCollection.findOneAndDelete({
        _id: product._id,
      });
      const removedShopProductResult = await shopProductsCollection.deleteMany({
        productId: product._id,
      });
      if (!removedProductResult.ok || !removedShopProductResult.acknowledged) {
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
