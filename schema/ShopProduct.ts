import { arg, extendType, inputObjectType, list, nonNull, objectType } from 'nexus';
import { getDatabase } from 'db/mongodb';
import { COL_PRODUCTS, COL_SHOP_PRODUCTS, COL_SHOPS } from 'db/collectionNames';
import { ProductModel, ShopModel, ShopProductModel, ShopProductPayloadModel } from 'db/dbModels';
import { getCurrencyString } from 'lib/i18n';
import { getRequestParams, getResolverValidationSchema, getSessionCart } from 'lib/sessionHelpers';
import { getPercentage } from 'lib/numbers';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { updateProductShopsData } from 'lib/productShopsUtils';
import { updateShopProductSchema } from 'validation/shopSchema';

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

    // ShopProduct formattedPrice field resolver
    t.nonNull.field('formattedPrice', {
      type: 'String',
      resolve: async (source, _args, context): Promise<string> => {
        const { locale } = await getRequestParams(context);
        return getCurrencyString({ value: source.price, locale });
      },
    });

    // ShopProduct formattedOldPrice field resolver
    t.field('formattedOldPrice', {
      type: 'String',
      resolve: async (source, _args, context): Promise<string | null> => {
        const { locale } = await getRequestParams(context);
        const lastOldPrice = source.oldPrices[source.oldPrices.length - 1];
        return lastOldPrice ? getCurrencyString({ value: lastOldPrice.price, locale }) : null;
      },
    });

    // ShopProduct discountedPercent field resolver
    t.field('discountedPercent', {
      type: 'Int',
      resolve: async (source): Promise<number | null> => {
        const lastOldPrice = source.oldPrices[source.oldPrices.length - 1];
        return lastOldPrice && lastOldPrice.price > source.price
          ? getPercentage({
              fullValue: lastOldPrice.price,
              partialValue: source.price,
            })
          : null;
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
          const { shopProductId, productId, ...values } = input;

          // Check shop product availability
          const shopProduct = await shopProductsCollection.findOne({ _id: shopProductId });
          if (!shopProduct) {
            return {
              success: false,
              message: await getApiMessage('shopProducts.update.notFound'),
            };
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
            return {
              success: false,
              message: await getApiMessage('shopProducts.update.error'),
            };
          }

          // Update product shops data
          await updateProductShopsData({ productId });

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
          // Validate
          const validationSchema = await getResolverValidationSchema({
            context,
            schema: updateShopProductSchema,
          });

          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
          const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
          const { input } = args;

          let doneCount = 0;
          for await (const shopProductValues of input) {
            await validationSchema.validate(shopProductValues);
            const { shopProductId, productId, ...values } = shopProductValues;

            // Check shop product availability
            const shopProduct = await shopProductsCollection.findOne({ _id: shopProductId });
            if (!shopProduct) {
              return {
                success: false,
                message: await getApiMessage('shopProducts.update.notFound'),
              };
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

            // Update product shops data
            await updateProductShopsData({ productId });
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
