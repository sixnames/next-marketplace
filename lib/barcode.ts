import { ObjectIdModel } from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import {
  BarcodeDoublesInterface,
  ProductSummaryInterface,
  ShopProductBarcodeDoublesInterface,
  ShopProductInterface,
} from 'db/uiInterfaces';
import { summaryPipeline } from 'db/utils/constantPipelines';
import { getFieldStringLocale } from 'lib/i18n';

interface CheckBarcodeIntersectsInterface {
  barcode: string[];
  productId?: ObjectIdModel | null;
  locale: string;
}

export async function checkBarcodeIntersects({
  barcode,
  locale,
  productId,
}: CheckBarcodeIntersectsInterface): Promise<BarcodeDoublesInterface[]> {
  const collections = await getDbCollections();
  const productSummariesCollection = collections.productSummariesCollection();
  const idMatch = productId
    ? {
        _id: {
          $ne: productId,
        },
      }
    : {};
  const barcodeDoubles: BarcodeDoublesInterface[] = [];
  if (barcode.length < 1) {
    return barcodeDoubles;
  }

  for await (const barcodeItem of barcode) {
    const products = await productSummariesCollection
      .aggregate<ProductSummaryInterface>([
        {
          $match: {
            ...idMatch,
            barcode: barcodeItem,
          },
        },
      ])
      .toArray();

    if (products.length > 0) {
      barcodeDoubles.push({
        barcode: barcodeItem,
        products: products.map((product) => {
          return {
            ...product,
            snippetTitle: getFieldStringLocale(product.snippetTitleI18n, locale),
          };
        }),
      });
    }
  }

  return barcodeDoubles;
}

interface CheckShopProductBarcodeIntersectsInterface {
  barcode: string[];
  shopProductId: ObjectIdModel;
  locale: string;
}

export async function checkShopProductBarcodeIntersects({
  barcode,
  locale,
  shopProductId,
}: CheckShopProductBarcodeIntersectsInterface): Promise<ShopProductBarcodeDoublesInterface[]> {
  const collections = await getDbCollections();
  const shopProductsCollection = collections.shopProductsCollection();
  const barcodeDoubles: ShopProductBarcodeDoublesInterface[] = [];
  const shopProduct = await shopProductsCollection.findOne({
    _id: shopProductId,
  });
  if (barcode.length < 1 || !shopProduct) {
    return barcodeDoubles;
  }

  for await (const barcodeItem of barcode) {
    const shopProducts = await shopProductsCollection
      .aggregate<ShopProductInterface>([
        {
          $match: {
            _id: {
              $ne: shopProductId,
            },
            shopId: shopProduct.shopId,
            barcode: barcodeItem,
          },
        },
        {
          $project: {
            descriptionI18n: false,
          },
        },

        // get product
        ...summaryPipeline('$productId'),
      ])
      .toArray();

    if (shopProducts.length > 0) {
      const double: ShopProductBarcodeDoublesInterface = {
        barcode: barcodeItem,
        products: shopProducts.reduce((acc: ShopProductInterface[], shopProduct) => {
          const { summary } = shopProduct;
          if (!summary) {
            return acc;
          }

          const productPayload: ProductSummaryInterface = {
            ...summary,
            snippetTitle: getFieldStringLocale(summary.snippetTitleI18n, locale),
          };

          const payload: ShopProductInterface = {
            ...shopProduct,
            summary: productPayload,
          };
          return [...acc, payload];
        }, []),
      };
      barcodeDoubles.push(double);
    }
  }

  return barcodeDoubles;
}
