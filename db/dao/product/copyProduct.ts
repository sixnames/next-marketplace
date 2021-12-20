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
import { COL_PRODUCT_ASSETS, COL_PRODUCT_ATTRIBUTES, COL_PRODUCTS } from '../../collectionNames';
import {
  ProductAssetsModel,
  ProductAttributeModel,
  ProductModel,
  ProductPayloadModel,
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
  const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
  const productAttributesCollection = db.collection<ProductAttributeModel>(COL_PRODUCT_ATTRIBUTES);
  const productAssetsCollection = db.collection<ProductAssetsModel>(COL_PRODUCT_ASSETS);

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
      const sourceProduct = await productsCollection.findOne({ _id: productObjectId });
      if (!sourceProduct) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`products.update.notFound`),
        };
        await session.abortTransaction();
        return;
      }

      // create product
      const itemId = await getNextItemId(COL_PRODUCTS);
      const newProductId = new ObjectId();
      const createdProductResult = await productsCollection.insertOne({
        ...sourceProduct,
        ...values,
        _id: newProductId,
        itemId,
        barcode: [],
        slug: itemId,
        originalName: values.originalName || '',
        mainImage: IMAGE_FALLBACK,
        rubricId: sourceProduct.rubricId,
        rubricSlug: sourceProduct.rubricSlug,
        active: true,
        selectedOptionsSlugs: sourceProduct.selectedOptionsSlugs,
        selectedAttributesIds: sourceProduct.selectedAttributesIds,
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

      // create product assets
      const createdAssetsResult = await productAssetsCollection.insertOne({
        productId: newProductId,
        productSlug: itemId,
        assets: [
          {
            index: 1,
            url: IMAGE_FALLBACK,
          },
        ],
      });
      if (!createdAssetsResult.acknowledged) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`products.create.error`),
        };
        await session.abortTransaction();
        return;
      }

      // get source product attributes
      const sourceProductAttributes = await productAttributesCollection
        .find({
          productId: sourceProduct._id,
        })
        .toArray();

      // create product attributes
      const createdProductAttributes: ProductAttributeModel[] = [];
      for await (const productAttribute of sourceProductAttributes) {
        createdProductAttributes.push({
          ...productAttribute,
          _id: new ObjectId(),
          productId: createdProduct._id,
          productSlug: createdProduct.slug,
        });
      }
      if (createdProductAttributes.length > 0) {
        const newAttributesResult = await productAttributesCollection.insertMany(
          createdProductAttributes,
        );
        if (!newAttributesResult.acknowledged) {
          mutationPayload = {
            success: false,
            message: await getApiMessage(`products.create.error`),
          };
          await session.abortTransaction();
          return;
        }
      }

      // create algolia object
      await updateAlgoliaProducts({
        _id: createdAssetsResult.insertedId,
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
