import { ShopProductModel, ShopProductOldPriceModel } from '../db/dbModels';
import { getPercentage } from './numbers';

interface GetUpdatedShopProductPricesInterface {
  shopProduct: ShopProductModel;
  newPrice: number;
}

interface GetUpdatedShopProductPricesPayloadInterface {
  oldPriceUpdater: Record<string, any>;
  discountedPercent: number;
  oldPrice?: number | null;
  lastOldPrice: ShopProductOldPriceModel;
  newPrice: number;
}

export function getUpdatedShopProductPrices({
  shopProduct,
  newPrice,
}: GetUpdatedShopProductPricesInterface): GetUpdatedShopProductPricesPayloadInterface {
  const priceChanged = shopProduct.price !== newPrice;
  const oldPriceUpdater = priceChanged
    ? {
        $push: {
          oldPrices: {
            price: shopProduct.price,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
      }
    : {};

  const lastOldPrice: ShopProductOldPriceModel = priceChanged
    ? { price: shopProduct.price, createdAt: new Date(), updatedAt: new Date() }
    : shopProduct.oldPrices[shopProduct.oldPrices.length - 1];

  const currentPrice = priceChanged ? newPrice : shopProduct.price;
  const discountedPercent = priceChanged
    ? getPercentage({
        fullValue: lastOldPrice.price,
        partialValue: currentPrice,
      })
    : 0;

  return {
    oldPriceUpdater,
    discountedPercent,
    lastOldPrice,
    newPrice,
    oldPrice: priceChanged ? shopProduct.price : shopProduct.oldPrice,
  };
}
