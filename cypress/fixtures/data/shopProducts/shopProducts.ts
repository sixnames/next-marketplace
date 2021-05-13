import { DEFAULT_CITY, DEFAULT_LOCALE } from '../../../../config/common';
import { ShopProductModel } from '../../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';
import * as products from '../products/products';
import * as productConnectionItems from '../productConnectionItems/productConnectionItems';
import * as shops from '../shops/shops';
import * as rubrics from '../rubrics/rubrics';

const maxProductsCountForShop = 50;
const shopProducts: ShopProductModel[] = [];

const noNaN = (value: any) => {
  return value && !isNaN(+value) ? +value : 0;
};

const getCurrencyString = (value?: number | string | null): string => {
  return new Intl.NumberFormat(DEFAULT_LOCALE).format(noNaN(value)).replace(',', ' ');
};

shops.forEach((shop) => {
  rubrics.forEach((rubric) => {
    const rubricProducts = products.filter(({ rubricSlug }) => rubricSlug === rubric.slug);

    for (let i = 0; i < maxProductsCountForShop; i = i + 1) {
      const product = rubricProducts[i];
      const productId = product._id;
      const available = Math.round(Math.random() * 10);
      const withDiscount = i % 2 === 0;
      const price = Math.round(Math.random() * 1000);
      const oldPrice = price - Math.round(price / 3);
      const pricePercent = price / 100;
      const discountedPercent = Math.floor(oldPrice / pricePercent);

      const withConnection = productConnectionItems.some((connectionItem) => {
        return connectionItem.productId.equals(productId);
      });

      if (product) {
        shopProducts.push({
          _id: getObjectId(`shopProduct ${shop.slug} ${product.slug}`),
          shopId: shop._id,
          companyId: shop.companyId,
          citySlug: DEFAULT_CITY,
          mainImage: product.mainImage,
          slug: product.slug,
          originalName: product.originalName,
          itemId: product.itemId,
          productId,
          active: product.active,
          brandCollectionSlug: product.brandCollectionSlug,
          brandSlug: product.brandSlug,
          manufacturerSlug: product.manufacturerSlug,
          nameI18n: product.nameI18n,
          rubricId: product.rubricId,
          rubricSlug: product.rubricSlug,
          selectedOptionsSlugs: product.selectedOptionsSlugs,
          price,
          discountedPercent: withDiscount ? discountedPercent : 0,
          formattedPrice: getCurrencyString(price),
          formattedOldPrice: getCurrencyString(oldPrice),
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
            default: {
              msk: withConnection ? i : 1,
            },
          },
          priorities: {
            default: {
              msk: withConnection ? i : 1,
            },
          },
        });
      }
    }
  });
});

// @ts-ignore
export = shopProducts;
