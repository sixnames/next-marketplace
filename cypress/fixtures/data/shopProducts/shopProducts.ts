import { DEFAULT_CITY } from '../../../../config/common';
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
        product.barcode?.forEach((barcode) => {
          const available = 5;
          const withDiscount = i % 2 === 0;
          const price = Math.round(Math.random() * 1000);
          const oldPrice = price + Math.round(price / 3);
          const pricePercent = oldPrice / 100;
          const discountedPercent = 100 - Math.floor(price / pricePercent);

          shopProducts.push({
            _id: getObjectId(`shopProduct ${shop.slug} ${product.slug} ${barcode}`),
            shopId: shop._id,
            companyId: shop.companyId,
            citySlug: DEFAULT_CITY,
            mainImage: product.mainImage,
            slug: product.slug,
            originalName: product.originalName,
            itemId: product.itemId,
            barcode,
            productId,
            active: product.active,
            brandCollectionSlug: product.brandCollectionSlug,
            brandSlug: product.brandSlug,
            manufacturerSlug: product.manufacturerSlug,
            nameI18n: product.nameI18n,
            descriptionI18n: product.descriptionI18n,
            rubricId: product.rubricId,
            rubricSlug: product.rubricSlug,
            selectedOptionsSlugs: product.selectedOptionsSlugs,
            titleCategoriesSlugs: product.titleCategoriesSlugs,
            discountedPercent: withDiscount ? discountedPercent : 0,
            gender: product.gender,
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
        });
      }
    }
  });
});

// @ts-ignore
export = shopProducts;
