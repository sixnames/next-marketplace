import { ObjectId } from 'mongodb';
import { ATTRIBUTE_VARIANT_SELECT } from '../../../config/common';
import getResolverErrorMessage from '../../../lib/getResolverErrorMessage';
import {
  getOperationPermission,
  getRequestParams,
  getResolverValidationSchema,
} from '../../../lib/sessionHelpers';
import { createProductConnectionSchema } from '../../../validation/productSchema';
import { COL_ATTRIBUTES, COL_OPTIONS, COL_PRODUCT_SUMMARIES } from '../../collectionNames';
import {
  AttributeModel,
  OptionModel,
  ProductPayloadModel,
  ProductSummaryModel,
} from '../../dbModels';
import { getDatabase } from '../../mongodb';
import { DaoPropsInterface } from '../../uiInterfaces';

export interface CreateProductVariantInputInterface {
  productId: string;
  attributeId: string;
}

export async function createProductVariant({
  input,
  context,
}: DaoPropsInterface<CreateProductVariantInputInterface>): Promise<ProductPayloadModel> {
  const { getApiMessage } = await getRequestParams(context);
  const { db, client } = await getDatabase();
  const attributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);
  const productSummariesCollection = db.collection<ProductSummaryModel>(COL_PRODUCT_SUMMARIES);
  const optionsCollection = db.collection<OptionModel>(COL_OPTIONS);

  const session = client.startSession();
  let mutationPayload: ProductPayloadModel = {
    success: false,
    message: await getApiMessage(`products.connection.createError`),
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
          message: await getApiMessage(`products.update.error`),
        };
        await session.abortTransaction();
        return;
      }

      // validate
      const validationSchema = await getResolverValidationSchema({
        context,
        schema: createProductConnectionSchema,
      });
      await validationSchema.validate(input);

      // check all entities availability
      const productId = new ObjectId(input.productId);
      const attributeId = new ObjectId(input.attributeId);
      const summary = await productSummariesCollection.findOne({ _id: productId });
      const productAttribute = summary?.attributes.find((productAttribute) => {
        return productAttribute.attributeId.equals(attributeId);
      });
      const attribute = await attributesCollection.findOne({
        _id: attributeId,
      });

      // Find current attribute in product
      if (!summary || !productAttribute || !attribute) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`products.update.notFound`),
        };
        await session.abortTransaction();
        return;
      }

      // Check attribute variant. Must be as Select
      if (attribute.variant !== ATTRIBUTE_VARIANT_SELECT) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`products.update.attributeVariantError`),
        };
        await session.abortTransaction();
        return;
      }

      // Check if connection already exist
      const exist = summary.variants.some((connection) => {
        return connection.attributeId.equals(attributeId);
      });
      if (exist) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`products.connection.exist`),
        };
        await session.abortTransaction();
        return;
      }

      // Find current option
      const optionId = productAttribute.optionIds[0];
      if (!optionId) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`products.connection.createError`),
        };
        await session.abortTransaction();
        return;
      }
      const option = await optionsCollection.findOne({ _id: optionId });
      if (!option) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`products.connection.createError`),
        };
        await session.abortTransaction();
        return;
      }

      // Update product
      const updatedProductResult = await productSummariesCollection.findOneAndUpdate(
        {
          _id: productId,
        },
        {
          $push: {
            variants: {
              _id: new ObjectId(),
              attributeId: attribute._id,
              attributeSlug: attribute.slug,
              products: [
                {
                  _id: new ObjectId(),
                  productId,
                  optionId,
                  productSlug: summary.slug,
                },
              ],
            },
          },
          $set: {
            updatedAt: new Date(),
          },
        },
        {
          returnDocument: 'after',
        },
      );
      const updatedProduct = updatedProductResult.value;
      if (!updatedProductResult.ok || !updatedProduct) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`products.update.error`),
        };
        await session.abortTransaction();
        return;
      }

      mutationPayload = {
        success: true,
        message: await getApiMessage('products.connection.createSuccess'),
        payload: updatedProduct,
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
