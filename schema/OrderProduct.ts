import { objectType } from 'nexus';
import { getRequestParams } from 'lib/sessionHelpers';
import { CompanyModel, ProductModel, ShopModel, ShopProductModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { COL_COMPANIES, COL_PRODUCTS, COL_SHOP_PRODUCTS, COL_SHOPS } from 'db/collectionNames';
import { getCurrencyString } from 'lib/i18n';
import { getPercentage, noNaN } from 'lib/numbers';

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
    t.nonNull.json('descriptionI18n');
    t.nonNull.objectId('productId');
    t.nonNull.objectId('shopProductId');
    t.nonNull.objectId('shopId');
    t.nonNull.objectId('companyId');
    t.nonNull.list.nonNull.field('oldPrices', {
      type: 'ShopProductOldPrice',
    });

    // OrderProduct name translation field resolver
    t.nonNull.field('name', {
      type: 'String',
      resolve: async (source, _args, context) => {
        const { getI18nLocale } = await getRequestParams(context);
        return getI18nLocale(source.nameI18n);
      },
    });

    // OrderProduct description translation field resolver
    t.nonNull.field('description', {
      type: 'String',
      resolve: async (source, _args, context) => {
        const { getI18nLocale } = await getRequestParams(context);
        return getI18nLocale(source.descriptionI18n);
      },
    });

    // OrderProduct product field resolver
    t.field('product', {
      type: 'Product',
      resolve: async (source): Promise<ProductModel | null> => {
        const db = await getDatabase();
        const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
        const product = await productsCollection.findOne({ _id: source.productId });
        return product;
      },
    });

    // OrderProduct shopProduct field resolver
    t.field('shopProduct', {
      type: 'ShopProduct',
      resolve: async (source): Promise<ShopProductModel | null> => {
        const db = await getDatabase();
        const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
        const shopProduct = await shopProductsCollection.findOne({ _id: source.shopProductId });
        return shopProduct;
      },
    });

    // OrderProduct shop field resolver
    t.field('shop', {
      type: 'Shop',
      resolve: async (source): Promise<ShopModel | null> => {
        const db = await getDatabase();
        const shopsCollection = db.collection<ShopModel>(COL_SHOPS);
        const shop = await shopsCollection.findOne({ _id: source.shopId });
        return shop;
      },
    });

    // OrderProduct company field resolver
    t.field('company', {
      type: 'Company',
      resolve: async (source): Promise<CompanyModel | null> => {
        const db = await getDatabase();
        const companiesCollection = db.collection<CompanyModel>(COL_COMPANIES);
        const company = await companiesCollection.findOne({ _id: source.shopId });
        return company;
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

    // OrderProduct formattedOldPrice field resolver
    t.field('formattedOldPrice', {
      type: 'String',
      resolve: async (source, _args): Promise<string | null> => {
        const lastOldPrice = source.oldPrices[source.oldPrices.length - 1];
        return lastOldPrice ? getCurrencyString(lastOldPrice.price) : null;
      },
    });

    // OrderProduct discountedPercent field resolver
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
  },
});
