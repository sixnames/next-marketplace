import { objectType } from 'nexus';
import { COL_PRODUCT_FACETS, COL_SHOP_PRODUCTS, COL_SHOPS } from '../db/collectionNames';
import { ProductFacetModel, ShopModel, ShopProductModel } from '../db/dbModels';
import { getDatabase } from '../db/mongodb';
import { noNaN } from '../lib/numbers';

export const OrderProduct = objectType({
  name: 'OrderProduct',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.int('itemId');
    t.nonNull.int('price');
    t.nonNull.int('amount');
    t.nonNull.string('slug');
    t.nonNull.string('originalName');
    t.json('nameI18n');
    t.nonNull.objectId('productId');
    t.nonNull.objectId('shopProductId');
    t.nonNull.objectId('shopId');
    t.nonNull.objectId('companyId');

    // OrderProduct product field resolver
    t.field('product', {
      type: 'Product',
      resolve: async (source): Promise<ProductFacetModel | null> => {
        const { db } = await getDatabase();
        const productsCollection = db.collection<ProductFacetModel>(COL_PRODUCT_FACETS);
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
        return `${source.price}`;
      },
    });

    // OrderProduct formattedTotalPrice field resolver
    t.nonNull.field('formattedTotalPrice', {
      type: 'String',
      resolve: async (source, _args): Promise<string> => {
        const { price, amount } = source;
        const totalPrice = noNaN(price) * noNaN(amount);
        return `${totalPrice}`;
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
