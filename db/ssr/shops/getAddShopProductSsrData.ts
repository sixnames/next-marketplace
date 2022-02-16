import { getDbCollections } from 'db/mongodb';
import {
  getConsoleRubricProducts,
  GetConsoleRubricProductsInputInterface,
} from 'db/ssr/rubrics/getConsoleRubricProducts';
import { getConsoleShopSsr } from 'db/ssr/shops/getConsoleShopSsr';
import { alwaysString } from 'lib/arrayUtils';
import { getFieldStringLocale } from 'lib/i18n';
import { ShopAddProductsListRouteReduced } from 'pages/cms/companies/[companyId]/shops/shop/[shopId]/rubrics/[rubricSlug]/add/[...filters]';

interface GetAddShopProductSsrDataInterface extends GetConsoleRubricProductsInputInterface {}

export async function getAddShopProductSsrData({
  locale,
  basePath,
  query,
  currency,
  companySlug,
}: GetAddShopProductSsrDataInterface): Promise<ShopAddProductsListRouteReduced | null> {
  const collections = await getDbCollections();
  const shopProductsCollection = collections.shopProductsCollection();
  const shopId = alwaysString(query.shopId);

  // console.log(' ');
  // console.log('>>>>>>>>>>>>>>>>>>>>>>>');
  // console.log('CompanyShopProductsList props ');
  // const startTime = new Date().getTime();

  // Get shop
  const shop = await getConsoleShopSsr(`${shopId}`);
  if (!shop) {
    return null;
  }
  const shopProducts = await shopProductsCollection
    .aggregate([
      {
        $match: {
          shopId: shop._id,
          rubricSlug: alwaysString(query.rubricSlug),
        },
      },
      {
        $project: {
          productId: true,
        },
      },
    ])
    .toArray();
  const excludedProductsIds = shopProducts.map(({ productId }) => productId);

  const { selectedAttributes, page, docs, clearSlug, attributes, totalPages, totalDocs, rubric } =
    await getConsoleRubricProducts({
      excludedProductsIds,
      query,
      locale,
      basePath,
      currency,
      companySlug,
    });

  if (!rubric) {
    return null;
  }

  const payload: ShopAddProductsListRouteReduced = {
    shop,
    rubricName: getFieldStringLocale(rubric.nameI18n, locale),
    rubricSlug: rubric.slug,
    clearSlug,
    basePath,
    totalDocs,
    totalPages,
    attributes,
    selectedAttributes,
    page,
    docs,
    companySlug,
  };

  return payload;
}
