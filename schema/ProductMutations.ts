import { getParentTreeSlugs } from 'lib/optionsUtils';
import { arg, extendType, inputObjectType, nonNull, objectType } from 'nexus';
import { CategoryModel, ProductModel, ProductPayloadModel, ShopProductModel } from 'db/dbModels';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getOperationPermission, getRequestParams, getSessionRole } from 'lib/sessionHelpers';
import { getDatabase } from 'db/mongodb';
import { COL_CATEGORIES, COL_PRODUCTS, COL_SHOP_PRODUCTS } from 'db/collectionNames';
import { DEFAULT_COMPANY_SLUG, VIEWS_COUNTER_STEP } from 'config/common';

export const ProductPayload = objectType({
  name: 'ProductPayload',
  definition(t) {
    t.implements('Payload');
    t.field('payload', {
      type: 'Product',
    });
  },
});

export const UpdateProductCounterInput = inputObjectType({
  name: 'UpdateProductCounterInput',
  definition(t) {
    t.nonNull.list.nonNull.objectId('shopProductIds');
    t.string('companySlug', { default: DEFAULT_COMPANY_SLUG });
  },
});

// Product Mutations
export const ProductMutations = extendType({
  type: 'Mutation',
  definition(t) {
    // Should update product category
    t.nonNull.field('updateProductCategory', {
      type: 'ProductPayload',
      description: 'Should update product category',
      args: {
        input: nonNull(
          arg({
            type: 'UpdateProductCategoryInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<ProductPayloadModel> => {
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
            // Permission
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

            const { input } = args;
            const { productId, categoryId } = input;

            // Check product availability
            const product = await productsCollection.findOne({ _id: productId });
            if (!product) {
              mutationPayload = {
                success: false,
                message: await getApiMessage(`products.update.notFound`),
              };
              await session.abortTransaction();
              return;
            }

            // Check category availability
            const category = await categoriesCollection.findOne({ _id: categoryId });
            if (!category) {
              mutationPayload = {
                success: false,
                message: await getApiMessage(`products.update.error`),
              };
              await session.abortTransaction();
              return;
            }

            // Get category siblings
            let countSelectedSiblings = 0;
            if (category.parentId) {
              countSelectedSiblings = await categoriesCollection.countDocuments({
                _id: {
                  $ne: categoryId,
                },
                parentId: category.parentId,
                slug: {
                  $in: product.selectedOptionsSlugs,
                },
              });
            }

            // Toggle category in product
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
                titleCategoriesSlugs: {
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
                _id: productId,
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
                productId,
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
      },
    });

    // Should update product category visibility
    t.nonNull.field('updateProductCategoryVisibility', {
      type: 'ProductPayload',
      description: 'Should update product category visibility',
      args: {
        input: nonNull(
          arg({
            type: 'UpdateProductCategoryInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<ProductPayloadModel> => {
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
            // Permission
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

            const { input } = args;
            const { productId, categoryId } = input;

            // Check product availability
            const product = await productsCollection.findOne({ _id: productId });
            if (!product) {
              mutationPayload = {
                success: false,
                message: await getApiMessage(`products.update.notFound`),
              };
              await session.abortTransaction();
              return;
            }

            // Check category availability
            const category = await categoriesCollection.findOne({ _id: categoryId });
            if (!category) {
              mutationPayload = {
                success: false,
                message: await getApiMessage(`products.update.error`),
              };
              await session.abortTransaction();
              return;
            }

            // Toggle category in product
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
                _id: productId,
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
                productId,
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
      },
    });

    // Should update product counter
    t.nonNull.field('updateProductCounter', {
      type: 'Boolean',
      description: 'Should update product counter',
      args: {
        input: nonNull(
          arg({
            type: 'UpdateProductCounterInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<boolean> => {
        try {
          const { db } = await getDatabase();
          const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
          const { role } = await getSessionRole(context);
          const { city } = await getRequestParams(context);
          if (!role.isStaff) {
            const { shopProductIds, companySlug } = args.input;
            const updatedShopProductsResult = await shopProductsCollection.updateMany(
              {
                _id: { $in: shopProductIds },
              },
              {
                $inc: {
                  [`views.${companySlug}.${city}`]: VIEWS_COUNTER_STEP,
                },
              },
            );
            if (!updatedShopProductsResult.acknowledged) {
              return false;
            }
            return true;
          }
          return true;
        } catch (e) {
          console.log(e);
          return false;
        }
      },
    });
  },
});
