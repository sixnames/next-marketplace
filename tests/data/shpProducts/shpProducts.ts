import addZero from 'add-zero';
import { getCliParamBoolean } from '../../testUtils/testDbUtils';
import { DEFAULT_CITY, DEFAULT_COMPANY_SLUG, ID_COUNTER_DIGITS } from '../../../config/common';
import { ShopProductModel } from '../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';
import productSummaries from '../productSummaries/productSummaries';
import shops from '../shops/shops';
import rubrics from '../rubrics/rubrics';

const maxProductsCountForShop = 50;
const shpProducts: ShopProductModel[] = [];

const isOneShopCompany = getCliParamBoolean('oneShop');

if (isOneShopCompany) {
  rubrics.forEach((rubric) => {
    const rubricProducts = productSummaries.filter(({ rubricSlug }) => rubricSlug === rubric.slug);
    for (let i = 0; i < maxProductsCountForShop; i = i + 1) {
      const product = rubricProducts[i];
      const productId = product._id;

      const withConnection = product.variants.length > 0;

      const shop = shops.find(({ slug }) => {
        return slug === 'shop_a';
      });

      if (!shop) {
        return;
      }

      if (product) {
        const withDiscount = i % 2 === 0;
        const available = i % 3 === 0 ? 5 : 0;
        const price = Math.round(Math.random() * 1000) * 100;
        const oldPrice = price + Math.round(price / 3);
        const pricePercent = oldPrice / 100;
        const discountedPercent = 100 - Math.floor(price / pricePercent);
        const barcode = product.barcode;

        shpProducts.push({
          _id: getObjectId(`shopProduct ${shop.slug} ${product.slug}`),
          barcode,
          productId,
          shopId: shop._id,
          companyId: shop.companyId,
          companySlug: shop.companySlug,
          citySlug: DEFAULT_CITY,
          itemId: addZero(i, ID_COUNTER_DIGITS),
          brandCollectionSlug: product.brandCollectionSlug,
          brandSlug: product.brandSlug,
          manufacturerSlug: product.manufacturerSlug,
          mainImage: product.mainImage,
          rubricId: product.rubricId,
          rubricSlug: product.rubricSlug,
          allowDelivery: product.allowDelivery,
          filterSlugs: product.filterSlugs,
          discountedPercent: withDiscount ? discountedPercent : 0,
          oldPrice,
          price,
          available,
          oldPrices: withDiscount
            ? [
                {
                  price: oldPrice,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
              ]
            : [],
          createdAt: new Date(),
          updatedAt: new Date(),
          views: {
            [DEFAULT_COMPANY_SLUG]: {
              msk: withConnection ? i : 1,
            },
          },
          priorities: {
            [DEFAULT_COMPANY_SLUG]: {
              msk: withConnection ? i : 1,
            },
          },
        });
      }
    }
  });
} else {
  rubrics.forEach((rubric) => {
    const rubricProducts = productSummaries.filter(({ rubricSlug }) => rubricSlug === rubric.slug);
    const isWhiskey = rubric.slug === 'viski';

    for (let i = 0; i < maxProductsCountForShop; i = i + 1) {
      const product = rubricProducts[i];
      const productId = product._id;

      const withConnection = product.variants.length > 0;

      shops.forEach((shop) => {
        if (product) {
          if (shop.slug === 'shop_c') {
            return;
          }

          if (isWhiskey && shop.slug !== 'shop_a') {
            return;
          }

          const withDiscount = i % 2 === 0;
          const available = i % 3 === 0 ? 5 : 0;
          const price = Math.round(Math.random() * 1000) * 100;
          const oldPrice = price + Math.round(price / 3);
          const pricePercent = oldPrice / 100;
          const discountedPercent = 100 - Math.floor(price / pricePercent);
          const barcode = product.barcode;

          shpProducts.push({
            _id: getObjectId(`shopProduct ${shop.slug} ${product.slug}`),
            barcode,
            productId,
            shopId: shop._id,
            companyId: shop.companyId,
            companySlug: shop.companySlug,
            citySlug: DEFAULT_CITY,
            itemId: addZero(i, ID_COUNTER_DIGITS),
            brandCollectionSlug: product.brandCollectionSlug,
            brandSlug: product.brandSlug,
            manufacturerSlug: product.manufacturerSlug,
            mainImage: product.mainImage,
            rubricId: product.rubricId,
            rubricSlug: product.rubricSlug,
            allowDelivery: product.allowDelivery,
            filterSlugs: product.filterSlugs,
            discountedPercent: withDiscount ? discountedPercent : 0,
            oldPrice,
            price,
            available,
            oldPrices: withDiscount
              ? [
                  {
                    price: oldPrice,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                  },
                ]
              : [],
            createdAt: new Date(),
            updatedAt: new Date(),
            views: {
              [DEFAULT_COMPANY_SLUG]: {
                msk: withConnection ? i : 1,
              },
            },
            priorities: {
              [DEFAULT_COMPANY_SLUG]: {
                msk: withConnection ? i : 1,
              },
            },
          });
        }
      });
    }
  });
}

// @ts-ignore
export = shpProducts;