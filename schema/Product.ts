import {
  ATTRIBUTE_VIEW_VARIANT_ICON,
  ATTRIBUTE_VIEW_VARIANT_LIST,
  ATTRIBUTE_VIEW_VARIANT_OUTER_RATING,
  ATTRIBUTE_VIEW_VARIANT_TAG,
  ATTRIBUTE_VIEW_VARIANT_TEXT,
} from 'config/common';
import { getCurrencyString } from 'lib/i18n';
import { getProductCurrentViewAttributes } from 'lib/productAttributesUtils';
import { ObjectId } from 'mongodb';
import { objectType } from 'nexus';
import { getRequestParams } from 'lib/sessionHelpers';
import {
  AttributeModel,
  BrandCollectionModel,
  BrandModel,
  ManufacturerModel,
  ProductAttributeModel,
  ProductCardPricesModel,
  ProductFacetModel,
  RubricModel,
  ShopProductModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import {
  COL_ATTRIBUTES,
  COL_BRAND_COLLECTIONS,
  COL_BRANDS,
  COL_MANUFACTURERS,
  COL_PRODUCT_FACETS,
  COL_RUBRICS,
  COL_SHOP_PRODUCTS,
} from 'db/collectionNames';
import { noNaN } from 'lib/numbers';

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
    t.nonNull.list.nonNull.field('assets', {
      type: 'Asset',
      resolve: (source) => {
        return source.assets.sort((a, b) => a.index - b.index);
      },
    });
    t.nonNull.list.nonNull.field('attributes', {
      type: 'ProductAttribute',
    });
    t.nonNull.list.nonNull.field('connections', {
      type: 'ProductConnection',
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

    // Product mainImage field resolver
    t.nonNull.field('mainImage', {
      type: 'String',
      resolve: async (source) => {
        const sortedAssets = source.assets.sort((assetA, assetB) => {
          return assetA.index - assetB.index;
        });
        const firstAsset = sortedAssets[0];

        if (!firstAsset) {
          return `${process.env.OBJECT_STORAGE_IMAGE_FALLBACK}`;
        }
        return firstAsset.url;
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

    // Product shopsCount field resolver
    t.nonNull.field('shopsCount', {
      type: 'Int',
      resolve: async (source, _args, context): Promise<number> => {
        const { city } = await getRequestParams(context);
        return noNaN(source.shopProductsCountCities[city]);
      },
    });

    // Product cardShopProducts field resolver
    t.nonNull.list.nonNull.field('cardShopProducts', {
      type: 'ShopProduct',
      description: 'Returns shop products of session city for product card page',
      resolve: async (source, _args, context): Promise<ShopProductModel[]> => {
        const { city } = await getRequestParams(context);
        const db = await getDatabase();
        const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
        const shopsProducts = await shopProductsCollection
          .find({
            _id: { $in: source.shopProductsIds },
            citySlug: city,
          })
          .toArray();
        return shopsProducts;
      },
    });

    // Product allShopProducts field resolver
    t.nonNull.list.nonNull.field('allShopProducts', {
      type: 'ShopProduct',
      description: 'Returns all shop products that product connected to',
      resolve: async (source, _args): Promise<ShopProductModel[]> => {
        const db = await getDatabase();
        const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
        const shopsProducts = await shopProductsCollection
          .find({
            _id: { $in: source.shopProductsIds },
          })
          .toArray();
        return shopsProducts;
      },
    });

    // Product isCustomersChoice field resolver
    t.nonNull.field('isCustomersChoice', {
      type: 'Boolean',
      resolve: async (source, _args, context): Promise<boolean> => {
        const { city } = await getRequestParams(context);
        if (source.shopProductsCountCities[city]) {
          return true;
        }
        return false;
      },
    });

    // Product cardPrices field resolver
    t.nonNull.field('cardPrices', {
      type: 'ProductCardPrices',
      description: 'Should find all connected shop products and return minimal and maximal price.',
      resolve: async (source, _args, context): Promise<ProductCardPricesModel> => {
        try {
          const { city, locale } = await getRequestParams(context);
          const db = await getDatabase();
          const productFacetsCollection = db.collection<ProductFacetModel>(COL_PRODUCT_FACETS);
          const facet = await productFacetsCollection.findOne({ _id: source._id });
          const minPrice = noNaN(facet ? facet.minPriceCities[city] : undefined);
          const maxPrice = noNaN(facet ? facet.maxPriceCities[city] : undefined);
          return {
            _id: new ObjectId(),
            min: getCurrencyString({ value: minPrice, locale }),
            max: getCurrencyString({ value: maxPrice, locale }),
          };
        } catch {
          return {
            _id: new ObjectId(),
            min: '0',
            max: '0',
          };
        }
      },
    });

    // Product listFeatures field resolver
    t.nonNull.list.nonNull.field('listFeatures', {
      type: 'ProductAttribute',
      resolve: async (source): Promise<ProductAttributeModel[]> => {
        return getProductCurrentViewAttributes({
          attributes: source.attributes,
          viewVariant: ATTRIBUTE_VIEW_VARIANT_LIST,
        });
      },
    });

    // Product textFeatures field resolver
    t.nonNull.list.nonNull.field('textFeatures', {
      type: 'ProductAttribute',
      resolve: async (source): Promise<ProductAttributeModel[]> => {
        return getProductCurrentViewAttributes({
          attributes: source.attributes,
          viewVariant: ATTRIBUTE_VIEW_VARIANT_TEXT,
        });
      },
    });

    // Product tagFeatures field resolver
    t.nonNull.list.nonNull.field('tagFeatures', {
      type: 'ProductAttribute',
      resolve: async (source): Promise<ProductAttributeModel[]> => {
        return getProductCurrentViewAttributes({
          attributes: source.attributes,
          viewVariant: ATTRIBUTE_VIEW_VARIANT_TAG,
        });
      },
    });

    // Product iconFeatures field resolver
    t.nonNull.list.nonNull.field('iconFeatures', {
      type: 'ProductAttribute',
      resolve: async (source): Promise<ProductAttributeModel[]> => {
        return getProductCurrentViewAttributes({
          attributes: source.attributes,
          viewVariant: ATTRIBUTE_VIEW_VARIANT_ICON,
        });
      },
    });

    // Product ratingFeatures field resolver
    t.nonNull.list.nonNull.field('ratingFeatures', {
      type: 'ProductAttribute',
      resolve: async (source): Promise<ProductAttributeModel[]> => {
        return getProductCurrentViewAttributes({
          attributes: source.attributes,
          viewVariant: ATTRIBUTE_VIEW_VARIANT_OUTER_RATING,
        });
      },
    });
  },
});
