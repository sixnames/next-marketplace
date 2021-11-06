import { saveAlgoliaObjects } from 'lib/algoliaUtils';
import { getParentTreeSlugs } from 'lib/optionsUtils';
import { checkProductDescriptionUniqueness } from 'lib/textUniquenessUtils';
import { ObjectId } from 'mongodb';
import { arg, extendType, inputObjectType, nonNull, objectType } from 'nexus';
import {
  CategoryModel,
  ProductAssetsModel,
  ProductAttributeModel,
  ProductCardContentModel,
  ProductCardDescriptionModel,
  ProductModel,
  ProductPayloadModel,
  RubricModel,
  ShopModel,
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
  COL_CATEGORIES,
  COL_NOT_SYNCED_PRODUCTS,
  COL_PRODUCT_ASSETS,
  COL_PRODUCT_ATTRIBUTES,
  COL_PRODUCT_CARD_CONTENTS,
  COL_PRODUCT_CARD_DESCRIPTIONS,
  COL_PRODUCTS,
  COL_RUBRICS,
  COL_SHOP_PRODUCTS,
  COL_SHOPS,
} from 'db/collectionNames';
import {
  DEFAULT_COMPANY_SLUG,
  DEFAULT_COUNTERS_OBJECT,
  IMAGE_FALLBACK,
  VIEWS_COUNTER_STEP,
} from 'config/common';
import { getNextItemId } from 'lib/itemIdUtils';
import { updateProductSchema } from 'validation/productSchema';
import { deleteUpload, getMainImage, reorderAssets } from 'lib/assetUtils/assetUtils';

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
    t.nonNull.string('companySlug');
    t.nonNull.boolean('active');
    t.nonNull.list.nonNull.string('barcode');
    t.nonNull.string('originalName');
    t.json('nameI18n');
    t.json('descriptionI18n');
    t.json('cardDescriptionI18n');
    t.nonNull.objectId('rubricId');
    t.nonNull.field('gender', {
      type: 'Gender',
    });
  },
});

export const CopyProductInput = inputObjectType({
  name: 'CopyProductInput',
  definition(t) {
    t.nonNull.objectId('productId');
    t.nonNull.string('companySlug');
    t.nonNull.boolean('active');
    t.nonNull.list.nonNull.string('barcode');
    t.nonNull.string('originalName');
    t.json('nameI18n');
    t.json('descriptionI18n');
    t.json('cardDescriptionI18n');
    t.nonNull.field('gender', {
      type: 'Gender',
    });
  },
});

export const UpdateProductInput = inputObjectType({
  name: 'UpdateProductInput',
  definition(t) {
    t.nonNull.objectId('productId');
    t.nonNull.string('companySlug');
    t.nonNull.boolean('active');
    t.list.nonNull.string('barcode');
    t.string('originalName');
    t.json('nameI18n');
    t.json('descriptionI18n');
    t.json('cardDescriptionI18n');
    t.nonNull.field('gender', {
      type: 'Gender',
    });
  },
});

export const UpdateProductWithSyncErrorInput = inputObjectType({
  name: 'UpdateProductWithSyncErrorInput',
  definition(t) {
    t.nonNull.objectId('productId');
    t.nonNull.list.nonNull.string('barcode');
    t.nonNull.int('available');
    t.nonNull.int('price');
    t.nonNull.objectId('shopId');
  },
});

export const CreateProductWithSyncErrorInput = inputObjectType({
  name: 'CreateProductWithSyncErrorInput',
  definition(t) {
    t.nonNull.int('available');
    t.nonNull.int('price');
    t.nonNull.objectId('shopId');
    t.nonNull.field('productFields', {
      type: 'CreateProductInput',
    });
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
    t.string('companySlug', { default: DEFAULT_COMPANY_SLUG });
  },
});

export const UpdateProductCategoryInput = inputObjectType({
  name: 'UpdateProductCategoryInput',
  definition(t) {
    t.nonNull.objectId('productId');
    t.nonNull.objectId('categoryId');
  },
});

// Product Mutations
export const ProductMutations = extendType({
  type: 'Mutation',
  definition(t) {
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
        const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
        const productsCardDescriptionsCollection = db.collection<ProductCardDescriptionModel>(
          COL_PRODUCT_CARD_DESCRIPTIONS,
        );

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
            const { productId, companySlug, cardDescriptionI18n, ...values } = input;

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

            // Get selected rubric
            const rubric = await rubricsCollection.findOne({ _id: product.rubricId });
            if (!rubric) {
              mutationPayload = {
                success: false,
                message: await getApiMessage(`products.update.error`),
              };
              await session.abortTransaction();
              return;
            }

            // check description uniqueness
            const cardDescription = await productsCardDescriptionsCollection.findOne({
              productId,
              companySlug,
            });
            await checkProductDescriptionUniqueness({
              product,
              cardDescriptionI18n,
              oldCardDescriptionI18n: cardDescription?.textI18n,
              companySlug,
            });

            // Update product
            const updatedProductResult = await productsCollection.findOneAndUpdate(
              {
                _id: productId,
              },
              {
                $set: {
                  ...values,
                  originalName: values.originalName || '',
                  updatedAt: new Date(),
                },
              },
              {
                returnDocument: 'after',
              },
            );

            // Update card description
            const createdCardDescription =
              await productsCardDescriptionsCollection.findOneAndUpdate(
                {
                  productId,
                  companySlug,
                },
                {
                  $set: {
                    textI18n: cardDescriptionI18n || {},
                  },
                },
                {
                  upsert: true,
                },
              );
            if (!createdCardDescription.ok) {
              mutationPayload = {
                success: false,
                message: await getApiMessage(`products.create.error`),
              };
              await session.abortTransaction();
              return;
            }

            const updatedProduct = updatedProductResult.value;
            if (!updatedProductResult.ok || !updatedProduct) {
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
                  descriptionI18n: updatedProduct.descriptionI18n,
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
            if (currentAsset) {
              const removedAsset = await deleteUpload(`${currentAsset?.url}`);
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

    // Should copy product
    t.nonNull.field('copyProduct', {
      type: 'ProductPayload',
      description: 'Should copy product',
      args: {
        input: nonNull(
          arg({
            type: 'CopyProductInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<ProductPayloadModel> => {
        const { getApiMessage } = await getRequestParams(context);
        const { db, client } = await getDatabase();
        const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
        const productCardContentsCollection =
          db.collection<ProductCardContentModel>(COL_PRODUCT_CARD_CONTENTS);
        const productAttributesCollection =
          db.collection<ProductAttributeModel>(COL_PRODUCT_ATTRIBUTES);
        const productAssetsCollection = db.collection<ProductAssetsModel>(COL_PRODUCT_ASSETS);

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
              schema: updateProductSchema,
            });
            await validationSchema.validate(args.input);

            const { input } = args;
            const { productId, ...values } = input;

            // Get source product
            const sourceProduct = await productsCollection.findOne({ _id: productId });
            if (!sourceProduct) {
              mutationPayload = {
                success: false,
                message: await getApiMessage(`products.update.notFound`),
              };
              await session.abortTransaction();
              return;
            }

            // Create product
            const itemId = await getNextItemId(COL_PRODUCTS);
            const newProductId = new ObjectId();
            const createdProductResult = await productsCollection.insertOne({
              ...sourceProduct,
              ...values,
              _id: newProductId,
              itemId,
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

            // Create product assets
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

            // Get source product attributes
            const sourceProductAttributes = await productAttributesCollection
              .find({
                productId,
              })
              .toArray();
            // Create product attributes
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

            // Get source product card contents
            const sourceCardContents = await productCardContentsCollection
              .find({
                productId,
              })
              .toArray();
            // Create product card contents
            const createdProductCardContents: ProductCardContentModel[] = [];
            for await (const productCardContent of sourceCardContents) {
              createdProductCardContents.push({
                ...productCardContent,
                _id: new ObjectId(),
                productId: createdProduct._id,
                productSlug: createdProduct.slug,
              });
            }
            if (createdProductCardContents.length > 0) {
              const newCardContentsResult = await productCardContentsCollection.insertMany(
                createdProductCardContents,
              );
              if (!newCardContentsResult.acknowledged) {
                mutationPayload = {
                  success: false,
                  message: await getApiMessage(`products.create.error`),
                };
                await session.abortTransaction();
                return;
              }
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
                  descriptionI18n: createdProduct.descriptionI18n,
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

    // Should update product with syn error and remove sync error
    t.nonNull.field('updateProductWithSyncError', {
      type: 'ProductPayload',
      description: 'Should update product with syn error and remove sync error',
      args: {
        input: nonNull(
          arg({
            type: 'UpdateProductWithSyncErrorInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<ProductPayloadModel> => {
        const { getApiMessage } = await getRequestParams(context);
        const { db, client } = await getDatabase();
        const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
        const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
        const shopsCollection = db.collection<ShopModel>(COL_SHOPS);
        const notSyncedProductsCollection = db.collection<ShopModel>(COL_NOT_SYNCED_PRODUCTS);

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
              slug: 'createShopProduct',
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
            const { productId, available, price, shopId } = input;

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

            // Check shop availability
            const shop = await shopsCollection.findOne({ _id: shopId });
            if (!shop) {
              mutationPayload = {
                success: false,
                message: await getApiMessage(`shops.update.notFound`),
              };
              await session.abortTransaction();
              return;
            }

            // Check if shop product already exist
            const shopProduct = await shopProductsCollection.findOne({
              barcode: {
                $in: input.barcode,
              },
              productId,
              shopId,
            });
            if (shopProduct) {
              mutationPayload = {
                success: false,
                message: await getApiMessage(`shopProducts.create.duplicate`),
              };
              await session.abortTransaction();
              return;
            }

            // Update product
            const updatedProductResult = await productsCollection.findOneAndUpdate(
              {
                _id: productId,
              },
              {
                $addToSet: {
                  barcode: {
                    $each: input.barcode,
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

            // Update product algolia object
            const productAlgoliaResult = await saveAlgoliaObjects({
              indexName: `${process.env.ALG_INDEX_PRODUCTS}`,
              objects: [
                {
                  _id: updatedProduct._id.toHexString(),
                  objectID: updatedProduct._id.toHexString(),
                  itemId: updatedProduct.itemId,
                  originalName: updatedProduct.originalName,
                  nameI18n: updatedProduct.nameI18n,
                  descriptionI18n: updatedProduct.descriptionI18n,
                  barcode: updatedProduct.barcode,
                },
              ],
            });
            if (!productAlgoliaResult) {
              mutationPayload = {
                success: false,
                message: await getApiMessage(`products.create.error`),
              };
              await session.abortTransaction();
              return;
            }

            // Delete sync errors
            const removedNotSyncedProductsResult = await notSyncedProductsCollection.deleteMany({
              barcode: {
                $in: input.barcode,
              },
            });
            if (!removedNotSyncedProductsResult.acknowledged) {
              mutationPayload = {
                success: false,
                message: await getApiMessage(`products.update.error`),
              };
              await session.abortTransaction();
              return;
            }

            // create shop products
            const itemId = await getNextItemId(COL_SHOP_PRODUCTS);
            const createdShopProductResult = await shopProductsCollection.insertOne({
              barcode: input.barcode,
              available,
              price,
              itemId,
              productId,
              discountedPercent: 0,
              shopId: shop._id,
              citySlug: shop.citySlug,
              oldPrices: [],
              rubricId: product.rubricId,
              rubricSlug: product.rubricSlug,
              companyId: shop.companyId,
              brandSlug: product.brandSlug,
              mainImage: product.mainImage,
              brandCollectionSlug: product.brandCollectionSlug,
              manufacturerSlug: product.manufacturerSlug,
              selectedOptionsSlugs: product.selectedOptionsSlugs,
              updatedAt: new Date(),
              createdAt: new Date(),
              ...DEFAULT_COUNTERS_OBJECT,
            });

            if (!createdShopProductResult.acknowledged) {
              mutationPayload = {
                success: false,
                message: await getApiMessage(`shopProducts.create.error`),
              };
              await session.abortTransaction();
              return;
            }

            mutationPayload = {
              success: true,
              message: await getApiMessage('shopProducts.create.success'),
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

    // Should create product with syn error and remove sync error
    t.nonNull.field('createProductWithSyncError', {
      type: 'ProductPayload',
      description: 'Should create product with syn error and remove sync error',
      args: {
        input: nonNull(
          arg({
            type: 'CreateProductWithSyncErrorInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<ProductPayloadModel> => {
        const { getApiMessage } = await getRequestParams(context);
        const { db, client } = await getDatabase();
        const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
        const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
        const shopsCollection = db.collection<ShopModel>(COL_SHOPS);
        const notSyncedProductsCollection = db.collection<ShopModel>(COL_NOT_SYNCED_PRODUCTS);
        const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);

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

            const { input } = args;
            const { productFields, available, price, shopId } = input;

            // Check if product already exist
            const existingProducts = await productsCollection
              .aggregate([
                {
                  $unwind: {
                    path: '$barcode',
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $match: {
                    barcode: {
                      $in: productFields.barcode,
                    },
                  },
                },
              ])
              .toArray();
            if (existingProducts.length > 0) {
              mutationPayload = {
                success: false,
                message: await getApiMessage(`products.create.error`),
              };
              await session.abortTransaction();
              return;
            }

            // Get selected rubric
            const rubric = await rubricsCollection.findOne({ _id: productFields.rubricId });
            if (!rubric) {
              mutationPayload = {
                success: false,
                message: await getApiMessage(`products.create.error`),
              };
              await session.abortTransaction();
              return;
            }

            // Check shop availability
            const shop = await shopsCollection.findOne({ _id: shopId });
            if (!shop) {
              mutationPayload = {
                success: false,
                message: await getApiMessage(`shops.update.notFound`),
              };
              await session.abortTransaction();
              return;
            }

            // Check if shop product already exist
            const existingShopProducts: ShopProductModel[] = [];
            for await (const barcode of productFields.barcode) {
              const shopProduct = await shopProductsCollection.findOne({
                barcode,
                shopId,
              });
              if (shopProduct) {
                existingShopProducts.push(shopProduct);
              }
            }
            if (existingShopProducts.length > 0) {
              mutationPayload = {
                success: false,
                message: await getApiMessage(`shopProducts.create.duplicate`),
              };
              await session.abortTransaction();
              return;
            }

            // Create product
            const productItemId = await getNextItemId(COL_PRODUCTS);
            const productId = new ObjectId();
            const createdProductResult = await productsCollection.insertOne({
              ...productFields,
              _id: productId,
              itemId: productItemId,
              slug: productItemId,
              mainImage: IMAGE_FALLBACK,
              rubricId: rubric._id,
              rubricSlug: rubric.slug,
              active: false,
              selectedOptionsSlugs: [],
              selectedAttributesIds: [],
              titleCategoriesSlugs: [],
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

            // Create product algolia object
            const productAlgoliaResult = await saveAlgoliaObjects({
              indexName: `${process.env.ALG_INDEX_PRODUCTS}`,
              objects: [
                {
                  _id: createdProduct._id.toHexString(),
                  objectID: createdProduct._id.toHexString(),
                  itemId: createdProduct.itemId,
                  originalName: createdProduct.originalName,
                  nameI18n: createdProduct.nameI18n,
                  descriptionI18n: createdProduct.descriptionI18n,
                  barcode: createdProduct.barcode,
                },
              ],
            });
            if (!productAlgoliaResult) {
              mutationPayload = {
                success: false,
                message: await getApiMessage(`products.create.error`),
              };
              await session.abortTransaction();
              return;
            }

            // Delete sync errors
            const removedNotSyncedProductsResult = await notSyncedProductsCollection.deleteMany({
              barcode: {
                $in: productFields.barcode,
              },
            });
            if (!removedNotSyncedProductsResult.acknowledged) {
              mutationPayload = {
                success: false,
                message: await getApiMessage(`products.create.error`),
              };
              await session.abortTransaction();
              return;
            }

            const shopProductItemId = await getNextItemId(COL_SHOP_PRODUCTS);
            const createdShopProductResult = await shopProductsCollection.insertOne({
              barcode: productFields.barcode,
              available,
              price,
              itemId: shopProductItemId,
              productId,
              discountedPercent: 0,
              shopId: shop._id,
              citySlug: shop.citySlug,
              oldPrices: [],
              rubricId: createdProduct.rubricId,
              rubricSlug: createdProduct.rubricSlug,
              companyId: shop.companyId,
              brandSlug: createdProduct.brandSlug,
              mainImage: createdProduct.mainImage,
              brandCollectionSlug: createdProduct.brandCollectionSlug,
              manufacturerSlug: createdProduct.manufacturerSlug,
              selectedOptionsSlugs: createdProduct.selectedOptionsSlugs,
              updatedAt: new Date(),
              createdAt: new Date(),
              ...DEFAULT_COUNTERS_OBJECT,
            });
            if (!createdShopProductResult.acknowledged) {
              mutationPayload = {
                success: false,
                message: await getApiMessage(`shopProducts.create.error`),
              };
              await session.abortTransaction();
              return;
            }

            mutationPayload = {
              success: true,
              message: await getApiMessage('shopProducts.create.success'),
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
