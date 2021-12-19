import { ShopProductModel } from '../db/dbModels';
import { getPercentage } from './numbers';

interface GetUpdatedShopProductPricesInterface {
  shopProduct: ShopProductModel;
  newPrice: number;
}

interface GetUpdatedShopProductPricesPayloadInterface {
  oldPriceUpdater: Record<string, any>;
  discountedPercent: number;
  oldPrice?: number | null;
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

  const lastOldPrice = priceChanged
    ? { price: shopProduct.price }
    : shopProduct.oldPrices[shopProduct.oldPrices.length - 1];

  const currentPrice = priceChanged ? newPrice : shopProduct.price;

  const discountedPercent =
    lastOldPrice && lastOldPrice.price > shopProduct.price
      ? getPercentage({
          fullValue: lastOldPrice.price,
          partialValue: currentPrice,
        })
      : 0;

  return {
    oldPriceUpdater,
    discountedPercent,
    oldPrice: shopProduct.oldPrice,
  };
}
