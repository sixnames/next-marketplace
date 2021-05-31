import { getCurrencyString } from 'lib/i18n';
import { getPercentage } from 'lib/numbers';
import { arg, extendType, inputObjectType, list, nonNull, objectType } from 'nexus';
import { getDatabase } from 'db/mongodb';
import { COL_PRODUCTS, COL_SHOP_PRODUCTS, COL_SHOPS } from 'db/collectionNames';
import { ProductModel, ShopModel, ShopProductModel, ShopProductPayloadModel } from 'db/dbModels';
import {
  getOperationPermission,
  getRequestParams,
  getResolverValidationSchema,
  getSessionCart,
} from 'lib/sessionHelpers';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { updateManyShopProductsSchema, updateShopProductSchema } from 'validation/shopSchema';

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
    t.nonNull.list.nonNull.field('oldPrices', {
      type: 'ShopProductOldPrice',
    });
    t.nonNull.field('formattedPrice', {
      type: 'String',
    });
    t.field('formattedOldPrice', {
      type: 'String',
    });
    t.field('discountedPercent', {
      type: 'Int',
    });

    // ShopProduct product field resolver
    t.nonNull.field('product', {
      type: 'Product',
      resolve: async (source): Promise<ProductModel> => {
        const db = await getDatabase();
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
        const db = await getDatabase();
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
  },
});

export const ShopProductMutations = extendType({
  type: 'Mutation',
  definition(t) {
    // Should update shop product
    t.nonNull.field('updateShopProduct', {
      type: 'ShopProductPayload',
      description: 'Should update shop product',
      args: {
        input: nonNull(
          arg({
            type: 'UpdateShopProductInput',
          }),
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
            schema: updateShopProductSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
          const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
          const { input } = args;
          const { shopProductId, ...values } = input;

          // Check shop product availability
          const shopProduct = await shopProductsCollection.findOne({ _id: shopProductId });
          if (!shopProduct) {
            return {
              success: false,
              message: await getApiMessage('shopProducts.update.notFound'),
            };
          }

          const priceChanged = shopProduct.price !== values.price;
          const oldPriceUpdater = priceChanged
            ? {
                $push: {
                  oldPrices: {
                    price: shopProduct.price,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                  },
                },
              }
            : {};

          const formattedOldPrice = priceChanged
            ? getCurrencyString(shopProduct.price)
            : shopProduct.formattedOldPrice;

          const lastOldPrice = priceChanged
            ? { price: shopProduct.price }
            : shopProduct.oldPrices[shopProduct.oldPrices.length - 1];
          const currentPrice = priceChanged ? values.price : shopProduct.price;
          const discountedPercent =
            lastOldPrice && lastOldPrice.price > shopProduct.price
              ? getPercentage({
                  fullValue: lastOldPrice.price,
                  partialValue: currentPrice,
                })
              : 0;

          // Update shop product
          const updatedShopProductResult = await shopProductsCollection.findOneAndUpdate(
            { _id: shopProductId },
            {
              $set: {
                ...values,
                formattedPrice: getCurrencyString(values.price),
                formattedOldPrice,
                discountedPercent,
                updatedAt: new Date(),
              },
              ...oldPriceUpdater,
            },
            {
              returnOriginal: false,
            },
          );
          const updatedShopProduct = updatedShopProductResult.value;
          if (!updatedShopProductResult.ok || !updatedShopProduct) {
            return {
              success: false,
              message: await getApiMessage('shopProducts.update.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('shopProducts.update.success'),
            payload: updatedShopProduct,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

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
          const db = await getDatabase();
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

            // Update shop product
            const updatedShopProductResult = await shopProductsCollection.findOneAndUpdate(
              { _id: shopProductId },
              {
                $set: {
                  ...values,
                  updatedAt: new Date(),
                },
                $push: {
                  oldPrices: {
                    price: shopProduct.price,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                  },
                },
              },
              {
                returnOriginal: false,
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
  },
});
