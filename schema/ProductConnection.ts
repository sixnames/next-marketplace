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
  },
});
