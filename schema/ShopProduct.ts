import { SUPPLIER_PRICE_VARIANT_ENUMS } from 'config/common';
import { getUpdatedShopProductPrices } from 'lib/shopUtils';
import { arg, enumType, extendType, inputObjectType, list, nonNull, objectType } from 'nexus';
import { getDatabase } from 'db/mongodb';
import {
  COL_PRODUCTS,
  COL_SHOP_PRODUCTS,
  COL_SHOPS,
  COL_SUPPLIER_PRODUCTS,
  COL_SUPPLIERS,
} from 'db/collectionNames';
import {
  ProductModel,
  ShopModel,
  ShopProductModel,
  ShopProductPayloadModel,
  SupplierModel,
  SupplierProductModel,
} from 'db/dbModels';
import {
  getOperationPermission,
  getRequestParams,
  getResolverValidationSchema,
  getSessionCart,
} from 'lib/sessionHelpers';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { updateManyShopProductsSchema } from 'validation/shopSchema';

export const ShopProductOldPrice = objectType({
  name: 'ShopProductOldPrice',
  definition(t) {
    t.implements('Timestamp');
    t.nonNull.int('price');
  },
});

export const ShopProduct = objectType({
  name: 'ShopProduct',
  definition(t) {
    t.nonNull.objectId('_id');
    t.implements('Timestamp');
    t.nonNull.string('citySlug');
    t.nonNull.int('available');
    t.nonNull.int('price');
    t.nonNull.objectId('productId');
    t.nonNull.objectId('shopId');
    t.list.nonNull.string('barcode');
    t.nonNull.list.nonNull.field('oldPrices', {
      type: 'ShopProductOldPrice',
    });
    t.int('oldPrice');
    t.field('discountedPercent', {
      type: 'Int',
    });

    // ShopProduct product field resolver
    t.nonNull.field('product', {
      type: 'Product',
      resolve: async (source): Promise<ProductModel> => {
        const { db } = await getDatabase();
        const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
        const product = await productsCollection.findOne({ _id: source.productId });
        if (!product) {
          throw Error('Product not found in ShopProduct');
        }
        return product;
      },
    });

    // ShopProduct shop field resolver
    t.nonNull.field('shop', {
      type: 'Shop',
      resolve: async (source): Promise<ShopModel> => {
        const { db } = await getDatabase();
        const shopsCollection = db.collection<ShopModel>(COL_SHOPS);
        const shop = await shopsCollection.findOne({ _id: source.shopId });
        if (!shop) {
          throw Error('Shop not found in ShopProduct');
        }
        return shop;
      },
    });

    // ShopProduct inCartCount field resolver
    t.nonNull.field('inCartCount', {
      type: 'Int',
      resolve: async (source, _args, context): Promise<number> => {
        const cart = await getSessionCart(context);
        const cartProduct = cart.cartProducts.find((cartProduct) => {
          return cartProduct?.shopProductId && cartProduct.shopProductId.equals(source._id);
        });

        if (!cartProduct) {
          return 0;
        }

        return cartProduct.amount;
      },
    });
  },
});

export const ShopProductPayload = objectType({
  name: 'ShopProductPayload',
  definition(t) {
    t.implements('Payload');
    t.field('payload', {
      type: 'ShopProduct',
    });
  },
});

export const UpdateShopProductInput = inputObjectType({
  name: 'UpdateShopProductInput',
  definition(t) {
    t.nonNull.int('available');
    t.nonNull.int('price');
    t.nonNull.objectId('productId');
    t.nonNull.objectId('shopProductId');
    t.list.nonNull.string('barcode');
  },
});

export const SupplierPriceVariant = enumType({
  name: 'SupplierPriceVariant',
  members: SUPPLIER_PRICE_VARIANT_ENUMS,
  description: 'SupplierPriceVariant variant enum.',
});

export const AddShopProductSupplierInput = inputObjectType({
  name: 'AddShopProductSupplierInput',
  definition(t) {
    t.nonNull.objectId('shopProductId');
    t.nonNull.objectId('supplierId');
    t.nonNull.int('price');
    t.nonNull.int('percent');
    t.nonNull.field('variant', {
      type: 'SupplierPriceVariant',
    });
  },
});

export const UpdateShopProductSupplierInput = inputObjectType({
  name: 'UpdateShopProductSupplierInput',
  definition(t) {
    t.nonNull.objectId('supplierProductId');
    t.nonNull.int('price');
    t.nonNull.int('percent');
    t.nonNull.field('variant', {
      type: 'SupplierPriceVariant',
    });
  },
});

export const ShopProductMutations = extendType({
  type: 'Mutation',
  definition(t) {
    // Should update many shop products
    t.nonNull.field('updateManyShopProducts', {
      type: 'ShopProductPayload',
      description: 'Should update many shop products',
      args: {
        input: nonNull(
          list(
            nonNull(
              arg({
                type: 'UpdateShopProductInput',
              }),
            ),
          ),
        ),
      },
      resolve: async (_root, args, context): Promise<ShopProductPayloadModel> => {
        try {
          // Permission
          const { allow, message } = await getOperationPermission({
            context,
            slug: 'updateShopProduct',
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
            schema: updateManyShopProductsSchema,
          });
          await validationSchema.validate(args);

          const { getApiMessage } = await getRequestParams(context);
          const { db } = await getDatabase();
          const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
          const { input } = args;

          let doneCount = 0;
          for await (const shopProductValues of input) {
            const { shopProductId, ...values } = shopProductValues;

            // Check shop product availability
            const shopProduct = await shopProductsCollection.findOne({ _id: shopProductId });
            if (!shopProduct) {
              break;
            }

            const { discountedPercent, oldPrice, oldPriceUpdater } = getUpdatedShopProductPrices({
              shopProduct,
              newPrice: values.price,
            });

            // Update shop product
            const updatedShopProductResult = await shopProductsCollection.findOneAndUpdate(
              { _id: shopProductId },
              {
                $set: {
                  ...values,
                  oldPrice,
                  discountedPercent,
                  updatedAt: new Date(),
                },
                ...oldPriceUpdater,
              },
              {
                returnDocument: 'after',
              },
            );
            const updatedShopProduct = updatedShopProductResult.value;
            if (!updatedShopProductResult.ok || !updatedShopProduct) {
              break;
            }

            doneCount = doneCount + 1;
          }

          if (doneCount !== input.length) {
            return {
              success: false,
              message: await getApiMessage('shopProducts.update.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('shopProducts.update.success'),
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should add shop products supplier
    t.nonNull.field('addShopProductSupplier', {
      type: 'ShopProductPayload',
      description: 'Should add shop products supplier',
      args: {
        input: nonNull(
          arg({
            type: 'AddShopProductSupplierInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<ShopProductPayloadModel> => {
        const { getApiMessage } = await getRequestParams(context);
        const { db, client } = await getDatabase();
        const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
        const suppliersCollection = db.collection<SupplierModel>(COL_SUPPLIERS);
        const supplierProductsCollection =
          db.collection<SupplierProductModel>(COL_SUPPLIER_PRODUCTS);

        const session = client.startSession();

        let mutationPayload: ShopProductPayloadModel = {
          success: false,
          message: await getApiMessage('shopProducts.update.error'),
        };

        try {
          await session.withTransaction(async () => {
            // permission
            const { allow, message } = await getOperationPermission({
              context,
              slug: 'updateShopProduct',
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

            // get shop product
            const shopProduct = await shopProductsCollection.findOne({
              _id: input.shopProductId,
            });
            if (!shopProduct) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('shopProducts.update.error'),
              };
              await session.abortTransaction();
              return;
            }

            // get supplier
            const supplier = await suppliersCollection.findOne({
              _id: input.supplierId,
            });
            if (!supplier) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('shopProducts.update.error'),
              };
              await session.abortTransaction();
              return;
            }

            // check if supplier product already exist
            const existingSupplierProduct = await supplierProductsCollection.findOne({
              supplierId: input.supplierId,
              shopProductId: input.shopProductId,
            });
            if (existingSupplierProduct) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('shopProducts.update.error'),
              };
              await session.abortTransaction();
              return;
            }

            // create supplier product
            const createdSupplierProductResult = await supplierProductsCollection.insertOne({
              shopProductId: shopProduct._id,
              supplierId: supplier._id,
              percent: input.percent,
              price: input.price,
              variant: input.variant,
              companyId: shopProduct.companyId,
              shopId: shopProduct.shopId,
            });
            if (!createdSupplierProductResult.acknowledged) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('shopProducts.update.error'),
              };
              await session.abortTransaction();
              return;
            }

            mutationPayload = {
              success: true,
              message: await getApiMessage('shopProducts.update.success'),
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

    // Should update shop products supplier
    t.nonNull.field('updateShopProductSupplier', {
      type: 'ShopProductPayload',
      description: 'Should update shop products supplier',
      args: {
        input: nonNull(
          arg({
            type: 'UpdateShopProductSupplierInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<ShopProductPayloadModel> => {
        const { getApiMessage } = await getRequestParams(context);
        const { db, client } = await getDatabase();
        const supplierProductsCollection =
          db.collection<SupplierProductModel>(COL_SUPPLIER_PRODUCTS);

        const session = client.startSession();

        let mutationPayload: ShopProductPayloadModel = {
          success: false,
          message: await getApiMessage('shopProducts.update.error'),
        };

        try {
          await session.withTransaction(async () => {
            // permission
            const { allow, message } = await getOperationPermission({
              context,
              slug: 'updateShopProduct',
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
            const { supplierProductId, ...values } = input;

            // get supplier product
            const supplierProduct = await supplierProductsCollection.findOne({
              _id: supplierProductId,
            });
            if (!supplierProduct) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('shopProducts.update.error'),
              };
              await session.abortTransaction();
              return;
            }

            // create supplier product
            const updatedSupplierProductResult = await supplierProductsCollection.findOneAndUpdate(
              {
                _id: supplierProduct._id,
              },
              {
                $set: {
                  percent: values.percent,
                  price: values.price,
                  variant: values.variant,
                },
              },
            );
            if (!updatedSupplierProductResult.ok) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('shopProducts.update.error'),
              };
              await session.abortTransaction();
              return;
            }

            mutationPayload = {
              success: true,
              message: await getApiMessage('shopProducts.update.success'),
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

    // Should delete shop products supplier
    t.nonNull.field('deleteShopProductSupplier', {
      type: 'ShopProductPayload',
      description: 'Should delete shop products supplier',
      args: {
        _id: nonNull(
          arg({
            type: 'ObjectId',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<ShopProductPayloadModel> => {
        const { getApiMessage } = await getRequestParams(context);
        const { db, client } = await getDatabase();
        const supplierProductsCollection =
          db.collection<SupplierProductModel>(COL_SUPPLIER_PRODUCTS);

        const session = client.startSession();

        let mutationPayload: ShopProductPayloadModel = {
          success: false,
          message: await getApiMessage('shopProducts.update.error'),
        };

        try {
          await session.withTransaction(async () => {
            // permission
            const { allow, message } = await getOperationPermission({
              context,
              slug: 'updateShopProduct',
            });
            if (!allow) {
              mutationPayload = {
                success: false,
                message,
              };
              await session.abortTransaction();
              return;
            }

            // create supplier product
            const removedSupplierProductResult = await supplierProductsCollection.findOneAndDelete({
              _id: args._id,
            });
            if (!removedSupplierProductResult.ok) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('shopProducts.update.error'),
              };
              await session.abortTransaction();
              return;
            }

            mutationPayload = {
              success: true,
              message: await getApiMessage('shopProducts.update.success'),
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
  },
});
