import { ObjectId } from 'mongodb';
import { objectType } from 'nexus';
import { AttributeModel, ProductConnectionItemModel, ProductModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { COL_ATTRIBUTES, COL_PRODUCTS } from 'db/collectionNames';

export const ProductConnectionItem = objectType({
  name: 'ProductConnectionItem',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.field('value', {
      type: 'String',
      description: 'Value of selected option for current product in connection',
    });
    t.nonNull.field('product', {
      type: 'Product',
    });
  },
});

export const ProductConnection = objectType({
  name: 'ProductConnection',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.objectId('attributeId');
    t.nonNull.list.nonNull.objectId('productsIds');

    // ProductConnection attribute field resolver
    t.nonNull.field('attribute', {
      type: 'Attribute',
      resolve: async (source): Promise<AttributeModel> => {
        const db = await getDatabase();
        const attributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);
        const attribute = await attributesCollection.findOne({ _id: source.attributeId });
        if (!attribute) {
          throw Error('Attribute not found in ProductConnection');
        }
        return attribute;
      },
    });

    // ProductConnection connectionProducts field resolver
    t.nonNull.list.nonNull.field('connectionProducts', {
      type: 'ProductConnectionItem',
      resolve: async (source): Promise<ProductConnectionItemModel[]> => {
        try {
          const db = await getDatabase();
          const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);

          const products = await productsCollection
            .find({ _id: { $in: source.productsIds } })
            .toArray();

          const connectionProducts = products.reduce(
            (acc: ProductConnectionItemModel[], connectionProduct) => {
              const productAttribute = connectionProduct.attributes.find(({ attributeId }) => {
                return attributeId.equals(source.attributeId);
              });

              if (!productAttribute) {
                return acc;
              }

              const productConnectionValue = productAttribute.selectedOptionsSlugs[0];
              if (!productConnectionValue) {
                return acc;
              }

              return [
                ...acc,
                {
                  _id: new ObjectId(),
                  value: productConnectionValue,
                  product: connectionProduct,
                },
              ];
            },
            [],
          );

          return connectionProducts;
        } catch (e) {
          console.log(e);
          return [];
        }
      },
    });

    // ProductConnection products list resolver
    t.nonNull.list.nonNull.field('products', {
      type: 'Product',
      resolve: async (source): Promise<ProductModel[]> => {
        const db = await getDatabase();
        const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
        const products = await productsCollection
          .find({ _id: { $in: source.productsIds } })
          .toArray();
        return products;
      },
    });
  },
});

export const ProductCardConnectionItem = objectType({
  name: 'ProductCardConnectionItem',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.boolean('isCurrent');
    t.nonNull.field('value', {
      type: 'String',
      description: 'Value of selected option for current product in connection',
    });
    t.nonNull.field('product', {
      type: 'Product',
    });
  },
});

export const ProductCardConnection = objectType({
  name: 'ProductCardConnection',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.objectId('attributeId');
    t.nonNull.list.nonNull.field('productsIds', { type: 'ObjectId' });
    t.nonNull.field('name', {
      type: 'String',
      description: 'Name of attribute used for connection',
    });
    t.nonNull.list.nonNull.field('connectionProducts', {
      type: 'ProductCardConnectionItem',
    });
  },
});
