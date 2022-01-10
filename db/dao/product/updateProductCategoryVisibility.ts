import { ObjectId } from 'mongodb';
import getResolverErrorMessage from '../../../lib/getResolverErrorMessage';
import { getOperationPermission, getRequestParams } from '../../../lib/sessionHelpers';
import { execUpdateProductTitles } from '../../../lib/updateProductTitles';
import { COL_CATEGORIES, COL_PRODUCT_SUMMARIES } from '../../collectionNames';
import { CategoryModel, ProductPayloadModel, ProductSummaryModel } from '../../dbModels';
import { getDatabase } from '../../mongodb';
import { DaoPropsInterface } from '../../uiInterfaces';
import { UpdateProductCategoryInputInterface } from './updateProductCategory';

export async function updateProductCategoryVisibility({
  context,
  input,
}: DaoPropsInterface<UpdateProductCategoryInputInterface>): Promise<ProductPayloadModel> {
  const { db, client } = await getDatabase();
  const { getApiMessage } = await getRequestParams(context);
  const productSummariesCollection = db.collection<ProductSummaryModel>(COL_PRODUCT_SUMMARIES);
  const categoriesCollection = db.collection<CategoryModel>(COL_CATEGORIES);

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

      const { productId, categoryId } = input;

      // check product availability
      const productObjectId = new ObjectId(productId);
      const product = await productSummariesCollection.findOne({ _id: productObjectId });
      if (!product) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`products.update.notFound`),
        };
        await session.abortTransaction();
        return;
      }

      // check category availability
      const categoryObjectId = new ObjectId(categoryId);
      const category = await categoriesCollection.findOne({ _id: categoryObjectId });
      if (!category) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`products.update.error`),
        };
        await session.abortTransaction();
        return;
      }

      // toggle category in product
      const selected = product.titleCategorySlugs.some((slug) => slug === category.slug);
      let updater: Record<string, any> = {
        $addToSet: {
          titleCategorySlugs: category.slug,
        },
      };
      if (selected) {
        updater = {
          $pull: {
            titleCategorySlugs: category.slug,
          },
        };
      }

      // update product
      const updatedSummaryResult = await productSummariesCollection.findOneAndUpdate(
        {
          _id: product._id,
        },
        updater,
      );
      const updatedProduct = updatedSummaryResult.value;
      if (!updatedSummaryResult.ok || !updatedProduct || !updatedSummaryResult.ok) {
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
