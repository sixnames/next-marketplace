import { objectType } from 'nexus';
import { ProductModel, ShopProductModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { COL_PRODUCTS, COL_SHOP_PRODUCTS } from 'db/collectionNames';
import { noNaN } from 'lib/numbers';
import { getCurrencyString } from 'lib/i18n';
import { getRequestParams } from 'lib/sessionHelpers';

export const CartProduct = objectType({
  name: 'CartProduct',
  definition(t) {
    t.implements('Base');
    t.nonNull.int('amount');
    t.objectId('shopProductId');
    t.objectId('productId');

    // CartProduct shopProduct field resolver
    t.field('shopProduct', {
      type: 'ShopProduct',
      resolve: async (source): Promise<ShopProductModel | null> => {
        if (!source.shopProductId) {
          return null;
        }
        const db = await getDatabase();
        const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
        const shopProduct = await shopProductsCollection.findOne({ _id: source.shopProductId });
        return shopProduct;
      },
    });

    // CartProduct product field resolver
    t.field('product', {
      type: 'Product',
      resolve: async (source): Promise<ProductModel | null> => {
        if (!source.productId) {
          return null;
        }
        const db = await getDatabase();
        const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
        const product = await productsCollection.findOne({ _id: source.productId });
        return product;
      },
    });

    // CartProduct isShopless field resolver
    t.nonNull.field('isShopless', {
      type: 'Boolean',
      resolve: async (source): Promise<boolean> => {
        return !source.shopProductId;
      },
    });

    // CartProduct formattedTotalPrice field resolver
    t.nonNull.field('formattedTotalPrice', {
      type: 'String',
      resolve: async (source, _args, context): Promise<string> => {
        const { locale } = await getRequestParams(context);
        const fallbackPrice = '0';
        if (!source.shopProductId) {
          return fallbackPrice;
        }
        const db = await getDatabase();
        const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
        const shopProduct = await shopProductsCollection.findOne({ _id: source.shopProductId });
        if (!shopProduct) {
          return fallbackPrice;
        }
        const totalPrice = noNaN(shopProduct.price) * noNaN(source.amount);
        return getCurrencyString({
          value: totalPrice,
          locale,
        });
      },
    });

    // CartProduct totalPrice field resolver
    t.nonNull.field('totalPrice', {
      type: 'Int',
      resolve: async (source): Promise<number> => {
        const fallbackPrice = 0;
        if (!source.shopProductId) {
          return fallbackPrice;
        }
        const db = await getDatabase();
        const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
        const shopProduct = await shopProductsCollection.findOne({ _id: source.shopProductId });
        if (!shopProduct) {
          return fallbackPrice;
        }
        return noNaN(shopProduct.price) * noNaN(source.amount);
      },
    });
  },
});
