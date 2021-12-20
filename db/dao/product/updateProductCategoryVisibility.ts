import { ObjectId } from 'mongodb';
import getResolverErrorMessage from '../../../lib/getResolverErrorMessage';
import { getOperationPermission, getRequestParams } from '../../../lib/sessionHelpers';
import { COL_CATEGORIES, COL_PRODUCTS, COL_SHOP_PRODUCTS } from '../../collectionNames';
import { CategoryModel, ProductModel, ProductPayloadModel, ShopProductModel } from '../../dbModels';
import { getDatabase } from '../../mongodb';
import { DaoPropsInterface } from '../../uiInterfaces';
import { UpdateProductCategoryInputInterface } from './updateProductCategory';

export async function updateProductCategoryVisibility({
  context,
  input,
}: DaoPropsInterface<UpdateProductCategoryInputInterface>): Promise<ProductPayloadModel> {
  const { db, client } = await getDatabase();
  const { getApiMessage } = await getRequestParams(context);
  const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
  const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
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
      const product = await productsCollection.findOne({ _id: productObjectId });
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
      const selected = product.titleCategoriesSlugs.some((slug) => slug === category.slug);
      let updater: Record<string, any> = {
        $addToSet: {
          titleCategoriesSlugs: category.slug,
        },
      };
      if (selected) {
        updater = {
          $pull: {
            titleCategoriesSlugs: category.slug,
          },
        };
      }

      // update product
      const updatedProductResult = await productsCollection.findOneAndUpdate(
        {
          _id: product._id,
        },
        updater,
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

      // update shop products
      const updatedShopProductsResult = await shopProductsCollection.updateMany(
        {
          productId: product._id,
        },
        updater,
      );
      if (!updatedShopProductsResult.acknowledged) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`products.update.error`),
        };
        await session.abortTransaction();
        return;
      }

      mutationPayload = {
        success: true,
        message: await getApiMessage('shopProducts.update.success'),
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
