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
import { COL_PRODUCTS, COL_SHOP_PRODUCTS, COL_SHOPS } from 'db/collectionNames';
import {
  ProductConnectionItemModel,
  ProductConnectionModel,
  ProductModel,
  ShopProductModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { getCurrencyString, getI18nLocaleValue } from 'lib/i18n';
import { getPercentage, noNaN } from 'lib/numbers';
import { phoneToRaw, phoneToReadable } from 'lib/phoneUtils';
import { getProductCurrentViewCastedAttributes } from 'lib/productAttributesUtils';
import { ObjectId } from 'mongodb';

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

    // shopsCount
    const shopsCount = noNaN(product.shopProductsCountCities[city]);

    // prices
    const minPrice = noNaN(product.minPriceCities[city]);
    const maxPrice = noNaN(product.maxPriceCities[city]);
    const cardPrices = {
      _id: new ObjectId(),
      min: getCurrencyString({ value: minPrice, locale }),
      max: getCurrencyString({ value: maxPrice, locale }),
    };

    // image
    const sortedAssets = product.assets.sort((assetA, assetB) => {
      return assetA.index - assetB.index;
    });
    const firstAsset = sortedAssets[0];
    let mainImage = `${process.env.AWS_IMAGE_FALLBACK}`;

    if (firstAsset) {
      mainImage = firstAsset.url;
    }

    // listFeatures
    const listFeatures = getProductCurrentViewCastedAttributes({
      attributes: product.attributes,
      viewVariant: ATTRIBUTE_VIEW_VARIANT_LIST,
      getFieldLocale,
    });

    // textFeatures
    const textFeatures = getProductCurrentViewCastedAttributes({
      attributes: product.attributes,
      viewVariant: ATTRIBUTE_VIEW_VARIANT_TEXT,
      getFieldLocale,
    });

    // tagFeatures
    const tagFeatures = getProductCurrentViewCastedAttributes({
      attributes: product.attributes,
      viewVariant: ATTRIBUTE_VIEW_VARIANT_TAG,
      getFieldLocale,
    });

    // iconFeatures
    const iconFeatures = getProductCurrentViewCastedAttributes({
      attributes: product.attributes,
      viewVariant: ATTRIBUTE_VIEW_VARIANT_ICON,
      getFieldLocale,
    });

    // ratingFeatures
    const ratingFeatures = getProductCurrentViewCastedAttributes({
      attributes: product.attributes,
      viewVariant: ATTRIBUTE_VIEW_VARIANT_OUTER_RATING,
      getFieldLocale,
    });

    // cardShopProducts
    const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
    const initialCardShopProducts = await shopProductsCollection
      .aggregate([
        {
          $match: {
            _id: { $in: product.shopProductsIds },
            citySlug: city,
            archive: false,
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
            shops: -1,
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
          product,
        });
      }

      connections.push({
        ...productConnection,
        attributeName: getFieldLocale(productConnection.attributeNameI18n),
        connectionProducts,
      });
    }

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
    };
  } catch (e) {
    console.log(e);
    return null;
  }
}
