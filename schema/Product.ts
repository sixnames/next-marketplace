import { list, nonNull, objectType, stringArg } from 'nexus';
import { getRequestParams } from 'lib/sessionHelpers';
import {
  AttributeModel,
  BrandCollectionModel,
  BrandModel,
  ManufacturerModel,
  OptionModel,
  ProductCardBreadcrumbModel,
  ProductCardConnectionItemModel,
  ProductCardConnectionModel,
  ProductCardFeaturesModel,
  ProductCardPricesModel,
  ProductConnectionModel,
  ProductModel,
  ProductSnippetFeaturesModel,
  RubricModel,
  ShopProductModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import {
  COL_ATTRIBUTES,
  COL_BRAND_COLLECTIONS,
  COL_BRANDS,
  COL_MANUFACTURERS,
  COL_OPTIONS,
  COL_PRODUCT_CONNECTIONS,
  COL_PRODUCTS,
  COL_RUBRICS,
  COL_SHOP_PRODUCTS,
} from 'db/collectionNames';
import {
  ATTRIBUTE_VIEW_VARIANT_ICON,
  ATTRIBUTE_VIEW_VARIANT_LIST,
  ATTRIBUTE_VIEW_VARIANT_OUTER_RATING,
  ATTRIBUTE_VIEW_VARIANT_TAG,
  ATTRIBUTE_VIEW_VARIANT_TEXT,
  LOCALE_NOT_FOUND_FIELD_MESSAGE,
} from 'config/common';
import { getCurrencyString } from 'lib/i18n';
import { ObjectId } from 'mongodb';
import {
  getAttributesIdsInProductConnections,
  getAttributesListFromProductAttributes,
  getProductAttributeValue,
  getProductConnections,
} from 'lib/productAttributesUtils';
import { noNaN } from 'lib/numbers';

export const ProductCardBreadcrumb = objectType({
  name: 'ProductCardBreadcrumb',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.string('name');
    t.nonNull.string('href');
  },
});

export const ProductCardFeatures = objectType({
  name: 'ProductCardFeatures',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.list.nonNull.field('listFeatures', {
      type: 'ProductAttribute',
    });
    t.nonNull.list.nonNull.field('textFeatures', {
      type: 'ProductAttribute',
    });
    t.nonNull.list.nonNull.field('tagFeatures', {
      type: 'ProductAttribute',
    });
    t.nonNull.list.nonNull.field('iconFeatures', {
      type: 'ProductAttribute',
    });
    t.nonNull.list.nonNull.field('ratingFeatures', {
      type: 'ProductAttribute',
    });
  },
});

export const ProductSnippetFeatures = objectType({
  name: 'ProductSnippetFeatures',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.string('listFeaturesString');
    t.nonNull.list.nonNull.field('ratingFeaturesValues', {
      type: 'String',
    });
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
    t.nonNull.boolean('archive');
    t.string('brandSlug');
    t.string('brandCollectionSlug');
    t.string('manufacturerSlug');
    t.nonNull.json('nameI18n');
    t.nonNull.json('descriptionI18n');
    t.nonNull.list.nonNull.objectId('rubricsIds');
    t.nonNull.json('views');
    t.nonNull.json('priorities');
    t.nonNull.list.nonNull.field('assets', {
      type: 'Asset',
      resolve: (source) => {
        return source.assets.sort((a, b) => a.index - b.index);
      },
    });
    t.nonNull.list.nonNull.field('attributes', {
      type: 'ProductAttribute',
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
          return `${process.env.AWS_IMAGE_FALLBACK}`;
        }
        return firstAsset.url;
      },
    });

    // Product rubrics list resolver
    t.nonNull.list.nonNull.field('rubrics', {
      type: 'Rubric',
      resolve: async (source): Promise<RubricModel[]> => {
        const db = await getDatabase();
        const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
        const rubrics = await rubricsCollection.find({ _id: { $in: source.rubricsIds } }).toArray();
        return rubrics;
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

    // Product connections field resolver
    t.nonNull.list.nonNull.field('connections', {
      type: 'ProductConnection',
      resolve: async (source): Promise<ProductConnectionModel[]> => {
        const db = await getDatabase();
        const productsConnectionsCollection = db.collection<ProductConnectionModel>(
          COL_PRODUCT_CONNECTIONS,
        );
        const productsConnections = await productsConnectionsCollection
          .find({
            productsIds: {
              $in: [source._id],
            },
          })
          .toArray();
        return productsConnections;
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

    // Product minPrice field resolver
    t.nonNull.field('minPrice', {
      type: 'Int',
      resolve: async (source, _args, context): Promise<number> => {
        const { city } = await getRequestParams(context);
        return noNaN(source.minPriceCities[city]);
      },
    });

    // Product maxPrice field resolver
    t.nonNull.field('maxPrice', {
      type: 'Int',
      resolve: async (source, _args, context): Promise<number> => {
        const { city } = await getRequestParams(context);
        return noNaN(source.maxPriceCities[city]);
      },
    });

    // Product cardPrices field resolver
    t.nonNull.field('cardPrices', {
      type: 'ProductCardPrices',
      description: 'Should find all connected shop products and return minimal and maximal price.',
      resolve: async (source, _args, context): Promise<ProductCardPricesModel> => {
        try {
          const { city, locale } = await getRequestParams(context);
          const minPrice = noNaN(source.minPriceCities[city]);
          const maxPrice = noNaN(source.maxPriceCities[city]);
          return {
            min: getCurrencyString({ value: minPrice, locale }),
            max: getCurrencyString({ value: maxPrice, locale }),
          };
        } catch {
          return {
            min: '0',
            max: '0',
          };
        }
      },
    });

    // Product cardBreadcrumbs field resolver
    t.nonNull.list.nonNull.field('cardBreadcrumbs', {
      type: 'ProductCardBreadcrumb',
      description: 'Should return product card breadcrumbs configs list for product card page',
      args: {
        slug: nonNull(list(nonNull(stringArg()))),
      },
      resolve: async (source, args, context): Promise<ProductCardBreadcrumbModel[]> => {
        try {
          const { getFieldLocale } = await getRequestParams(context);
          const db = await getDatabase();
          const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
          const attributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);
          const optionsCollection = db.collection<OptionModel>(COL_OPTIONS);
          const { slug } = args;

          // Return empty configs list if slug arg is empty
          if (!slug || slug.length < 2) {
            return [];
          }

          // Get slugs parts
          // Each slug contain keyword and value separated by -
          const cardSlugs = slug.slice(0, slug.length - 1);
          const cardSlugsParts = cardSlugs.map((slug) => {
            return slug.split('-');
          });

          // Get rubric slug
          const rubricSlugArr = cardSlugsParts.find((part) => part[0] === 'rubric');

          // Return empty configs list if no rubric slug
          if (!rubricSlugArr) {
            return [];
          }
          const rubricSlug = rubricSlugArr[1];
          if (!rubricSlug) {
            return [];
          }

          const rubric = await rubricsCollection.findOne({ slug: rubricSlug });

          // Return empty configs list if no rubric
          if (!rubric) {
            return [];
          }

          const attributesBreadcrumbs: ProductCardBreadcrumbModel[] = [];

          // Collect breadcrumbs configs for all product attributes
          // that have showAsBreadcrumb option enabled
          for await (const productAttribute of source.attributes) {
            if (!productAttribute.showAsBreadcrumb) {
              continue;
            }

            const attribute = await attributesCollection.findOne({
              _id: productAttribute.attributeId,
            });
            // Continue if no attribute or no selectedOptionsSlugs
            if (!attribute) {
              continue;
            }
            if (
              !productAttribute.selectedOptionsSlugs ||
              productAttribute.selectedOptionsSlugs.length < 1
            ) {
              continue;
            }

            // Get all selected options
            const options = await optionsCollection
              .find({ slug: { $in: productAttribute.selectedOptionsSlugs } })
              .toArray();
            // Get first selected option
            const firstSelectedOption = options[0];
            if (!firstSelectedOption) {
              continue;
            }

            // Get readable option name based on rubric gender
            const { variants, nameI18n } = firstSelectedOption;
            let filterNameString: string;
            const currentVariant = variants?.find(
              ({ gender }) => gender === rubric.catalogueTitle.gender,
            );
            const currentVariantName = currentVariant
              ? getFieldLocale(currentVariant.value)
              : LOCALE_NOT_FOUND_FIELD_MESSAGE;
            if (currentVariantName === LOCALE_NOT_FOUND_FIELD_MESSAGE) {
              filterNameString = getFieldLocale(nameI18n);
            } else {
              filterNameString = currentVariantName;
            }

            // Push breadcrumb config to the list
            attributesBreadcrumbs.push({
              _id: attribute._id,
              name: filterNameString,
              href: `/${rubricSlug}/${attribute.slug}-${firstSelectedOption.slug}`,
            });
          }

          // Returns all config [rubric, ...attributes]
          return [
            {
              _id: rubric._id,
              name: getFieldLocale(rubric.nameI18n),
              href: `/${rubricSlug}`,
            },
            ...attributesBreadcrumbs,
          ];
        } catch {
          return [];
        }
      },
    });

    // Product snippetFeatures field resolver
    t.nonNull.field('snippetFeatures', {
      type: 'ProductSnippetFeatures',
      description: `Returns all list view product attributes as one string and all rating view product attributes as strings array. Each string contains attribute name and product attribute value.`,
      resolve: async (source, _args, context): Promise<ProductSnippetFeaturesModel> => {
        try {
          const db = await getDatabase();
          const { getFieldLocale } = await getRequestParams(context);
          const optionsCollection = db.collection<OptionModel>(COL_OPTIONS);

          const ratingFeaturesValues: string[] = [];
          let listFeaturesString = '';

          // All needed attributes
          const attributes = await getAttributesListFromProductAttributes({
            product: source,
          });

          for await (const attribute of attributes) {
            // Find current product attribute
            const productAttribute = source.attributes.find(({ attributeId }) =>
              attributeId.equals(attribute._id),
            );

            // Continue if product attribute not found
            if (!productAttribute) {
              continue;
            }

            // listFeaturesString
            if (attribute.viewVariant === ATTRIBUTE_VIEW_VARIANT_LIST) {
              const { isOptions, value, selectedOptionsSlugs } = await getProductAttributeValue(
                productAttribute,
                getFieldLocale,
              );
              const stringSeparator = listFeaturesString.length > 0 ? ', ' : '';

              if (value && selectedOptionsSlugs) {
                if (isOptions && attribute.optionsGroupId) {
                  const options = await optionsCollection
                    .find(
                      {
                        $and: [
                          {
                            _id: { $in: attribute.optionsIds },
                          },
                          {
                            slug: { $in: selectedOptionsSlugs },
                          },
                        ],
                      },
                      {
                        projection: {
                          nameI18n: 1,
                        },
                      },
                    )
                    .toArray();

                  if (options.length < 1) {
                    continue;
                  }

                  const optionsNames = options.map(({ nameI18n }) => getFieldLocale(nameI18n));
                  listFeaturesString = `${listFeaturesString}${stringSeparator}${optionsNames.join(
                    ', ',
                  )}`;
                } else {
                  listFeaturesString = `${listFeaturesString}${stringSeparator}${value}`;
                }
              }
            }

            // ratingFeatures
            if (attribute.viewVariant === ATTRIBUTE_VIEW_VARIANT_OUTER_RATING) {
              const { value, isNumber } = await getProductAttributeValue(
                productAttribute,
                getFieldLocale,
              );
              if (!isNumber || !value) {
                continue;
              }
              const attributeName = getFieldLocale(attribute.nameI18n);
              ratingFeaturesValues.push(`${attributeName} ${value}`);
            }
          }

          return {
            _id: new ObjectId(),
            ratingFeaturesValues,
            listFeaturesString,
          };
        } catch (e) {
          console.log(e);
          return {
            _id: new ObjectId(),
            ratingFeaturesValues: [],
            listFeaturesString: '',
          };
        }
      },
    });

    // Product cardFeatures field resolver
    t.nonNull.field('cardFeatures', {
      type: 'ProductCardFeatures',
      description: 'Should return product card features in readable form',
      resolve: async (source, _args, context): Promise<ProductCardFeaturesModel> => {
        const features: Omit<ProductCardFeaturesModel, 'listFeaturesString'> = {
          _id: new ObjectId(),
          listFeatures: [],
          textFeatures: [],
          tagFeatures: [],
          iconFeatures: [],
          ratingFeatures: [],
        };

        try {
          const { getFieldLocale } = await getRequestParams(context);
          const db = await getDatabase();
          const attributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);

          // Get ids of attributes used in connections
          const attributesIdsInConnections = await getAttributesIdsInProductConnections(source._id);

          // Find all attributes values
          for await (const productAttribute of source.attributes) {
            const noSelectedOptionsSlugs =
              !productAttribute.selectedOptionsSlugs ||
              productAttribute.selectedOptionsSlugs.length < 1;
            const attributeValueNotSet =
              !productAttribute.textI18n && !productAttribute.number && noSelectedOptionsSlugs;
            // Continue if product attribute value is not set
            if (!productAttribute.showInCard || attributeValueNotSet) {
              continue;
            }

            // Find current attribute
            const attribute = await attributesCollection.findOne({
              $and: [
                { _id: productAttribute.attributeId },
                // Exclude attributes used in connections
                { _id: { $nin: attributesIdsInConnections } },
              ],
            });
            // Continue if attribute not found
            if (!attribute) {
              continue;
            }

            // listFeatures and listFeaturesString
            if (attribute.viewVariant === ATTRIBUTE_VIEW_VARIANT_LIST) {
              const { value, selectedOptionsSlugs } = await getProductAttributeValue(
                productAttribute,
                getFieldLocale,
              );

              if (value && selectedOptionsSlugs) {
                features.listFeatures.push(productAttribute);
              }
              continue;
            }

            // textFeatures
            if (attribute.viewVariant === ATTRIBUTE_VIEW_VARIANT_TEXT) {
              const { value } = await getProductAttributeValue(productAttribute, getFieldLocale);
              if (value) {
                features.textFeatures.push(productAttribute);
              }
              continue;
            }

            // tagFeatures
            if (attribute.viewVariant === ATTRIBUTE_VIEW_VARIANT_TAG) {
              const { value } = await getProductAttributeValue(productAttribute, getFieldLocale);
              if (value) {
                features.tagFeatures.push(productAttribute);
              }
              continue;
            }

            // iconFeatures
            if (attribute.viewVariant === ATTRIBUTE_VIEW_VARIANT_ICON) {
              const { value } = await getProductAttributeValue(productAttribute, getFieldLocale);
              if (value) {
                features.iconFeatures.push(productAttribute);
              }
              continue;
            }

            // ratingFeatures
            if (attribute.viewVariant === ATTRIBUTE_VIEW_VARIANT_OUTER_RATING) {
              const { value, isNumber } = await getProductAttributeValue(
                productAttribute,
                getFieldLocale,
              );
              if (!isNumber || !value) {
                continue;
              }
              features.ratingFeatures.push(productAttribute);
            }
          }

          return features;
        } catch {
          return features;
        }
      },
    });

    // Product cardConnections field resolver
    t.nonNull.list.nonNull.field('cardConnections', {
      type: 'ProductCardConnection',
      resolve: async (source, _args, context): Promise<ProductCardConnectionModel[]> => {
        try {
          const db = await getDatabase();
          const { getFieldLocale, city } = await getRequestParams(context);
          const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
          const attributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);
          const rootProductId = source._id;

          // Get all product connections
          const connections = await getProductConnections(rootProductId);

          // Cast connections data for product card
          const cardConnections: ProductCardConnectionModel[] = [];
          for await (const connection of connections) {
            const attribute = await attributesCollection.findOne({ _id: connection.attributeId });
            if (!attribute) {
              continue;
            }

            const products = await productsCollection
              .aggregate([
                { $match: { _id: { $in: connection.productsIds } } },

                // count shop products
                { $addFields: { shopsCount: `$shopProductsCountCities.${city}` } },

                // filter out products not added to the shops
                { $match: { shopsCount: { $gt: 0 } } },
              ])
              .toArray();

            cardConnections.push({
              _id: connection._id,
              name: getFieldLocale(attribute.nameI18n),
              productsIds: connection.productsIds,
              attributeId: connection.attributeId,
              connectionProducts: products.reduce(
                (acc: ProductCardConnectionItemModel[], connectionProduct) => {
                  const productAttribute = connectionProduct.attributes.find(({ attributeId }) => {
                    return attributeId.equals(connection.attributeId);
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
                      isCurrent: connectionProduct._id.equals(rootProductId),
                      product: connectionProduct,
                    },
                  ];
                },
                [],
              ),
            });
          }

          return cardConnections;
        } catch (e) {
          console.log(e);
          return [];
        }
      },
    });
  },
});
