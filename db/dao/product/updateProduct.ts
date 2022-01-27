import { ObjectId } from 'mongodb';
import getResolverErrorMessage from '../../../lib/getResolverErrorMessage';
import { checkBarcodeIntersects, trimProductName } from '../../../lib/productUtils';
import {
  getOperationPermission,
  getRequestParams,
  getResolverValidationSchema,
} from '../../../lib/sessionHelpers';
import { execUpdateProductTitles } from '../../../lib/updateProductTitles';
import { updateProductSchema } from '../../../validation/productSchema';
import { COL_PRODUCT_SUMMARIES } from '../../collectionNames';
import { ProductPayloadModel, ProductSummaryModel } from '../../dbModels';
import { getDatabase } from '../../mongodb';
import { DaoPropsInterface } from '../../uiInterfaces';
import { CreateProductInputInterface } from './createProduct';

export interface UpdateProductInputInterface extends CreateProductInputInterface {
  productId: string;
}

export async function updateProduct({
  context,
  input,
}: DaoPropsInterface<UpdateProductInputInterface>): Promise<ProductPayloadModel> {
  const { getApiMessage, locale } = await getRequestParams(context);
  const { db, client } = await getDatabase();
  const productSummariesCollection = db.collection<ProductSummaryModel>(COL_PRODUCT_SUMMARIES);

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

      // validate
      const validationSchema = await getResolverValidationSchema({
        context,
        schema: updateProductSchema,
      });
      await validationSchema.validate(input);

      const { productId, rubricId, ...values } = input;

      // check product availability
      const productObjectId = new ObjectId(productId);
      const summary = await productSummariesCollection.findOne({ _id: productObjectId });
      if (!summary) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`products.update.notFound`),
        };
        await session.abortTransaction();
        return;
      }

      // check barcode intersects
      const barcodeDoubles = await checkBarcodeIntersects({
        locale,
        barcode: values.barcode,
        productId: summary._id,
      });
      if (barcodeDoubles.length > 0) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`products.update.error`),
          barcodeDoubles,
        };
        await session.abortTransaction();
        return;
      }

      // update product
      const { originalName, nameI18n } = trimProductName({
        nameI18n: values.nameI18n,
        originalName: values.originalName,
      });
      const updatedProductResult = await productSummariesCollection.findOneAndUpdate(
        {
          _id: summary._id,
        },
        {
          $set: {
            ...values,
            videos: (values.videos || []).filter((url) => url),
            rubricId: new ObjectId(rubricId),
            nameI18n,
            originalName,
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

      // update product title
      execUpdateProductTitles(`productId=${updatedProduct._id.toHexString()}`);

      mutationPayload = {
        success: true,
        message: await getApiMessage('products.update.success'),
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
