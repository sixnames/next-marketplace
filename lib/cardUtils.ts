import {
  ATTRIBUTE_VIEW_VARIANT_ICON,
  ATTRIBUTE_VIEW_VARIANT_LIST,
  ATTRIBUTE_VIEW_VARIANT_OUTER_RATING,
  ATTRIBUTE_VIEW_VARIANT_TAG,
  ATTRIBUTE_VIEW_VARIANT_TEXT,
  DEFAULT_LOCALE,
  LOCALE_NOT_FOUND_FIELD_MESSAGE,
  SECONDARY_LOCALE,
} from 'config/common';
import { COL_PRODUCTS, COL_RUBRICS, COL_SHOP_PRODUCTS, COL_SHOPS } from 'db/collectionNames';
import {
  ProductCardBreadcrumbModel,
  ProductConnectionItemModel,
  ProductConnectionModel,
  ProductModel,
  RubricModel,
  ShopProductModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { getCurrencyString, getI18nLocaleValue } from 'lib/i18n';
import { getPercentage, noNaN } from 'lib/numbers';
import { phoneToRaw, phoneToReadable } from 'lib/phoneUtils';
import { getProductCurrentViewCastedAttributes } from 'lib/productAttributesUtils';
import { ObjectId } from 'mongodb';

export interface GetCardBreadcrumbsInterface {
  locale: string;
  product: ProductModel;
  slug: string[];
}

export async function getCardBreadcrumbs({
  locale,
  product,
  slug,
}: GetCardBreadcrumbsInterface): Promise<ProductCardBreadcrumbModel[]> {
  function getFieldLocale(i18nField?: Record<string, string> | null): string {
    if (!i18nField) {
      return '';
    }

    let translation = getI18nLocaleValue<string>(i18nField, locale);

    // Get fallback language if chosen not found
    if (!translation) {
      translation = i18nField[SECONDARY_LOCALE];
    }

    // Get default language if fallback not found
    if (!translation) {
      translation = i18nField[DEFAULT_LOCALE];
    }

    // Set warning massage if fallback language not found
    if (!translation) {
      translation = LOCALE_NOT_FOUND_FIELD_MESSAGE;
    }

    return translation;
  }

  try {
    const db = await getDatabase();
    const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);

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

    const rubric = await rubricsCollection.findOne(
      { slug: rubricSlug },
      {
        projection: {
          _id: 1,
          slug: 1,
          nameI18n: 1,
        },
      },
    );

    // Return empty configs list if no rubric
    if (!rubric) {
      return [];
    }

    const attributesBreadcrumbs: ProductCardBreadcrumbModel[] = [];

    // Collect breadcrumbs configs for all product attributes
    // that have showAsBreadcrumb option enabled
    for await (const productAttribute of product.attributes) {
      if (!productAttribute.showAsBreadcrumb) {
        continue;
      }

      const attribute = rubric.attributes.find(({ _id }) => {
        return productAttribute.attributeId.equals(_id);
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
      const options = await attribute.options.filter(({ slug }) => {
        return productAttribute.selectedOptionsSlugs.includes(slug);
      });
      // Get first selected option
      const firstSelectedOption = options[0];
      if (!firstSelectedOption) {
        continue;
      }

      // Get option name
      const filterNameString = getFieldLocale(firstSelectedOption.nameI18n);

      // Push breadcrumb config to the list
      attributesBreadcrumbs.push({
        _id: attribute._id,
        name: filterNameString,
        href: `/${rubricSlug}/${firstSelectedOption.slug}`,
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
}

export interface GetCardDataInterface {
  locale: string;
  city: string;
  slug: string[];
}

export async function getCardData({
  locale,
  city,
  slug,
}: GetCardDataInterface): Promise<ProductModel | null> {
  function getFieldLocale(i18nField?: Record<string, string> | null): string {
    if (!i18nField) {
      return '';
    }

    let translation = getI18nLocaleValue<string>(i18nField, locale);

    // Get fallback language if chosen not found
    if (!translation) {
      translation = i18nField[SECONDARY_LOCALE];
    }

    // Get default language if fallback not found
    if (!translation) {
      translation = i18nField[DEFAULT_LOCALE];
    }

    // Set warning massage if fallback language not found
    if (!translation) {
      translation = LOCALE_NOT_FOUND_FIELD_MESSAGE;
    }

    return translation;
  }

  try {
    // const startTime = new Date().getTime();
    const db = await getDatabase();
    const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);

    const productSlug = slug[slug.length - 1];
    const productAggregation = await productsCollection
      .aggregate([
        {
          $match: { slug: productSlug },
        },
      ])
      .toArray();

    const product = productAggregation[0];
    if (!product) {
      return null;
    }
    // console.log(`product `, new Date().getTime() - startTime);

    // shopsCount
    const shopsCount = noNaN(product.shopProductsCountCities[city]);
    // console.log(`shopsCount `, new Date().getTime() - startTime);

    // prices
    const minPrice = noNaN(product.minPriceCities[city]);
    const maxPrice = noNaN(product.maxPriceCities[city]);
    const cardPrices = {
      _id: new ObjectId(),
      min: getCurrencyString({ value: minPrice, locale }),
      max: getCurrencyString({ value: maxPrice, locale }),
    };
    // console.log(`prices `, new Date().getTime() - startTime);

    // image
    const sortedAssets = product.assets.sort((assetA, assetB) => {
      return assetA.index - assetB.index;
    });
    const firstAsset = sortedAssets[0];
    let mainImage = `${process.env.OBJECT_STORAGE_IMAGE_FALLBACK}`;

    if (firstAsset) {
      mainImage = firstAsset.url;
    }
    // console.log(`image `, new Date().getTime() - startTime);

    // listFeatures
    const listFeatures = getProductCurrentViewCastedAttributes({
      attributes: product.attributes,
      viewVariant: ATTRIBUTE_VIEW_VARIANT_LIST,
      getFieldLocale,
    });
    // console.log(`listFeatures `, new Date().getTime() - startTime);

    // textFeatures
    const textFeatures = getProductCurrentViewCastedAttributes({
      attributes: product.attributes,
      viewVariant: ATTRIBUTE_VIEW_VARIANT_TEXT,
      getFieldLocale,
    });
    // console.log(`textFeatures `, new Date().getTime() - startTime);

    // tagFeatures
    const tagFeatures = getProductCurrentViewCastedAttributes({
      attributes: product.attributes,
      viewVariant: ATTRIBUTE_VIEW_VARIANT_TAG,
      getFieldLocale,
    });
    // console.log(`tagFeatures `, new Date().getTime() - startTime);

    // iconFeatures
    const iconFeatures = getProductCurrentViewCastedAttributes({
      attributes: product.attributes,
      viewVariant: ATTRIBUTE_VIEW_VARIANT_ICON,
      getFieldLocale,
    });
    // console.log(`iconFeatures `, new Date().getTime() - startTime);

    // ratingFeatures
    const ratingFeatures = getProductCurrentViewCastedAttributes({
      attributes: product.attributes,
      viewVariant: ATTRIBUTE_VIEW_VARIANT_OUTER_RATING,
      getFieldLocale,
    });
    // console.log(`ratingFeatures `, new Date().getTime() - startTime);

    // cardShopProducts
    const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
    const initialCardShopProducts = await shopProductsCollection
      .aggregate([
        {
          $match: {
            _id: { $in: product.shopProductsIds },
            citySlug: city,
          },
        },
        {
          $lookup: {
            from: COL_SHOPS,
            foreignField: '_id',
            localField: 'shopId',
            as: 'shops',
          },
        },
        {
          $addFields: {
            shop: {
              $arrayElemAt: ['$shops', 0],
            },
          },
        },
        {
          $project: {
            shops: 0,
          },
        },
      ])
      .toArray();

    const cardShopProducts: ShopProductModel[] = [];
    initialCardShopProducts.forEach((shopProduct) => {
      const { shop } = shopProduct;
      if (!shop) {
        return;
      }

      const lastOldPrice = shopProduct.oldPrices[shopProduct.oldPrices.length - 1];
      const formattedOldPrice = lastOldPrice
        ? getCurrencyString({ value: lastOldPrice.price, locale })
        : null;

      const discountedPercent =
        lastOldPrice && lastOldPrice.price > shopProduct.price
          ? getPercentage({
              fullValue: lastOldPrice.price,
              partialValue: shopProduct.price,
            })
          : null;

      cardShopProducts.push({
        ...shopProduct,
        formattedPrice: getCurrencyString({ value: shopProduct.price, locale }),
        formattedOldPrice,
        discountedPercent,
        shop: {
          ...shop,
          address: {
            ...shop.address,
            formattedCoordinates: {
              lat: shop.address.point.coordinates[1],
              lng: shop.address.point.coordinates[0],
            },
          },
          contacts: {
            ...shop.contacts,
            formattedPhones: shop.contacts.phones.map((phone) => {
              return {
                raw: phoneToRaw(phone),
                readable: phoneToReadable(phone),
              };
            }),
          },
        },
      });
    });
    // console.log(`cardShopProducts `, new Date().getTime() - startTime);

    // connections
    const connections: ProductConnectionModel[] = [];
    for await (const productConnection of product.connections) {
      const connectionProducts: ProductConnectionItemModel[] = [];
      for await (const connectionProduct of productConnection.connectionProducts) {
        const product = await productsCollection.findOne(
          { _id: connectionProduct.productId },
          {
            projection: {
              _id: 1,
              slug: 1,
              nameI18n: 1,
            },
          },
        );
        if (!product) {
          continue;
        }
        connectionProducts.push({
          ...connectionProduct,
          option: {
            ...connectionProduct.option,
            name: getFieldLocale(connectionProduct.option.nameI18n),
          },
          product: {
            ...product,
            name: getFieldLocale(product.nameI18n),
          },
        });
      }

      connections.push({
        ...productConnection,
        attributeName: getFieldLocale(productConnection.attributeNameI18n),
        connectionProducts,
      });
    }
    // console.log(`connections `, new Date().getTime() - startTime);

    // cardBreadcrumbs
    const cardBreadcrumbs: ProductCardBreadcrumbModel[] = await getCardBreadcrumbs({
      locale,
      product,
      slug,
    });
    // console.log(`cardBreadcrumbs `, new Date().getTime() - startTime);

    return {
      ...product,
      name: getFieldLocale(product.nameI18n),
      description: getFieldLocale(product.descriptionI18n),
      cardPrices,
      shopsCount,
      mainImage,
      listFeatures,
      textFeatures,
      tagFeatures,
      iconFeatures,
      ratingFeatures,
      cardShopProducts,
      connections,
      cardBreadcrumbs,
    };
  } catch (e) {
    console.log(e);
    return null;
  }
}
