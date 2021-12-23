import { ObjectId } from 'mongodb';
import { IMAGE_FALLBACK } from '../../../config/common';
import { updateAlgoliaProducts } from '../../../lib/algolia/productAlgoliaUtils';
import getResolverErrorMessage from '../../../lib/getResolverErrorMessage';
import { getNextItemId } from '../../../lib/itemIdUtils';
import {
  getOperationPermission,
  getRequestParams,
  getResolverValidationSchema,
} from '../../../lib/sessionHelpers';
import { updateProductSchema } from '../../../validation/productSchema';
import { COL_PRODUCT_FACETS, COL_PRODUCT_SUMMARIES } from '../../collectionNames';
import {
  ProductAttributeModel,
  ProductFacetModel,
  ProductPayloadModel,
  ProductSummaryModel,
} from '../../dbModels';
import { getDatabase } from '../../mongodb';
import { DaoPropsInterface } from '../../uiInterfaces';
import { CreateProductInputInterface } from './createProduct';

export interface CopyProductInputInterface extends CreateProductInputInterface {
  productId: string;
}

export async function copyProduct({
  input,
  context,
}: DaoPropsInterface<CopyProductInputInterface>): Promise<ProductPayloadModel> {
  const { getApiMessage } = await getRequestParams(context);
  const { db, client } = await getDatabase();
  const productSummariesCollection = db.collection<ProductSummaryModel>(COL_PRODUCT_SUMMARIES);
  const productFacetsCollection = db.collection<ProductFacetModel>(COL_PRODUCT_FACETS);

  const session = client.startSession();

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
      const sourceProduct = await productSummariesCollection.findOne({ _id: productObjectId });
      if (!sourceProduct) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`products.update.notFound`),
        };
        await session.abortTransaction();
        return;
      }

      // create summary
      const itemId = await getNextItemId(COL_PRODUCT_FACETS);
      const newProductId = new ObjectId();
      const createdProductResult = await productSummariesCollection.insertOne({
        ...sourceProduct,
        ...values,
        _id: newProductId,
        itemId,
        barcode: [],
        slug: itemId,
        originalName: values.originalName || '',
        mainImage: IMAGE_FALLBACK,
        assets: [IMAGE_FALLBACK],
        rubricId: sourceProduct.rubricId,
        rubricSlug: sourceProduct.rubricSlug,
        active: true,
        filterSlugs: sourceProduct.filterSlugs,
        attributeIds: sourceProduct.attributeIds,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const createdProduct = await productSummariesCollection.findOne({
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

      // create product facet
      const createdAssetsResult = await productFacetsCollection.insertOne({
        _id: newProductId,
        filterSlugs: createdProduct.filterSlugs,
        attributeIds: createdProduct.attributeIds,
        categorySlugs: createdProduct.categorySlugs,
        slug: createdProduct.slug,
        active: createdProduct.active,
        rubricId: createdProduct.rubricId,
        rubricSlug: createdProduct.rubricSlug,
        itemId: createdProduct.itemId,
        allowDelivery: createdProduct.allowDelivery,
        brandCollectionSlug: createdProduct.brandCollectionSlug,
        brandSlug: createdProduct.brandSlug,
        manufacturerSlug: createdProduct.manufacturerSlug,
        barcode: createdProduct.barcode,
      });
      if (!createdAssetsResult.acknowledged) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`products.create.error`),
        };
        await session.abortTransaction();
        return;
      }

      // create algolia object
      await updateAlgoliaProducts({
        _id: createdProduct._id,
      });

      mutationPayload = {
        success: true,
        message: await getApiMessage('products.create.success'),
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
