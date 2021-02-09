import { arg, extendType, inputObjectType, list, nonNull, objectType, stringArg } from 'nexus';
import {
  PAGE_DEFAULT,
  PAGINATION_DEFAULT_LIMIT,
  SHOP_PRODUCTS_DEFAULT_SORT_BY_KEY,
  SORT_BY_CREATED_AT,
  SORT_DESC,
} from 'config/common';
import {
  ProductAttributeModel,
  ProductModel,
  ProductsPaginationPayloadModel,
  RubricAttributeModel,
  RubricModel,
  ShopProductModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { COL_PRODUCTS, COL_RUBRICS, COL_SHOP_PRODUCTS } from 'db/collectionNames';
import { getRequestParams, getSessionRole } from 'lib/sessionHelpers';
import { updateModelViews } from 'lib/countersUtils';
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
    t.nonNull.int('maxPrice');
    t.nonNull.int('minPrice');
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
      default: SORT_BY_CREATED_AT,
    });
    t.field('sortDir', {
      type: 'SortDirection',
      default: SORT_DESC,
    });
    t.int('page', {
      default: PAGE_DEFAULT,
    });
    t.int('limit', {
      default: PAGINATION_DEFAULT_LIMIT,
    });
    t.list.nonNull.objectId('rubricsIds', {
      description: 'Filter by current rubrics',
    });
    t.list.nonNull.objectId('attributesIds', {
      description: 'Filter by current attributes',
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
    t.nonNull.list.nonNull.objectId('rubricsIds');
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
        const db = await getDatabase();
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
        const db = await getDatabase();
        const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
        const product = await productsCollection.findOne({ slug: args.slug });
        return product;
      },
    });

    // Should return product for card page and increase view counter
    t.nonNull.field('getProductCard', {
      type: 'Product',
      description: 'Should return product for card page and increase view counter',
      args: {
        slug: nonNull(list(nonNull(stringArg()))),
      },
      resolve: async (_root, args, context): Promise<ProductModel> => {
        const { city } = await getRequestParams(context);
        const sessionRole = await getSessionRole(context);
        const db = await getDatabase();
        const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
        const productSlug = args.slug[args.slug.length - 1];
        const product = await productsCollection.findOne({ slug: productSlug });
        if (!product) {
          throw new Error('Product not found');
        }

        // Increase product views counter
        if (!sessionRole.isStuff) {
          await updateModelViews({
            city,
            queryFilter: { _id: product._id },
            collectionName: COL_PRODUCTS,
          });
        }

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
          const db = await getDatabase();
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

    // Should return product attributes AST for selected rubrics
    t.nonNull.list.nonNull.field('getProductAttributesAST', {
      type: 'ProductAttribute',
      description: 'Should return product attributes AST for selected rubrics',
      args: {
        input: nonNull(
          arg({
            type: 'ProductAttributesASTInput',
          }),
        ),
      },
      resolve: async (_root, args): Promise<ProductAttributeModel[]> => {
        try {
          const db = await getDatabase();
          const { input } = args;
          const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
          const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
          const { rubricsIds, productId } = input;

          // Get all attributes groups ids
          const rubrics = await rubricsCollection
            .find({ _id: { $in: rubricsIds } }, { projection: { attributesGroups: 1 } })
            .toArray();

          // Get all attributes groups
          const attributes = rubrics.reduce((acc: RubricAttributeModel[], rubric) => {
            rubric.attributes.forEach((rubricAttribute) => {
              const exist = acc.some(({ _id }) => rubricAttribute._id.equals(_id));
              if (exist) {
                return;
              }
              acc.push(rubricAttribute);
            });
            return acc;
          }, []);

          // Get product
          let product: ProductModel | null = null;
          if (productId) {
            product = await productsCollection.findOne({ _id: productId });
          }

          // Get all attributes and cast it to ast
          const attributesAST: ProductAttributeModel[] = [];
          for await (const attribute of attributes) {
            const productAttribute = product?.attributes.find(({ attributeId }) => {
              return attributeId.equals(attribute._id);
            });

            attributesAST.push({
              attributeId: attribute._id,
              attributeSlug: attribute.slug,
              selectedOptionsSlugs: productAttribute?.selectedOptionsSlugs || [],
              attributeSlugs: productAttribute?.attributeSlugs || [],
              number: productAttribute?.number || null,
              textI18n: productAttribute?.textI18n || {},
              showAsBreadcrumb: productAttribute?.showAsBreadcrumb || false,
              showInCard: productAttribute?.showInCard || true,
            });
          }

          return attributesAST;
        } catch (e) {
          console.log(e);
          return [];
        }
      },
    });
  },
});
