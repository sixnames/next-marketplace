import { AlgoliaProductInterface, saveAlgoliaObjects } from 'lib/algoliaUtils';
import { ObjectId } from 'mongodb';
import { arg, extendType, inputObjectType, nonNull, objectType } from 'nexus';
import {
  ProductAssetsModel,
  ProductModel,
  ProductPayloadModel,
  RubricModel,
  ShopProductModel,
} from 'db/dbModels';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import {
  getOperationPermission,
  getRequestParams,
  getResolverValidationSchema,
  getSessionRole,
} from 'lib/sessionHelpers';
import { getDatabase } from 'db/mongodb';
import {
  COL_PRODUCT_ASSETS,
  COL_PRODUCTS,
  COL_RUBRICS,
  COL_SHOP_PRODUCTS,
} from 'db/collectionNames';
import { generateProductSlug } from 'lib/slugUtils';
import { CONFIG_DEFAULT_COMPANY_SLUG, VIEWS_COUNTER_STEP } from 'config/common';
import { getNextItemId } from 'lib/itemIdUtils';
import { createProductSchema, updateProductSchema } from 'validation/productSchema';
import { deleteUpload, getMainImage, reorderAssets } from 'lib/assets';

export const ProductPayload = objectType({
  name: 'ProductPayload',
  definition(t) {
    t.implements('Payload');
    t.field('payload', {
      type: 'Product',
    });
  },
});

export const CreateProductInput = inputObjectType({
  name: 'CreateProductInput',
  definition(t) {
    t.nonNull.boolean('active');
    t.string('barcode');
    t.nonNull.string('originalName');
    t.nonNull.json('nameI18n');
    t.nonNull.json('descriptionI18n');
    t.nonNull.objectId('rubricId');
  },
});

export const UpdateProductInput = inputObjectType({
  name: 'UpdateProductInput',
  definition(t) {
    t.nonNull.objectId('productId');
    t.string('barcode');
    t.nonNull.boolean('active');
    t.nonNull.string('originalName');
    t.nonNull.json('nameI18n');
    t.nonNull.json('descriptionI18n');
  },
});

export const DeleteProductAssetInput = inputObjectType({
  name: 'DeleteProductAssetInput',
  definition(t) {
    t.nonNull.objectId('productId');
    t.nonNull.int('assetIndex');
  },
});

export const UpdateProductAssetIndexInput = inputObjectType({
  name: 'UpdateProductAssetIndexInput',
  definition(t) {
    t.nonNull.objectId('productId');
    t.nonNull.string('assetUrl');
    t.nonNull.int('assetNewIndex');
  },
});

export const UpdateProductCounterInput = inputObjectType({
  name: 'UpdateProductCounterInput',
  definition(t) {
    t.nonNull.list.nonNull.objectId('shopProductIds');
    t.string('companySlug', { default: CONFIG_DEFAULT_COMPANY_SLUG });
  },
});

// Product Mutations
export const ProductMutations = extendType({
  type: 'Mutation',
  definition(t) {
    // Should create product
    t.nonNull.field('createProduct', {
      type: 'ProductPayload',
      description: 'Should create product',
      args: {
        input: nonNull(
          arg({
            type: 'CreateProductInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<ProductPayloadModel> => {
        const { getApiMessage } = await getRequestParams(context);
        const { db, client } = await getDatabase();
        const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
        const productAssetsCollection = db.collection<ProductAssetsModel>(COL_PRODUCT_ASSETS);
        const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);

        const session = client.startSession();

        let mutationPayload: ProductPayloadModel = {
          success: false,
          message: await getApiMessage(`products.create.error`),
        };

        try {
          await session.withTransaction(async () => {
            // Permission
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

            // Validate
            const validationSchema = await getResolverValidationSchema({
              context,
              schema: createProductSchema,
            });
            await validationSchema.validate(args.input);

            const { input } = args;
            const { rubricId, ...values } = input;

            // Get selected rubric
            const rubric = await rubricsCollection.findOne({ _id: rubricId });
            if (!rubric) {
              mutationPayload = {
                success: false,
                message: await getApiMessage(`products.create.error`),
              };
              await session.abortTransaction();
              return;
            }

            // Store product assets
            const itemId = await getNextItemId(COL_PRODUCTS);

            const slug = generateProductSlug({ nameI18n: values.nameI18n, itemId });

            const productId = new ObjectId();
            const createdProductResult = await productsCollection.insertOne({
              ...values,
              _id: productId,
              itemId,
              mainImage: `${process.env.OBJECT_STORAGE_PRODUCT_IMAGE_FALLBACK}`,
              slug,
              rubricId,
              rubricSlug: rubric.slug,
              active: false,
              selectedOptionsSlugs: [],
              selectedAttributesIds: [],
              createdAt: new Date(),
              updatedAt: new Date(),
            });

            const createdProduct = createdProductResult.ops[0];
            if (!createdProductResult.result.ok || !createdProduct) {
              mutationPayload = {
                success: false,
                message: await getApiMessage(`products.create.error`),
              };
              await session.abortTransaction();
              return;
            }

            // Create product assets
            const createdAssetsResult = await productAssetsCollection.insertOne({
              productId,
              productSlug: slug,
              assets: [
                {
                  index: 1,
                  url: `${process.env.OBJECT_STORAGE_PRODUCT_IMAGE_FALLBACK}`,
                },
              ],
            });
            const createdAssets = createdAssetsResult.ops[0];
            if (!createdAssetsResult.result.ok || !createdAssets) {
              mutationPayload = {
                success: false,
                message: await getApiMessage(`products.create.error`),
              };
              await session.abortTransaction();
              return;
            }

            // Create algolia object
            const algoliaResult = await saveAlgoliaObjects({
              indexName: `${process.env.ALG_INDEX_PRODUCTS}`,
              objects: [
                {
                  _id: createdProduct._id.toHexString(),
                  objectID: createdProduct._id.toHexString(),
                  itemId: createdProduct.itemId,
                  originalName: createdProduct.originalName,
                  nameI18n: createdProduct.nameI18n,
                  barcode: createdProduct.barcode,
                },
              ],
            });
            if (!algoliaResult) {
              mutationPayload = {
                success: false,
                message: await getApiMessage(`products.create.error`),
              };
              await session.abortTransaction();
              return;
            }

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
      },
    });

    // Should update product
    t.nonNull.field('updateProduct', {
      type: 'ProductPayload',
      description: 'Should update product',
      args: {
        input: nonNull(
          arg({
            type: 'UpdateProductInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<ProductPayloadModel> => {
        const { getApiMessage } = await getRequestParams(context);
        const { db, client } = await getDatabase();
        const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
        const productAssetsCollection = db.collection<ProductAssetsModel>(COL_PRODUCT_ASSETS);
        const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);

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

            // Validate
            const validationSchema = await getResolverValidationSchema({
              context,
              schema: updateProductSchema,
            });
            await validationSchema.validate(args.input);

            const { input } = args;
            const { productId, ...values } = input;

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

            // Create new slug for product
            const updatedSlug = generateProductSlug({
              nameI18n: values.nameI18n,
              itemId: product.itemId,
            });

            // Update product
            const updatedProductResult = await productsCollection.findOneAndUpdate(
              {
                _id: productId,
              },
              {
                $set: {
                  ...values,
                  slug: updatedSlug,
                  updatedAt: new Date(),
                },
              },
              {
                returnDocument: 'after',
              },
            );

            // update shop products
            const updatedShopProductResult = await shopProductsCollection.updateMany(
              {
                productId,
              },
              {
                $set: {
                  slug: updatedSlug,
                  nameI18n: values.nameI18n,
                  originalName: values.originalName,
                  barcode: values.barcode,
                  updatedAt: new Date(),
                },
              },
            );

            // update assets
            const updatedProductAssetResult = await productAssetsCollection.updateMany(
              {
                productId,
              },
              {
                $set: {
                  slug: updatedSlug,
                },
              },
            );

            const updatedProduct = updatedProductResult.value;
            if (
              !updatedProductResult.ok ||
              !updatedProduct ||
              !updatedShopProductResult.result.ok ||
              !updatedProductAssetResult.result.ok
            ) {
              mutationPayload = {
                success: false,
                message: await getApiMessage(`products.update.error`),
              };
              await session.abortTransaction();
              return;
            }

            // Update algolia product object
            const algoliaProductResult = await saveAlgoliaObjects({
              indexName: `${process.env.ALG_INDEX_PRODUCTS}`,
              objects: [
                {
                  _id: updatedProduct._id.toHexString(),
                  objectID: updatedProduct._id.toHexString(),
                  itemId: updatedProduct.itemId,
                  originalName: updatedProduct.originalName,
                  nameI18n: updatedProduct.nameI18n,
                  barcode: updatedProduct.barcode,
                },
              ],
            });
            if (!algoliaProductResult) {
              mutationPayload = {
                success: false,
                message: await getApiMessage(`products.update.error`),
              };
              await session.abortTransaction();
              return;
            }

            // Update algolia shop product objects
            const shopProducts = await shopProductsCollection
              .find({
                productId,
              })
              .toArray();
            const castedShopProductsForAlgolia: AlgoliaProductInterface[] = shopProducts.map(
              (shopProduct) => {
                return {
                  _id: shopProduct._id.toHexString(),
                  objectID: shopProduct._id.toHexString(),
                  itemId: shopProduct.itemId,
                  originalName: shopProduct.originalName,
                  nameI18n: shopProduct.nameI18n,
                  barcode: shopProduct.barcode,
                };
              },
            );
            const algoliaShopProductsResult = await saveAlgoliaObjects({
              indexName: `${process.env.ALG_INDEX_SHOP_PRODUCTS}`,
              objects: castedShopProductsForAlgolia,
            });
            if (!algoliaShopProductsResult) {
              mutationPayload = {
                success: false,
                message: await getApiMessage(`products.update.error`),
              };
              await session.abortTransaction();
              return;
            }

            mutationPayload = {
              success: true,
              message: await getApiMessage('products.update.success'),
              payload: updatedProduct,
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
      },
    });

    // Should delete product asset
    t.nonNull.field('deleteProductAsset', {
      type: 'ProductPayload',
      description: 'Should update product assets',
      args: {
        input: nonNull(
          arg({
            type: 'DeleteProductAssetInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<ProductPayloadModel> => {
        const { getApiMessage } = await getRequestParams(context);
        const { db, client } = await getDatabase();
        const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
        const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
        const productAssetsCollection = db.collection<ProductAssetsModel>(COL_PRODUCT_ASSETS);

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
              slug: 'deleteProduct',
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
            const { productId, assetIndex } = input;

            // Check product availability
            const product = await productsCollection.findOne({ _id: productId });
            const initialAssets = await productAssetsCollection.findOne({ productId });
            if (!product || !initialAssets) {
              mutationPayload = {
                success: false,
                message: await getApiMessage(`products.update.notFound`),
              };
              await session.abortTransaction();
              return;
            }

            // Delete product asset
            const currentAsset = initialAssets.assets.find(({ index }) => index === assetIndex);
            if (
              currentAsset &&
              currentAsset.url !== process.env.OBJECT_STORAGE_PRODUCT_IMAGE_FALLBACK
            ) {
              const removedAsset = await deleteUpload({ filePath: `${currentAsset?.url}` });
              if (!removedAsset) {
                mutationPayload = {
                  success: false,
                  message: await getApiMessage(`products.update.error`),
                };
                await session.abortTransaction();
                return;
              }
            }

            // Update product assets
            const updatedProductAssetsResult = await productAssetsCollection.findOneAndUpdate(
              {
                productId,
              },
              {
                $pull: {
                  assets: {
                    index: assetIndex,
                  },
                },
              },
              {
                returnDocument: 'after',
              },
            );
            const updatedProductAssets = updatedProductAssetsResult.value;
            if (!updatedProductAssetsResult.ok || !updatedProductAssets) {
              mutationPayload = {
                success: false,
                message: await getApiMessage(`products.update.error`),
              };
              await session.abortTransaction();
              return;
            }

            const newAssets = updatedProductAssets.assets;
            const mainImage = getMainImage(newAssets);

            // Update product
            const updatedProductResult = await productsCollection.findOneAndUpdate(
              {
                _id: productId,
              },
              {
                $set: {
                  mainImage,
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

            const updatedShopProductsResult = await shopProductsCollection.updateMany(
              {
                productId,
              },
              {
                $set: {
                  mainImage,
                  updatedAt: new Date(),
                },
              },
            );
            if (!updatedShopProductsResult.result.ok) {
              mutationPayload = {
                success: false,
                message: await getApiMessage(`products.update.error`),
              };
              await session.abortTransaction();
              return;
            }

            mutationPayload = {
              success: true,
              message: await getApiMessage('products.update.success'),
              payload: updatedProduct,
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
      },
    });

    // Should update product asset index
    t.nonNull.field('updateProductAssetIndex', {
      type: 'ProductPayload',
      description: 'Should update product asset index',
      args: {
        input: nonNull(
          arg({
            type: 'UpdateProductAssetIndexInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<ProductPayloadModel> => {
        const { getApiMessage } = await getRequestParams(context);
        const { db, client } = await getDatabase();
        const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
        const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
        const productAssetsCollection = db.collection<ProductAssetsModel>(COL_PRODUCT_ASSETS);

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
            const { productId, assetNewIndex, assetUrl } = input;

            // Check product availability
            const product = await productsCollection.findOne({ _id: productId });
            const initialAssets = await productAssetsCollection.findOne({ productId });
            if (!product || !initialAssets) {
              mutationPayload = {
                success: false,
                message: await getApiMessage(`products.update.notFound`),
              };
              await session.abortTransaction();
              return;
            }

            // Reorder assets
            const reorderedAssetsWithUpdatedIndexes = reorderAssets({
              assetUrl,
              assetNewIndex,
              initialAssets: initialAssets.assets,
            });
            if (!reorderedAssetsWithUpdatedIndexes) {
              mutationPayload = {
                success: false,
                message: await getApiMessage(`products.update.error`),
              };
              await session.abortTransaction();
              return;
            }

            const updatedProductAssetsResult = await productAssetsCollection.findOneAndUpdate(
              {
                productId,
              },
              {
                $set: {
                  assets: reorderedAssetsWithUpdatedIndexes,
                },
              },
              {
                returnDocument: 'after',
              },
            );
            const updatedProductAssets = updatedProductAssetsResult.value;
            if (!updatedProductAssetsResult.ok || !updatedProductAssets) {
              mutationPayload = {
                success: false,
                message: await getApiMessage(`products.update.error`),
              };
              await session.abortTransaction();
              return;
            }
            const newAssets = updatedProductAssets.assets;
            const mainImage = getMainImage(newAssets);

            // Update product
            const updatedProductResult = await productsCollection.findOneAndUpdate(
              {
                _id: productId,
              },
              {
                $set: {
                  mainImage,
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

            const updatedShopProductsResult = await shopProductsCollection.updateMany(
              {
                productId,
              },
              {
                $set: {
                  mainImage,
                  updatedAt: new Date(),
                },
              },
            );
            if (!updatedShopProductsResult.result.ok) {
              mutationPayload = {
                success: false,
                message: await getApiMessage(`products.update.error`),
              };
              await session.abortTransaction();
              return;
            }

            mutationPayload = {
              success: true,
              message: await getApiMessage('products.update.success'),
              payload: updatedProduct,
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
            if (!updatedShopProductsResult.result.ok) {
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
