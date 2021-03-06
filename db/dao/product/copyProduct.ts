import { castSummaryToFacet } from 'db/cast/castSummaryToFacet';
import { COL_PRODUCT_SUMMARIES } from 'db/collectionNames';
import { ProductPayloadModel } from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import { DaoPropsInterface } from 'db/uiInterfaces';
import { IMAGE_FALLBACK } from 'lib/config/common';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getNextItemId } from 'lib/itemIdUtils';
import {
  getOperationPermission,
  getRequestParams,
  getResolverValidationSchema,
} from 'lib/sessionHelpers';
import { execUpdateProductTitles } from 'lib/updateProductTitles';
import { ObjectId } from 'mongodb';
import { updateProductSchema } from 'validation/productSchema';
import { CreateProductInputInterface } from './createProduct';

export interface CopyProductInputInterface extends CreateProductInputInterface {
  productId: string;
}

export async function copyProduct({
  input,
  context,
}: DaoPropsInterface<CopyProductInputInterface>): Promise<ProductPayloadModel> {
  const { getApiMessage } = await getRequestParams(context);
  const collections = await getDbCollections();
  const productSummariesCollection = collections.productSummariesCollection();
  const productFacetsCollection = collections.productFacetsCollection();

  const session = collections.client.startSession();

  let mutationPayload: ProductPayloadModel = {
    success: false,
    message: await getApiMessage(`products.create.error`),
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

      // validate
      const validationSchema = await getResolverValidationSchema({
        context,
        schema: updateProductSchema,
      });
      await validationSchema.validate(input);
      const { productId, ...values } = input;

      // get source product
      const productObjectId = new ObjectId(productId);
      const sourceProductSummary = await productSummariesCollection.findOne({
        _id: productObjectId,
      });
      if (!sourceProductSummary) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`products.update.notFound`),
        };
        await session.abortTransaction();
        return;
      }

      // create summary
      const itemId = await getNextItemId(COL_PRODUCT_SUMMARIES);
      const newProductId = new ObjectId();
      const createdProductSummaryResult = await productSummariesCollection.insertOne({
        ...sourceProductSummary,
        ...values,
        _id: newProductId,
        itemId,
        barcode: [],
        slug: itemId,
        originalName: values.originalName || '',
        mainImage: IMAGE_FALLBACK,
        assets: [],
        rubricId: sourceProductSummary.rubricId,
        rubricSlug: sourceProductSummary.rubricSlug,
        active: true,
        filterSlugs: sourceProductSummary.filterSlugs,
        attributeIds: sourceProductSummary.attributeIds,
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

      // create product facet
      const newFacet = castSummaryToFacet({
        summary: createdProductSummary,
      });
      const createdFacetResult = await productFacetsCollection.insertOne(newFacet);
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

      mutationPayload = {
        success: true,
        message: await getApiMessage('products.create.success'),
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
