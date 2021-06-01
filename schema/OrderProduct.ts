import { objectType } from 'nexus';
import { getRequestParams } from 'lib/sessionHelpers';
import { ProductModel, ShopModel, ShopProductModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { COL_PRODUCTS, COL_SHOP_PRODUCTS, COL_SHOPS } from 'db/collectionNames';
import { getCurrencyString } from 'lib/i18n';
import { noNaN } from 'lib/numbers';

export const OrderProduct = objectType({
  name: 'OrderProduct',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.int('itemId');
    t.nonNull.int('price');
    t.nonNull.int('amount');
    t.nonNull.string('slug');
    t.nonNull.string('originalName');
    t.nonNull.json('nameI18n');
    t.nonNull.objectId('productId');
    t.nonNull.objectId('shopProductId');
    t.nonNull.objectId('shopId');
    t.nonNull.objectId('companyId');

    // OrderProduct name translation field resolver
    t.nonNull.field('name', {
      type: 'String',
      resolve: async (source, _args, context) => {
        const { getI18nLocale } = await getRequestParams(context);
        return getI18nLocale(source.nameI18n);
      },
    });

    // OrderProduct product field resolver
    t.field('product', {
      type: 'Product',
      resolve: async (source): Promise<ProductModel | null> => {
        const { db } = await getDatabase();
        const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
        const product = await productsCollection.findOne({ _id: source.productId });
        return product;
      },
    });

    // OrderProduct shopProduct field resolver
    t.field('shopProduct', {
      type: 'ShopProduct',
      resolve: async (source): Promise<ShopProductModel | null> => {
        const { db } = await getDatabase();
        const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
        const shopProduct = await shopProductsCollection.findOne({ _id: source.shopProductId });
        return shopProduct;
      },
    });

    // OrderProduct shop field resolver
    t.field('shop', {
      type: 'Shop',
      resolve: async (source): Promise<ShopModel | null> => {
        const { db } = await getDatabase();
        const shopsCollection = db.collection<ShopModel>(COL_SHOPS);
        const shop = await shopsCollection.findOne({ _id: source.shopId });
        return shop;
      },
    });

    // OrderProduct formattedPrice field resolver
    t.nonNull.field('formattedPrice', {
      type: 'String',
      resolve: async (source, _args): Promise<string> => {
        return getCurrencyString(source.price);
      },
    });

    // OrderProduct formattedTotalPrice field resolver
    t.nonNull.field('formattedTotalPrice', {
      type: 'String',
      resolve: async (source, _args): Promise<string> => {
        const { price, amount } = source;
        const totalPrice = noNaN(price) * noNaN(amount);
        return getCurrencyString(totalPrice);
      },
    });

    // OrderProduct totalPrice field resolver
    t.nonNull.field('totalPrice', {
      type: 'Int',
      resolve: async (source, _args): Promise<number> => {
        const { price, amount } = source;
        const totalPrice = noNaN(price) * noNaN(amount);
        return totalPrice;
      },
    });
  },
});
