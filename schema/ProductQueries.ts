import { arg, extendType, inputObjectType, nonNull, objectType, stringArg } from 'nexus';
import {
  DEFAULT_PAGE,
  PAGINATION_DEFAULT_LIMIT,
  SHOP_PRODUCTS_DEFAULT_SORT_BY_KEY,
  SORT_BY_ID,
  SORT_DESC,
} from 'config/common';
import { ProductModel, ProductsPaginationPayloadModel, ShopProductModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { COL_PRODUCTS, COL_SHOP_PRODUCTS } from 'db/collectionNames';
import { getRequestParams } from 'lib/sessionHelpers';
import { productsPaginationQuery } from 'lib/productsPaginationQuery';

export const ProductsPaginationPayload = objectType({
  name: 'ProductsPaginationPayload',
  definition(t) {
    t.nonNull.string('sortBy');
    t.nonNull.field('sortDir', {
      type: 'SortDirection',
    });
    t.nonNull.int('totalDocs');
    t.nonNull.int('totalActiveDocs');
    t.nonNull.int('page');
    t.nonNull.int('limit');
    t.nonNull.int('totalPages');
    t.nonNull.boolean('hasPrevPage');
    t.nonNull.boolean('hasNextPage');
    t.nonNull.list.nonNull.field('docs', {
      type: 'Product',
    });
  },
});

export const ProductsPaginationInput = inputObjectType({
  name: 'ProductsPaginationInput',
  definition(t) {
    t.string('search');
    t.int('minPrice');
    t.int('maxPrice');
    t.string('sortBy', {
      default: SORT_BY_ID,
    });
    t.field('sortDir', {
      type: 'SortDirection',
      default: SORT_DESC,
    });
    t.int('page', {
      default: DEFAULT_PAGE,
    });
    t.int('limit', {
      default: PAGINATION_DEFAULT_LIMIT,
    });
    t.objectId('rubricId', {
      description: 'Filter by current rubrics',
    });
    t.list.nonNull.objectId('attributesIds', {
      description: 'Filter by current attributes',
    });
    t.list.nonNull.string('excludedOptionsSlugs', {
      description: 'Filter by excluded selected options slugs',
    });
    t.list.nonNull.objectId('excludedRubricsIds', {
      description: 'Exclude products in current rubrics',
    });
    t.list.nonNull.objectId('excludedProductsIds', {
      description: 'Exclude current products',
    });
    t.boolean('isWithoutRubrics', {
      description: 'Returns products not added to any rubric.',
    });
  },
});

export const GetProductShopsInput = inputObjectType({
  name: 'GetProductShopsInput',
  definition(t) {
    t.nonNull.objectId('productId');
    t.string('sortBy', {
      default: SHOP_PRODUCTS_DEFAULT_SORT_BY_KEY,
    });
    t.field('sortDir', {
      type: 'SortDirection',
      default: SORT_DESC,
    });
  },
});

export const ProductAttributesASTInput = inputObjectType({
  name: 'ProductAttributesASTInput',
  definition(t) {
    t.objectId('productId');
    t.nonNull.objectId('rubricId');
  },
});

// Product Queries
export const ProductQueries = extendType({
  type: 'Query',
  definition(t) {
    // Should return product by given id
    t.field('getProduct', {
      type: 'Product',
      description: 'Should return product by given id',
      args: {
        _id: nonNull(
          arg({
            type: 'ObjectId',
          }),
        ),
      },
      resolve: async (_root, args): Promise<ProductModel | null> => {
        const { db } = await getDatabase();
        const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
        const product = await productsCollection.findOne({ _id: args._id });
        return product;
      },
    });

    // Should return product by given slug
    t.field('getProductBySlug', {
      type: 'Product',
      description: 'Should return product by given slug',
      args: {
        slug: nonNull(stringArg()),
      },
      resolve: async (_root, args): Promise<ProductModel | null> => {
        const { db } = await getDatabase();
        const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
        const product = await productsCollection.findOne({ slug: args.slug });
        return product;
      },
    });

    // Should return shops products list for product card
    t.nonNull.list.nonNull.field('getProductShops', {
      type: 'ShopProduct',
      description: 'Should return shops products list for product card',
      args: {
        input: nonNull(
          arg({
            type: 'GetProductShopsInput',
          }),
        ),
      },
      resolve: async (_root, args): Promise<ShopProductModel[]> => {
        try {
          const { db } = await getDatabase();
          const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
          const { input } = args;
          const { productId, sortDir, sortBy } = input;
          const realSortBy = sortBy || SHOP_PRODUCTS_DEFAULT_SORT_BY_KEY;

          const shopProducts = await shopProductsCollection
            .find(
              { productId },
              {
                sort: {
                  [realSortBy]: sortDir,
                },
              },
            )
            .toArray();
          return shopProducts;
        } catch (e) {
          console.log(e);
          return [];
        }
      },
    });

    // Should return paginated products
    t.nonNull.field('getProductsList', {
      type: 'ProductsPaginationPayload',
      description: 'Should paginated products',
      args: {
        input: arg({
          type: 'ProductsPaginationInput',
        }),
      },
      resolve: async (_root, args, context): Promise<ProductsPaginationPayloadModel> => {
        const { city } = await getRequestParams(context);
        const paginationResult = await productsPaginationQuery({
          input: args.input,
          city,
        });
        return paginationResult;
      },
    });
  },
});
