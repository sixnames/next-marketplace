import { getFieldStringLocale } from 'lib/i18n';
import { noNaN } from 'lib/numbers';
import { getTreeFromList } from 'lib/optionsUtils';
import { generateSnippetTitle } from 'lib/titleUtils';
import { ObjectId } from 'mongodb';
import { objectType } from 'nexus';
import { getRequestParams } from 'lib/sessionHelpers';
import {
  BrandCollectionModel,
  BrandModel,
  ManufacturerModel,
  ProductAssetsModel,
  ProductAttributeModel,
  ProductCardPricesModel,
  ProductConnectionModel,
  RubricModel,
  ShopProductModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import {
  COL_BRAND_COLLECTIONS,
  COL_BRANDS,
  COL_MANUFACTURERS,
  COL_PRODUCT_ASSETS,
  COL_PRODUCT_ATTRIBUTES,
  COL_PRODUCT_CONNECTIONS,
  COL_RUBRICS,
  COL_SHOP_PRODUCTS,
} from 'db/collectionNames';

export const ProductCardPrices = objectType({
  name: 'ProductCardPrices',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.string('min');
    t.nonNull.string('max');
  },
});

export const ProductAssets = objectType({
  name: 'ProductAssets',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.objectId('productId');
    t.nonNull.objectId('productSlug');
    t.nonNull.list.nonNull.field('assets', {
      type: 'Asset',
    });
  },
});

export const Product = objectType({
  name: 'Product',
  definition(t) {
    t.implements('Base');
    t.implements('Timestamp');
    t.nonNull.boolean('active');
    t.nonNull.string('slug');
    t.nonNull.string('originalName');
    t.string('barcode');
    t.string('brandSlug');
    t.string('brandCollectionSlug');
    t.string('manufacturerSlug');
    t.string('supplierSlug');
    t.json('nameI18n');
    t.json('descriptionI18n');
    t.nonNull.objectId('rubricId');
    t.nonNull.string('rubricSlug');
    t.boolean('available');
    t.nonNull.string('mainImage');
    t.nonNull.field('snippetTitle', {
      type: 'String',
      resolve: async (source, _args, context): Promise<string> => {
        const { locale } = await getRequestParams(context);
        const snippetTitle = generateSnippetTitle({
          locale,
          rubricName: getFieldStringLocale(source.rubric?.nameI18n, locale),
          showRubricNameInProductTitle: source.rubric?.showRubricNameInProductTitle,
          showCategoryInProductTitle: source.rubric?.showCategoryInProductTitle,
          attributes: source.attributes || [],
          nameI18n: source.nameI18n,
          originalName: source.originalName,
          defaultGender: source.gender,
          titleCategoriesSlugs: source.titleCategoriesSlugs,
          categories: getTreeFromList({
            list: source.categories,
            childrenFieldName: 'categories',
            locale: locale,
          }),
        });

        return snippetTitle;
      },
    });
    t.field('assets', {
      type: 'ProductAssets',
      resolve: async (source): Promise<ProductAssetsModel | null> => {
        const { db } = await getDatabase();
        const productAssetsCollection = db.collection<ProductAssetsModel>(COL_PRODUCT_ASSETS);
        const assets = await productAssetsCollection.findOne({ productId: source._id });
        return assets;
      },
    });
    t.nonNull.list.nonNull.field('attributes', {
      type: 'ProductAttribute',
      resolve: async (source): Promise<ProductAttributeModel[]> => {
        const { db } = await getDatabase();
        const productAttributesCollection =
          db.collection<ProductAttributeModel>(COL_PRODUCT_ATTRIBUTES);
        const attributes = await productAttributesCollection
          .find({ productId: source._id })
          .toArray();
        return attributes;
      },
    });
    t.nonNull.list.nonNull.field('connections', {
      type: 'ProductConnection',
      resolve: async (source): Promise<ProductConnectionModel[]> => {
        const { db } = await getDatabase();
        const productConnectionsCollection =
          db.collection<ProductConnectionModel>(COL_PRODUCT_CONNECTIONS);
        const connections = await productConnectionsCollection
          .find({
            'connectionProducts.productId': source._id,
          })
          .toArray();
        return connections;
      },
    });

    // Product description translation field resolver
    t.field('description', {
      type: 'String',
      resolve: async (source, _args, context) => {
        const { getI18nLocale } = await getRequestParams(context);
        return source.descriptionI18n ? getI18nLocale(source.descriptionI18n) : null;
      },
    });

    // Product cardPrices field resolver
    t.nonNull.field('cardPrices', {
      type: 'ProductCardPrices',
      resolve: async (source): Promise<ProductCardPricesModel> => {
        try {
          if (source.cardPrices) {
            return {
              _id: new ObjectId(),
              min: `${noNaN(source.cardPrices.min)}`,
              max: `${noNaN(source.cardPrices.max)}`,
            };
          }

          return {
            _id: new ObjectId(),
            min: '0',
            max: '0',
          };
        } catch (e) {
          return {
            _id: new ObjectId(),
            min: '0',
            max: '0',
          };
        }
      },
    });

    // Product shopsCount field resolver
    t.nonNull.field('shopsCount', {
      type: 'Int',
      resolve: async (source): Promise<number> => {
        try {
          if (source.shopsCount) {
            return source.shopsCount;
          }
          return 0;
        } catch (e) {
          return 0;
        }
      },
    });

    // Product rubrics list resolver
    t.nonNull.field('rubric', {
      type: 'Rubric',
      resolve: async (source): Promise<RubricModel> => {
        const { db } = await getDatabase();
        const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
        const rubric = await rubricsCollection.findOne({ _id: source.rubricId });
        if (!rubric) {
          throw Error('Product rubric not found');
        }
        return rubric;
      },
    });

    // Product brand field resolver
    t.field('brand', {
      type: 'Brand',
      resolve: async (source): Promise<BrandModel | null> => {
        if (!source.brandSlug) {
          return null;
        }
        const { db } = await getDatabase();
        const brandsCollection = db.collection<BrandModel>(COL_BRANDS);
        const brand = await brandsCollection.findOne({ slug: source.brandSlug });
        return brand;
      },
    });

    // Product brandCollection field resolver
    t.field('brandCollection', {
      type: 'BrandCollection',
      resolve: async (source): Promise<BrandCollectionModel | null> => {
        if (!source.brandCollectionSlug) {
          return null;
        }
        const { db } = await getDatabase();
        const brandCollectionsCollection =
          db.collection<BrandCollectionModel>(COL_BRAND_COLLECTIONS);
        const brandCollection = await brandCollectionsCollection.findOne({
          slug: source.brandCollectionSlug,
        });
        return brandCollection;
      },
    });

    // Product brand field resolver
    t.field('manufacturer', {
      type: 'Manufacturer',
      resolve: async (source): Promise<ManufacturerModel | null> => {
        if (!source.manufacturerSlug) {
          return null;
        }
        const { db } = await getDatabase();
        const manufacturersCollection = db.collection<ManufacturerModel>(COL_MANUFACTURERS);
        const manufacturer = await manufacturersCollection.findOne({
          slug: source.manufacturerSlug,
        });
        return manufacturer;
      },
    });

    // Product allShopProducts field resolver
    t.nonNull.list.nonNull.field('shopProducts', {
      type: 'ShopProduct',
      description: 'Returns all shop products that product connected to',
      resolve: async (source, _args): Promise<ShopProductModel[]> => {
        const { db } = await getDatabase();
        const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
        const shopsProducts = await shopProductsCollection
          .find({
            productId: source._id,
          })
          .toArray();
        return shopsProducts;
      },
    });
  },
});
