import { arg, extendType, inputObjectType, list, nonNull, objectType } from 'nexus';
import generator from 'generate-password';
import { DEFAULT_COUNTERS_OBJECT, GEO_POINT_TYPE } from '../lib/config/common';
import { COL_PRODUCT_SUMMARIES, COL_SHOP_PRODUCTS, COL_SHOPS } from '../db/collectionNames';
import { ProductSummaryModel, ShopModel, ShopPayloadModel, ShopProductModel } from '../db/dbModels';
import { getDatabase } from '../db/mongodb';
import { getReadableAddress } from '../lib/addressUtils';
import { deleteUpload, getMainImage, reorderAssets } from '../lib/assetUtils/assetUtils';
import getResolverErrorMessage from '../lib/getResolverErrorMessage';
import { getNextItemId } from '../lib/itemIdUtils';
import {
  getOperationPermission,
  getRequestParams,
  getResolverValidationSchema,
} from '../lib/sessionHelpers';
import {
  addManyProductsToShopSchema,
  deleteProductFromShopSchema,
  updateShopSchema,
} from '../validation/shopSchema';

export const ShopProductsPaginationPayload = objectType({
  name: 'ShopProductsPaginationPayload',
  definition(t) {
    t.implements('PaginationPayload');
    t.nonNull.list.nonNull.field('docs', {
      type: 'ShopProduct',
    });
  },
});

export const Shop = objectType({
  name: 'Shop',
  definition(t) {
    t.implements('Base');
    t.implements('Timestamp');
    t.nonNull.string('name');
    t.nonNull.string('slug');
    t.nonNull.string('citySlug');
    t.nonNull.objectId('companyId');
    t.field('mapMarker', {
      type: 'MapMarker',
    });
    t.nonNull.string('logo');
    t.nonNull.list.nonNull.string('assets');
    t.nonNull.field('contacts', {
      type: 'Contacts',
    });
    t.nonNull.field('address', {
      type: 'Address',
    });
  },
});

export const ShopsPaginationPayload = objectType({
  name: 'ShopsPaginationPayload',
  definition(t) {
    t.implements('PaginationPayload');
    t.nonNull.list.nonNull.field('docs', {
      type: 'Shop',
    });
  },
});

export const ShopPayload = objectType({
  name: 'ShopPayload',
  definition(t) {
    t.implements('Payload');
    t.field('payload', {
      type: 'Shop',
    });
  },
});

export const AddProductToShopInput = inputObjectType({
  name: 'AddProductToShopInput',
  definition(t) {
    t.nonNull.objectId('shopId');
    t.nonNull.objectId('productId');
    t.nonNull.int('price');
    t.nonNull.int('available');
  },
});

export const DeleteProductFromShopInput = inputObjectType({
  name: 'DeleteProductFromShopInput',
  definition(t) {
    t.nonNull.objectId('shopId');
    t.nonNull.objectId('shopProductId');
  },
});

export const UpdateShopInCompanyInput = inputObjectType({
  name: 'UpdateShopInput',
  definition(t) {
    t.nonNull.objectId('shopId');
    t.nonNull.string('name');
    t.nonNull.string('citySlug');
    t.string('license');
    t.json('priceWarningI18n');
    t.nonNull.field('contacts', {
      type: 'ContactsInput',
    });
    t.nonNull.field('address', {
      type: 'AddressInput',
    });
  },
});

export const DeleteShopAssetInput = inputObjectType({
  name: 'DeleteShopAssetInput',
  definition(t) {
    t.nonNull.objectId('shopId');
    t.nonNull.int('assetIndex');
  },
});

export const UpdateShopAssetIndexInput = inputObjectType({
  name: 'UpdateShopAssetIndexInput',
  definition(t) {
    t.nonNull.objectId('shopId');
    t.nonNull.string('assetUrl');
    t.nonNull.int('assetNewIndex');
  },
});

// Shop Mutations
export const ShopMutations = extendType({
  type: 'Mutation',
  definition(t) {
    // Should update shop
    t.nonNull.field('updateShop', {
      type: 'ShopPayload',
      description: 'Should update shop',
      args: {
        input: nonNull(
          arg({
            type: 'UpdateShopInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<ShopPayloadModel> => {
        try {
          // Permission
          const { allow, message } = await getOperationPermission({
            context,
            slug: 'updateShop',
          });
          if (!allow) {
            return {
              success: false,
              message,
            };
          }

          // Validate
          const validationSchema = await getResolverValidationSchema({
            context,
            schema: updateShopSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const { db } = await getDatabase();
          const shopsCollection = db.collection<ShopModel>(COL_SHOPS);
          const { input } = args;
          const { shopId, ...values } = input;

          // Check shop availability
          const shop = await shopsCollection.findOne({ _id: shopId });
          if (!shop) {
            return {
              success: false,
              message: await getApiMessage('shops.update.notFound'),
            };
          }

          // Check if shop already exist in the company
          const exist = await shopsCollection.findOne({ _id: { $ne: shopId }, name: values.name });
          if (exist) {
            return {
              success: false,
              message: await getApiMessage('shops.update.duplicate'),
            };
          }

          // Update shop
          const updatedShopResult = await shopsCollection.findOneAndUpdate(
            { _id: shopId },
            {
              $set: {
                ...values,
                updatedAt: new Date(),
                address: {
                  readableAddress: getReadableAddress(values.address.addressComponents),
                  addressComponents: values.address.addressComponents,
                  formattedAddress: values.address.formattedAddress,
                  mapCoordinates: {
                    lat: values.address.point.lat,
                    lng: values.address.point.lng,
                  },
                  point: {
                    type: GEO_POINT_TYPE,
                    coordinates: [values.address.point.lng, values.address.point.lat],
                  },
                },
              },
            },
            {
              returnDocument: 'after',
            },
          );
          const updatedShop = updatedShopResult.value;
          if (!updatedShopResult.ok || !updatedShop) {
            return {
              success: false,
              message: await getApiMessage('shops.update.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('shops.update.success'),
            payload: updatedShop,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should delete shop asset
    t.nonNull.field('deleteShopAsset', {
      type: 'ShopPayload',
      description: 'Should delete shop asset',
      args: {
        input: nonNull(
          arg({
            type: 'DeleteShopAssetInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<ShopPayloadModel> => {
        try {
          // Permission
          const { allow, message } = await getOperationPermission({
            context,
            slug: 'updateShop',
          });
          if (!allow) {
            return {
              success: false,
              message,
            };
          }

          const { getApiMessage } = await getRequestParams(context);
          const { db } = await getDatabase();
          const shopsCollection = db.collection<ShopModel>(COL_SHOPS);
          const { input } = args;
          const { shopId, assetIndex } = input;

          // Check shop availability
          const shop = await shopsCollection.findOne({ _id: shopId });
          if (!shop) {
            return {
              success: false,
              message: await getApiMessage('shops.update.notFound'),
            };
          }

          // Delete shop asset
          const currentAsset = shop.assets[assetIndex];
          const removedAsset = await deleteUpload(`${currentAsset}`);
          if (!removedAsset) {
            return {
              success: false,
              message: await getApiMessage(`shops.update.error`),
            };
          }

          // Update shop
          const updatedShopResult = await shopsCollection.findOneAndUpdate(
            { _id: shopId },
            {
              $set: {
                updatedAt: new Date(),
              },
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
          const updatedShop = updatedShopResult.value;
          if (!updatedShopResult.ok || !updatedShop) {
            return {
              success: false,
              message: await getApiMessage('shops.update.error'),
            };
          }

          const mainImage = getMainImage(updatedShop.assets);
          const updatedShopMainImageResult = await shopsCollection.findOneAndUpdate(
            { _id: shopId },
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
          const updatedShopMainImage = updatedShopMainImageResult.value;
          if (!updatedShopMainImageResult.ok || !updatedShopMainImage) {
            return {
              success: false,
              message: await getApiMessage('shops.update.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('shops.update.success'),
            payload: updatedShopMainImage,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should update shop asset index
    t.nonNull.field('updateShopAssetIndex', {
      type: 'ShopPayload',
      description: 'Should update shop asset index',
      args: {
        input: nonNull(
          arg({
            type: 'UpdateShopAssetIndexInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<ShopPayloadModel> => {
        try {
          // Permission
          const { allow, message } = await getOperationPermission({
            context,
            slug: 'updateShop',
          });
          if (!allow) {
            return {
              success: false,
              message,
            };
          }

          const { getApiMessage } = await getRequestParams(context);
          const { db } = await getDatabase();
          const shopsCollection = db.collection<ShopModel>(COL_SHOPS);
          const { input } = args;
          const { shopId, assetNewIndex, assetUrl } = input;

          // Check shop availability
          const shop = await shopsCollection.findOne({ _id: shopId });
          if (!shop) {
            return {
              success: false,
              message: await getApiMessage('shops.update.notFound'),
            };
          }

          // Reorder assets
          const reorderedAssetsWithUpdatedIndexes = reorderAssets({
            assetUrl,
            assetNewIndex,
            initialAssets: shop.assets,
          });
          if (!reorderedAssetsWithUpdatedIndexes) {
            return {
              success: false,
              message: await getApiMessage(`shops.update.error`),
            };
          }

          // Update shop
          const mainImage = getMainImage(reorderedAssetsWithUpdatedIndexes);
          const updatedShopResult = await shopsCollection.findOneAndUpdate(
            { _id: shopId },
            {
              $set: {
                updatedAt: new Date(),
                assets: reorderedAssetsWithUpdatedIndexes,
                mainImage,
              },
            },
            {
              returnDocument: 'after',
            },
          );
          const updatedShop = updatedShopResult.value;
          if (!updatedShopResult.ok || !updatedShop) {
            return {
              success: false,
              message: await getApiMessage('shops.update.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('shops.update.success'),
            payload: updatedShop,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should add many products to the shop
    t.nonNull.field('addManyProductsToShop', {
      type: 'ShopPayload',
      description: 'Should add many products to the shop',
      args: {
        input: nonNull(
          list(
            nonNull(
              arg({
                type: 'AddProductToShopInput',
              }),
            ),
          ),
        ),
      },
      resolve: async (_root, args, context): Promise<ShopPayloadModel> => {
        const { getApiMessage } = await getRequestParams(context);
        const { db, client } = await getDatabase();
        const shopsCollection = db.collection<ShopModel>(COL_SHOPS);
        const productSummariesCollection =
          db.collection<ProductSummaryModel>(COL_PRODUCT_SUMMARIES);
        const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);

        const session = client.startSession();

        let mutationPayload: ShopPayloadModel = {
          success: false,
          message: await getApiMessage('shops.addProduct.error'),
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

            // Validate
            const validationSchema = await getResolverValidationSchema({
              context,
              schema: addManyProductsToShopSchema,
            });
            await validationSchema.validate(args);

            let doneCount = 0;
            for await (const shopProductInput of args.input) {
              const { shopId, productId, ...values } = shopProductInput;

              // Check shop and product availability
              const shop = await shopsCollection.findOne({ _id: shopId });
              const product = await productSummariesCollection.findOne({ _id: productId });
              if (!shop || !product) {
                break;
              }

              // Check if product already exist in the shop
              const exist = await shopProductsCollection.findOne({
                productId,
                shopId: shop._id,
              });
              if (exist) {
                break;
              }

              // Create shop product
              const itemId = await getNextItemId(COL_SHOP_PRODUCTS);
              const createdShopProductResult = await shopProductsCollection.insertOne({
                ...values,
                itemId,
                productId,
                discountedPercent: 0,
                shopId: shop._id,
                citySlug: shop.citySlug,
                oldPrices: [],
                rubricId: product.rubricId,
                rubricSlug: product.rubricSlug,
                companyId: shop.companyId,
                companySlug: shop.companySlug,
                brandSlug: product.brandSlug,
                mainImage: product.mainImage,
                allowDelivery: product.allowDelivery,
                brandCollectionSlug: product.brandCollectionSlug,
                manufacturerSlug: product.manufacturerSlug,
                filterSlugs: product.filterSlugs,
                updatedAt: new Date(),
                createdAt: new Date(),
                ...DEFAULT_COUNTERS_OBJECT,
              });
              if (!createdShopProductResult.acknowledged) {
                break;
              }

              doneCount = doneCount + 1;
            }

            if (doneCount !== args.input.length) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('shops.addProduct.error'),
              };
              await session.abortTransaction();
              return;
            }

            mutationPayload = {
              success: true,
              message: await getApiMessage('shops.addProduct.success'),
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

    // Should delete product from shop
    t.nonNull.field('deleteProductFromShop', {
      type: 'ShopPayload',
      description: 'Should delete product from shop',
      args: {
        input: nonNull(
          arg({
            type: 'DeleteProductFromShopInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<ShopPayloadModel> => {
        try {
          // Permission
          const { allow, message } = await getOperationPermission({
            context,
            slug: 'deleteShopProduct',
          });
          if (!allow) {
            return {
              success: false,
              message,
            };
          }

          // Validate
          const validationSchema = await getResolverValidationSchema({
            context,
            schema: deleteProductFromShopSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const { db } = await getDatabase();
          const shopsCollection = db.collection<ShopModel>(COL_SHOPS);
          const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
          const { input } = args;
          const { shopId, shopProductId } = input;

          // Check shop and shop product availability
          const shop = await shopsCollection.findOne({ _id: shopId });
          const shopProduct = await shopProductsCollection.findOne({ _id: shopProductId });
          if (!shop || !shopProduct) {
            return {
              success: false,
              message: await getApiMessage('shops.deleteProduct.notFound'),
            };
          }

          // Delete shop product
          const removedShopProductResult = await shopProductsCollection.findOneAndDelete({
            _id: shopProductId,
          });
          if (!removedShopProductResult.ok) {
            return {
              success: false,
              message: await getApiMessage('shops.deleteProduct.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('shops.deleteProduct.success'),
            payload: shop,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should generate shop token
    t.nonNull.field('generateShopToken', {
      type: 'ShopPayload',
      description: 'Should generate shop token',
      args: {
        _id: nonNull(
          arg({
            type: 'ObjectId',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<ShopPayloadModel> => {
        try {
          // Permission
          const { allow, message } = await getOperationPermission({
            context,
            slug: 'updateShop',
          });
          if (!allow) {
            return {
              success: false,
              message,
            };
          }

          const { getApiMessage } = await getRequestParams(context);
          const { db } = await getDatabase();
          const shopsCollection = db.collection<ShopModel>(COL_SHOPS);
          const { _id } = args;

          // Check shop availability
          const shop = await shopsCollection.findOne({ _id });
          if (!shop) {
            return {
              success: false,
              message: await getApiMessage('shops.update.notFound'),
            };
          }

          // Create token for shop
          const token = generator.generate({
            length: 10,
            numbers: true,
          });

          // Update shop
          const updatedShopResult = await shopsCollection.findOneAndUpdate(
            { _id },
            {
              $set: {
                token,
                updatedAt: new Date(),
              },
            },
            {
              returnDocument: 'after',
            },
          );
          const updatedShop = updatedShopResult.value;
          if (!updatedShopResult.ok || !updatedShop) {
            return {
              success: false,
              message: await getApiMessage('shops.update.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('shops.update.success'),
            payload: updatedShop,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });
  },
});
