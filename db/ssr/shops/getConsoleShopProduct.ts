import { castSupplierProductsList } from 'db/cast/castSupplierProductsList';
import { getDbCollections } from 'db/mongodb';
import { getProductFullSummary } from 'db/ssr/products/getProductFullSummary';
import { ShopProductInterface } from 'db/uiInterfaces';
import {
  shopProductShopPipeline,
  shopProductSupplierProductsPipeline,
} from 'db/utils/constantPipelines';
import { ObjectId } from 'mongodb';

interface GetConsoleShopProductInterface {
  shopProductId: string | string[];
  locale: string;
  companySlug: string;
}

export async function getConsoleShopProduct({
  shopProductId,
  locale,
  companySlug,
}: GetConsoleShopProductInterface): Promise<ShopProductInterface | null> {
  const collections = await getDbCollections();
  const shopProductsCollection = collections.shopProductsCollection();

  // get shop product
  const shopProductsAggregation = await shopProductsCollection
    .aggregate<ShopProductInterface>([
      {
        $match: {
          _id: new ObjectId(`${shopProductId}`),
        },
      },

      // get shop
      ...shopProductShopPipeline,

      // get supplier products
      ...shopProductSupplierProductsPipeline,
    ])
    .toArray();
  const shopProductResult = shopProductsAggregation[0];
  if (!shopProductResult) {
    return null;
  }

  const productPayload = await getProductFullSummary({
    companySlug,
    locale,
    productId: shopProductResult.productId.toHexString(),
  });
  if (!productPayload) {
    return null;
  }
  const { seoContentsList, summary } = productPayload;

  const shopProduct: ShopProductInterface = {
    ...shopProductResult,
    supplierProducts: castSupplierProductsList({
      supplierProducts: shopProductResult.supplierProducts,
      locale,
    }),
    summary: {
      ...summary,
      cardContentCities: seoContentsList,
    },
  };

  return shopProduct;
}
