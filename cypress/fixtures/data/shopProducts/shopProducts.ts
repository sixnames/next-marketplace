import addZero from 'add-zero';
import { DEFAULT_CITY, ID_COUNTER_DIGITS } from '../../../../config/common';
import { ShopProductModel } from '../../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';
import products from '../products/products';
import productConnectionItems from '../productConnectionItems/productConnectionItems';
import shops from '../shops/shops';
import rubrics from '../rubrics/rubrics';

const maxProductsCountForShop = 50;
const shopProducts: ShopProductModel[] = [];

shops.forEach((shop) => {
  if (shop.itemId === '000003') {
    return;
  }
  rubrics.forEach((rubric) => {
    const rubricProducts = products.filter(({ rubricSlug }) => rubricSlug === rubric.slug);

    for (let i = 0; i < maxProductsCountForShop; i = i + 1) {
      const product = rubricProducts[i];
      const productId = product._id;

      const withConnection = productConnectionItems.some((connectionItem) => {
        return connectionItem.productId.equals(productId);
      });

      if (product) {
        const available = 5;
        const withDiscount = i % 2 === 0;
        const price = Math.round(Math.random() * 1000) * 100;
        const oldPrice = price + Math.round(price / 3);
        const pricePercent = oldPrice / 100;
        const discountedPercent = 100 - Math.floor(price / pricePercent);
        const barcode = product.barcode;

        shopProducts.push({
          _id: getObjectId(`shopProduct ${shop.slug} ${product.slug} ${barcode}`),
          barcode,
          productId,
          shopId: shop._id,
          companyId: shop.companyId,
          citySlug: DEFAULT_CITY,
          itemId: addZero(i, ID_COUNTER_DIGITS),
          brandCollectionSlug: product.brandCollectionSlug,
          brandSlug: product.brandSlug,
          manufacturerSlug: product.manufacturerSlug,
          mainImage: product.mainImage,
          rubricId: product.rubricId,
          rubricSlug: product.rubricSlug,
          selectedOptionsSlugs: product.selectedOptionsSlugs,
          supplierSlugs: product.supplierSlugs,
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
