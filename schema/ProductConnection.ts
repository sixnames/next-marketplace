import { getRequestParams } from 'lib/sessionHelpers';
import { objectType } from 'nexus';
import { ProductModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { COL_PRODUCTS } from 'db/collectionNames';

export const ProductConnectionItem = objectType({
  name: 'ProductConnectionItem',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.objectId('productId');
    t.nonNull.field('product', {
      type: 'Product',
      resolve: async (source): Promise<ProductModel> => {
        const db = await getDatabase();
        const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
        const product = await productsCollection.findOne({ _id: source.productId });
        if (!product) {
          throw Error('Product not found in ProductConnectionItem');
        }
        return product;
      },
    });
  },
});

export const ProductConnection = objectType({
  name: 'ProductConnection',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.objectId('attributeId');
    t.nonNull.string('attributeSlug');
    t.json('attributeNameI18n');
    t.nonNull.field('attributeViewVariant', {
      type: 'AttributeViewVariant',
    });
    t.nonNull.field('attributeVariant', {
      type: 'AttributeVariant',
    });
    t.nonNull.list.nonNull.field('connectionProducts', {
      type: 'ProductConnectionItem',
    });

    // ProductConnection name translation field resolver
    t.nonNull.field('attributeName', {
      type: 'String',
      resolve: async (source, _args, context) => {
        const { getI18nLocale } = await getRequestParams(context);
        return getI18nLocale(source.attributeNameI18n);
      },
    });
  },
});
