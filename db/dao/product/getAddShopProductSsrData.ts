import { COL_COMPANIES, COL_SHOP_PRODUCTS, COL_SHOPS } from 'db/collectionNames';
import {
  getConsoleRubricProducts,
  GetConsoleRubricProductsInputInterface,
} from 'db/dao/product/getConsoleRubricProducts';
import { getDatabase } from 'db/mongodb';
import { ShopInterface } from 'db/uiInterfaces';
import { alwaysString } from 'lib/arrayUtils';
import { getFieldStringLocale } from 'lib/i18n';
import { ObjectId } from 'mongodb';
import { ShopAddProductsListRouteReduced } from 'pages/cms/companies/[companyId]/shops/shop/[shopId]/products/add/[...filters]';

interface GetAddShopProductSsrDataInterface extends GetConsoleRubricProductsInputInterface {}

export async function getAddShopProductSsrData({
  locale,
  basePath,
  query,
  currency,
  companySlug,
}: GetAddShopProductSsrDataInterface): Promise<ShopAddProductsListRouteReduced | null> {
  const { db } = await getDatabase();
  const shopsCollection = db.collection<ShopInterface>(COL_SHOPS);
  const shopId = alwaysString(query.shopId);

  // console.log(' ');
  // console.log('>>>>>>>>>>>>>>>>>>>>>>>');
  // console.log('CompanyShopProductsList props ');
  // const startTime = new Date().getTime();

  // Get shop
  const shopAggregation = await shopsCollection
    .aggregate<ShopInterface>([
      {
        $match: { _id: new ObjectId(`${shopId}`) },
      },

      // get company
      {
        $lookup: {
          from: COL_COMPANIES,
          as: 'company',
          foreignField: '_id',
          localField: 'companyId',
        },
      },
      {
        $addFields: {
          company: {
            $arrayElemAt: ['$company', 0],
          },
        },
      },

      // get shop products
      {
        $lookup: {
          from: COL_SHOP_PRODUCTS,
          as: 'shopProducts',
          let: {
            shopId: '$_id',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$shopId', '$$shopId'],
                },
              },
            },
          ],
        },
      },
    ])
    .toArray();
  const shop = shopAggregation[0];
  if (!shop) {
    return null;
  }
  const excludedProductsIds = (shop.shopProducts || []).map(({ productId }) => productId);

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
    rubricId: rubric._id.toHexString(),
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