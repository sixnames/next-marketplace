import { objectType } from 'nexus';
import { getRequestParams } from 'lib/sessionHelpers';
import {
  AttributeModel,
  BrandCollectionModel,
  BrandModel,
  ManufacturerModel,
  ProductAssetsModel,
  ProductAttributeModel,
  ProductConnectionModel,
  RubricModel,
  ShopProductModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import {
  COL_ATTRIBUTES,
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

export const ProductCardBreadcrumb = objectType({
  name: 'ProductCardBreadcrumb',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.string('name');
    t.nonNull.string('href');
  },
});

export const ProductAttributesGroupAst = objectType({
  name: 'ProductAttributesGroupAst',
  definition(t) {
    t.implements('Base');
    t.nonNull.json('nameI18n');
    t.nonNull.list.nonNull.objectId('attributesIds');
    t.nonNull.list.nonNull.field('astAttributes', {
      type: 'ProductAttribute',
    });

    // AttributesGroup name translation field resolver
    t.nonNull.field('name', {
      type: 'String',
      resolve: async (source, _args, context) => {
        const { getI18nLocale } = await getRequestParams(context);
        return getI18nLocale(source.nameI18n);
      },
    });

    // AttributesGroup attributes list field resolver
    t.nonNull.list.nonNull.field('attributes', {
      type: 'Attribute',
      resolve: async (source): Promise<AttributeModel[]> => {
        const db = await getDatabase();
        const attributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);
        const attributes = await attributesCollection
          .find({ _id: { $in: source.attributesIds } })
          .toArray();
        return attributes;
      },
    });
  },
});

export const ProductAssets = objectType({
  name: 'ProductAssets',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.objectId('productId');
    t.nonNull.objectId('productSlug');
    t.nonNull.list.nonNull.field('asset', {
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
    t.string('brandSlug');
    t.string('brandCollectionSlug');
    t.string('manufacturerSlug');
    t.nonNull.json('nameI18n');
    t.nonNull.json('descriptionI18n');
    t.nonNull.objectId('rubricId');
    t.boolean('available');
    t.nonNull.field('mainImage');
    t.field('assets', {
      type: 'ProductAssets',
      resolve: async (source): Promise<ProductAssetsModel | null> => {
        const db = await getDatabase();
        const productAssetsCollection = db.collection<ProductAssetsModel>(COL_PRODUCT_ASSETS);
        const assets = await productAssetsCollection.findOne({ productId: source._id });
        return assets;
      },
    });
    t.nonNull.list.nonNull.field('attributes', {
      type: 'ProductAttribute',
      resolve: async (source): Promise<ProductAttributeModel[]> => {
        const db = await getDatabase();
        const productAttributesCollection = db.collection<ProductAttributeModel>(
          COL_PRODUCT_ATTRIBUTES,
        );
        const attributes = await productAttributesCollection
          .find({ productId: source._id })
          .toArray();
        return attributes;
      },
    });
    t.nonNull.list.nonNull.field('connections', {
      type: 'ProductConnection',
      resolve: async (source): Promise<ProductConnectionModel[]> => {
        const db = await getDatabase();
        const productConnectionsCollection = db.collection<ProductConnectionModel>(
          COL_PRODUCT_CONNECTIONS,
        );
        const connections = await productConnectionsCollection
          .find({
            'connectionProducts.productId': source._id,
          })
          .toArray();
        return connections;
      },
    });

    // Product name translation field resolver
    t.nonNull.field('name', {
      type: 'String',
      resolve: async (source, _args, context) => {
        const { getI18nLocale } = await getRequestParams(context);
        return getI18nLocale(source.nameI18n);
      },
    });

    // Product description translation field resolver
    t.nonNull.field('description', {
      type: 'String',
      resolve: async (source, _args, context) => {
        const { getI18nLocale } = await getRequestParams(context);
        return getI18nLocale(source.descriptionI18n);
      },
    });

    // Product rubrics list resolver
    t.nonNull.field('rubric', {
      type: 'Rubric',
      resolve: async (source): Promise<RubricModel> => {
        const db = await getDatabase();
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
        const db = await getDatabase();
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
        const db = await getDatabase();
        const brandCollectionsCollection = db.collection<BrandCollectionModel>(
          COL_BRAND_COLLECTIONS,
        );
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
        const db = await getDatabase();
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
        const db = await getDatabase();
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
