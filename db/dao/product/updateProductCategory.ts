import { COL_CATEGORIES, COL_PRODUCTS, COL_SHOP_PRODUCTS } from 'db/collectionNames';
import { CategoryModel, ProductModel, ProductPayloadModel, ShopProductModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { DaoPropsInterface } from 'db/uiInterfaces';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getParentTreeSlugs } from 'lib/optionUtils';
import { getOperationPermission, getRequestParams } from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';

export interface UpdateProductCategoryInputInterface {
  productId: string;
  categoryId: string;
}

export async function updateProductCategory({
  input,
  context,
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

      // get category siblings
      let countSelectedSiblings = 0;
      if (category.parentId) {
        countSelectedSiblings = await categoriesCollection.countDocuments({
          _id: {
            $ne: category._id,
          },
          parentId: category.parentId,
          slug: {
            $in: product.selectedOptionsSlugs,
          },
        });
      }

      // toggle category in product
      const selected = product.selectedOptionsSlugs.some((slug) => slug === category.slug);
      const categoryParentTreeSlugs = await getParentTreeSlugs({
        _id: category._id,
        collectionName: COL_CATEGORIES,
        acc: [],
      });

      let updater: Record<string, any> = {
        $addToSet: {
          selectedOptionsSlugs: {
            $each: categoryParentTreeSlugs,
          },
        },
      };
      if (selected) {
        if (countSelectedSiblings > 0) {
          updater = {
            $pull: {
              selectedOptionsSlugs: category.slug,
              titleCategoriesSlugs: category.slug,
            },
          };
        } else {
          updater = {
            $pullAll: {
              selectedOptionsSlugs: categoryParentTreeSlugs,
              titleCategoriesSlugs: categoryParentTreeSlugs,
            },
          };
        }
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
