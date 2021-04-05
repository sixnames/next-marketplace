import { ASSETS_DIST_SHOPS, ASSETS_LOGO_WIDTH, ASSETS_SHOP_IMAGE_WIDTH } from 'config/common';
import { deleteUpload, reorderAssets, storeUploads } from 'lib/assets';
import { noNaN } from 'lib/numbers';
import { recalculateRubricProductCounters } from 'lib/rubricUtils';
import { arg, extendType, inputObjectType, nonNull, objectType, stringArg } from 'nexus';
import { getDatabase } from 'db/mongodb';
import {
  COL_CITIES,
  COL_COMPANIES,
  COL_PRODUCT_FACETS,
  COL_PRODUCTS,
  COL_SHOP_PRODUCTS,
  COL_SHOPS,
} from 'db/collectionNames';
import {
  CityModel,
  CompanyModel,
  ProductFacetModel,
  ProductModel,
  ShopModel,
  ShopPayloadModel,
  ShopProductModel,
  ShopProductsPaginationPayloadModel,
  ShopsPaginationPayloadModel,
} from 'db/dbModels';
import { aggregatePagination } from 'db/aggregatePagination';
import { getRequestParams, getResolverValidationSchema } from 'lib/sessionHelpers';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { updateProductShopsData } from 'lib/productShopsUtils';
import {
  addProductToShopSchema,
  addShopAssetsSchema,
  deleteProductFromShopSchema,
  updateShopLogoSchema,
  updateShopSchema,
} from 'validation/shopSchema';

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
    t.nonNull.field('logo', {
      type: 'Asset',
    });
    t.nonNull.list.nonNull.field('assets', {
      type: 'Asset',
    });
    t.nonNull.field('contacts', {
      type: 'Contacts',
    });
    t.nonNull.field('address', {
      type: 'Address',
    });

    // Shop paginated shopProducts field resolver
    t.nonNull.field('shopProducts', {
      type: 'ShopProductsPaginationPayload',
      args: {
        input: arg({
          type: 'PaginationInput',
        }),
      },
      resolve: async (source, args, context): Promise<ShopProductsPaginationPayloadModel> => {
        const { city } = await getRequestParams(context);
        const paginationResult = await aggregatePagination<ShopProductModel>({
          city,
          collectionName: COL_SHOP_PRODUCTS,
          input: args.input,
          pipeline: [
            {
              $match: {
                shopId: source._id,
              },
            },
          ],
        });
        return paginationResult;
      },
    });

    // Shop city resolver
    t.nonNull.field('city', {
      type: 'City',
      resolve: async (source): Promise<CityModel> => {
        const db = await getDatabase();
        const citiesCollection = db.collection<CityModel>(COL_CITIES);
        const city = await citiesCollection.findOne({ slug: source.citySlug });
        if (!city) {
          throw Error('City not found on Shop city field');
        }
        return city;
      },
    });

    // Shop company field resolver
    t.nonNull.field('company', {
      type: 'Company',
      resolve: async (source): Promise<CompanyModel> => {
        const db = await getDatabase();
        const companiesCollection = db.collection<CompanyModel>(COL_COMPANIES);
        const company = await companiesCollection.findOne({ shopsIds: source._id });
        if (!company) {
          throw Error('Company not found on Shop company field');
        }
        return company;
      },
    });

    // Shop productsCount field resolver
    t.nonNull.field('productsCount', {
      type: 'Int',
      resolve: async (source): Promise<number> => {
        const db = await getDatabase();
        const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
        const count = await shopProductsCollection.find({ shopId: source._id }).count();
        return count;
      },
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

// Shop Queries
export const ShopQueries = extendType({
  type: 'Query',
  definition(t) {
    // Should return shop by given id
    t.nonNull.field('getShop', {
      type: 'Shop',
      description: 'Should return shop by given id',
      args: {
        _id: nonNull(
          arg({
            type: 'ObjectId',
          }),
        ),
      },
      resolve: async (_root, args): Promise<ShopModel> => {
        const db = await getDatabase();
        const shopsCollection = db.collection<ShopModel>(COL_SHOPS);
        const shop = await shopsCollection.findOne({ _id: args._id });
        if (!shop) {
          throw Error('Shop not found by given id');
        }
        return shop;
      },
    });

    // Should return shop by given slug
    t.nonNull.field('getShopBySlug', {
      type: 'Shop',
      description: 'Should return shop by given slug',
      args: {
        slug: nonNull(stringArg()),
      },
      resolve: async (_root, args): Promise<ShopModel> => {
        const db = await getDatabase();
        const shopsCollection = db.collection<ShopModel>(COL_SHOPS);
        const shop = await shopsCollection.findOne({ slug: args.slug });
        if (!shop) {
          throw Error('Shop not found by given slug');
        }
        return shop;
      },
    });

    // Should return paginated shops list
    t.nonNull.field('getAllShops', {
      type: 'ShopsPaginationPayload',
      description: 'Should return shop by given slug',
      args: {
        input: arg({
          type: 'PaginationInput',
        }),
      },
      resolve: async (_root, args, context): Promise<ShopsPaginationPayloadModel> => {
        const { city } = await getRequestParams(context);
        const paginationResult = await aggregatePagination<ShopModel>({
          city,
          input: args.input,
          collectionName: COL_SHOPS,
        });
        return paginationResult;
      },
    });

    // Should return paginated company shops list
    t.nonNull.field('getCompanyShops', {
      type: 'ShopsPaginationPayload',
      description: 'Should return paginated company shops list',
      args: {
        input: arg({
          type: 'PaginationInput',
        }),
        companyId: nonNull(
          arg({
            type: 'ObjectId',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<ShopsPaginationPayloadModel> => {
        const { city } = await getRequestParams(context);
        const paginationResult = await aggregatePagination<ShopModel>({
          city,
          input: args.input,
          collectionName: COL_SHOPS,
          pipeline: [
            {
              $match: {
                companyId: args.companyId,
              },
            },
          ],
        });
        return paginationResult;
      },
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
    t.nonNull.field('contacts', {
      type: 'ContactsInput',
    });
    t.nonNull.field('address', {
      type: 'AddressInput',
    });
  },
});

export const UpdateShopLogoInput = inputObjectType({
  name: 'UpdateShopLogoInput',
  definition(t) {
    t.nonNull.objectId('shopId');
    t.nonNull.list.nonNull.upload('logo');
  },
});

export const AddShopAssetsInput = inputObjectType({
  name: 'AddShopAssetsInput',
  definition(t) {
    t.nonNull.objectId('shopId');
    t.nonNull.list.nonNull.upload('assets');
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
          // Validate
          const validationSchema = await getResolverValidationSchema({
            context,
            schema: updateShopSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
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
                  formattedAddress: values.address.formattedAddress,
                  point: {
                    type: 'Point',
                    coordinates: [values.address.point.lng, values.address.point.lat],
                  },
                },
              },
            },
            {
              returnOriginal: false,
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

    // Should add shop assets
    t.nonNull.field('addShopAssets', {
      type: 'ShopPayload',
      description: 'Should add shop assets',
      args: {
        input: nonNull(
          arg({
            type: 'AddShopAssetsInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<ShopPayloadModel> => {
        try {
          // Validate
          const validationSchema = await getResolverValidationSchema({
            context,
            schema: addShopAssetsSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
          const shopsCollection = db.collection<ShopModel>(COL_SHOPS);
          const { input } = args;
          const { shopId } = input;

          // Check shop availability
          const shop = await shopsCollection.findOne({ _id: shopId });
          if (!shop) {
            return {
              success: false,
              message: await getApiMessage('shops.update.notFound'),
            };
          }

          // Update shop assets
          const sortedAssets = shop.assets.sort((assetA, assetB) => {
            return assetB.index - assetA.index;
          });
          const firstAsset = sortedAssets[0];
          const startIndex = noNaN(firstAsset?.index);
          const assets = await storeUploads({
            itemId: shop.itemId,
            dist: ASSETS_DIST_SHOPS,
            files: input.assets,
            startIndex,
            asImage: true,
            width: ASSETS_SHOP_IMAGE_WIDTH,
          });
          if (!assets) {
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
              $push: {
                assets: {
                  $each: assets,
                },
              },
            },
            {
              returnOriginal: false,
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
          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
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

          // Delete product asset
          const currentAsset = shop.assets.find(({ index }) => index === assetIndex);
          const removedAsset = await deleteUpload({ filePath: `${currentAsset?.url}` });
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
              returnOriginal: false,
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
          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
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
          const updatedShopResult = await shopsCollection.findOneAndUpdate(
            { _id: shopId },
            {
              $set: {
                updatedAt: new Date(),
                assets: reorderedAssetsWithUpdatedIndexes,
              },
            },
            {
              returnOriginal: false,
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

    // Should update shop logo
    t.nonNull.field('updateShopLogo', {
      type: 'ShopPayload',
      description: 'Should update shop logo',
      args: {
        input: nonNull(
          arg({
            type: 'UpdateShopLogoInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<ShopPayloadModel> => {
        try {
          // Validate
          const validationSchema = await getResolverValidationSchema({
            context,
            schema: updateShopLogoSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
          const shopsCollection = db.collection<ShopModel>(COL_SHOPS);
          const { input } = args;
          const { shopId } = input;

          // Check shop availability
          const shop = await shopsCollection.findOne({ _id: shopId });
          if (!shop) {
            return {
              success: false,
              message: await getApiMessage('shops.update.notFound'),
            };
          }

          // Delete shop logo
          const removedAsset = await deleteUpload({ filePath: `${shop.logo.url}` });
          if (!removedAsset) {
            return {
              success: false,
              message: await getApiMessage(`shops.update.error`),
            };
          }

          // Upload new shop logo
          const uploadedLogo = await storeUploads({
            itemId: shop.itemId,
            dist: ASSETS_DIST_SHOPS,
            files: input.logo,
            startIndex: 0,
            asImage: true,
            width: ASSETS_LOGO_WIDTH,
          });
          if (!uploadedLogo) {
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
                logo: uploadedLogo[0],
              },
            },
            {
              returnOriginal: false,
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

    // Should add product to the shop
    t.nonNull.field('addProductToShop', {
      type: 'ShopPayload',
      description: 'Should add product to the shop',
      args: {
        input: nonNull(
          arg({
            type: 'AddProductToShopInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<ShopPayloadModel> => {
        try {
          // Validate
          const validationSchema = await getResolverValidationSchema({
            context,
            schema: addProductToShopSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
          const shopsCollection = db.collection<ShopModel>(COL_SHOPS);
          const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
          const productFacetsCollection = db.collection<ProductFacetModel>(COL_PRODUCT_FACETS);
          const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
          const { input } = args;
          const { shopId, productId, ...values } = input;

          // Check shop and product availability
          const shop = await shopsCollection.findOne({ _id: shopId });
          const product = await productsCollection.findOne({ _id: productId });
          const productFacet = await productFacetsCollection.findOne({ _id: productId });
          if (!shop || !product || !productFacet) {
            return {
              success: false,
              message: await getApiMessage('shops.addProduct.notFound'),
            };
          }

          // Check if product already exist in the shop
          const exist = await shopProductsCollection.findOne({
            productId,
            shopId: shop._id,
          });
          if (exist) {
            return {
              success: false,
              message: await getApiMessage('shops.addProduct.duplicate'),
            };
          }

          // Create shop product
          const createdShopProductResult = await shopProductsCollection.insertOne({
            ...values,
            productId,
            shopId: shop._id,
            citySlug: shop.citySlug,
            oldPrices: [],
            rubricId: product.rubricId,
            companyId: shop.companyId,
            selectedOptionsSlugs: productFacet.selectedOptionsSlugs,
            updatedAt: new Date(),
            createdAt: new Date(),
          });
          const createdShopProduct = createdShopProductResult.ops[0];
          if (!createdShopProductResult.result.ok || !createdShopProduct) {
            return {
              success: false,
              message: await getApiMessage('shops.addProduct.error'),
            };
          }

          // Update product shops data
          const updatedProduct = await updateProductShopsData({ productId });
          if (!updatedProduct) {
            return {
              success: false,
              message: await getApiMessage('shops.addProduct.error'),
            };
          }
          const updatedRubric = await recalculateRubricProductCounters({
            rubricId: updatedProduct.rubricId,
          });
          if (!updatedRubric) {
            return {
              success: false,
              message: await getApiMessage('shops.addProduct.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('shops.addProduct.success'),
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
          // Validate
          const validationSchema = await getResolverValidationSchema({
            context,
            schema: deleteProductFromShopSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
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

          // Update product shops data
          await updateProductShopsData({ productId: shopProduct.productId });

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
  },
});
