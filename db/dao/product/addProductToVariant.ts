import { ObjectId } from 'mongodb';
import getResolverErrorMessage from '../../../lib/getResolverErrorMessage';
import {
  getOperationPermission,
  getRequestParams,
  getResolverValidationSchema,
} from '../../../lib/sessionHelpers';
import { addProductToConnectionSchema } from '../../../validation/productSchema';
import { COL_OPTIONS, COL_PRODUCT_SUMMARIES } from '../../collectionNames';
import {
  OptionModel,
  ProductPayloadModel,
  ProductSummaryModel,
  ProductVariantItemModel,
  ProductVariantModel,
} from '../../dbModels';
import { getDatabase } from '../../mongodb';
import { DaoPropsInterface } from '../../uiInterfaces';

export interface AddProductToVariantInputInterface {
  productId: string;
  addProductId: string;
  variantId: string;
}

export async function addProductToVariant({
  input,
  context,
}: DaoPropsInterface<AddProductToVariantInputInterface>): Promise<ProductPayloadModel> {
  const { getApiMessage } = await getRequestParams(context);
  const { db, client } = await getDatabase();
  const productSummariesCollection = db.collection<ProductSummaryModel>(COL_PRODUCT_SUMMARIES);
  const optionsCollection = db.collection<OptionModel>(COL_OPTIONS);

  const session = client.startSession();

  let mutationPayload: ProductPayloadModel = {
    success: false,
    message: await getApiMessage(`products.connection.updateError`),
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
        schema: addProductToConnectionSchema,
      });
      await validationSchema.validate(input);

      // Check all entities availability
      const productId = new ObjectId(input.productId);
      const addProductId = new ObjectId(input.addProductId);
      const variantId = new ObjectId(input.variantId);
      const summary = await productSummariesCollection.findOne({ _id: productId });
      const addSummary = await productSummariesCollection.findOne({ _id: addProductId });
      const variant = summary?.variants.find((variant) => {
        return variant._id.equals(variantId);
      });
      if (!summary || !addSummary || !variant) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`products.update.notFound`),
        };
        await session.abortTransaction();
        return;
      }

      // Check attribute existence in added product
      const addProductAttribute = addSummary.attributes.find(({ attributeId }) => {
        return variant.attributeId.equals(attributeId);
      });
      const addProductOptionId = addProductAttribute?.optionIds[0];
      if (!addProductAttribute || !addProductOptionId) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('products.connection.noAttributeError'),
        };
        await session.abortTransaction();
        return;
      }

      // Check attribute value in added product
      // it should have attribute value and shouldn't intersect with existing values in connection
      const connectionOptionIds = variant.products.reduce((acc: ObjectId[], { optionId }) => {
        return [...acc, optionId];
      }, []);
      const includes = connectionOptionIds.some((_id) => {
        return _id.equals(addProductOptionId);
      });
      if (includes) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('products.connection.intersect'),
        };
        await session.abortTransaction();
        return;
      }

      // Find current option
      const option = await optionsCollection.findOne({
        _id: addProductOptionId,
      });
      if (!option) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`products.connection.updateError`),
        };
        await session.abortTransaction();
        return;
      }

      // Create connection item
      const updatedVariantProducts: ProductVariantItemModel[] = [
        ...variant.products,
        {
          _id: new ObjectId(),
          optionId: option._id,
          productId: addProductId,
          productSlug: addSummary.slug,
        },
      ];
      const updateProductIds = variant.products.map(({ productId }) => {
        return productId;
      });
      const updatedVariant: ProductVariantModel = {
        ...variant,
        products: updatedVariantProducts,
      };

      // Update connection
      const updatedSummaryResult = await productSummariesCollection.updateMany(
        {
          _id: {
            $in: updateProductIds,
          },
        },
        {
          $set: {
            'variants.$[oldVariant]': updatedVariant,
          },
        },
        {
          arrayFilters: [
            {
              'oldVariant._id': { $eq: variant._id },
            },
          ],
        },
      );
      const updatedAddSummaryResult = await productSummariesCollection.findOneAndUpdate(
        {
          _id: addProductId,
        },
        {
          $push: {
            variants: updatedVariant,
          },
        },
      );
      if (!updatedSummaryResult.acknowledged || !updatedAddSummaryResult.ok) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`products.connection.updateError`),
        };
        await session.abortTransaction();
        return;
      }

      mutationPayload = {
        success: true,
        message: await getApiMessage('products.connection.addProductSuccess'),
        payload: summary,
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
