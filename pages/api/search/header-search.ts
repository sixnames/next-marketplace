import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import {
  DEFAULT_COMPANY_SLUG,
  HEADER_SEARCH_PRODUCTS_LIMIT,
  REQUEST_METHOD_POST,
  SORT_DESC,
} from '../../../config/common';
import { COL_SHOP_PRODUCTS } from '../../../db/collectionNames';
import { ignoreNoImageStage, summaryPipeline } from '../../../db/dao/constantPipelines';
import { ObjectIdModel } from '../../../db/dbModels';
import { getDatabase } from '../../../db/mongodb';
import { ShopProductInterface } from '../../../db/uiInterfaces';
import { getAlgoliaProductsSearch } from '../../../lib/algolia/productAlgoliaUtils';
import { getFieldStringLocale } from '../../../lib/i18n';
import { noNaN } from '../../../lib/numbers';
import { getRequestParams } from '../../../lib/sessionHelpers';

export interface HeaderSearchPayloadInterface {
  shopProducts: ShopProductInterface[];
}

export interface HeaderSearchInputInterface {
  search?: string;
  companyId?: string;
  companySlug?: string;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== REQUEST_METHOD_POST) {
    res.status(405).send({
      success: false,
      message: 'wrong method',
    });
    return;
  }

  const shopProducts: ShopProductInterface[] = [];

  try {
    const { city, locale } = await getRequestParams({ req, res });
    const { db } = await getDatabase();
    const shopProductsCollection = db.collection<ShopProductInterface>(COL_SHOP_PRODUCTS);
    const args = JSON.parse(req.body) as HeaderSearchInputInterface;
    const { search, companyId } = args;
    const companySlug = args.companySlug || DEFAULT_COMPANY_SLUG;

    let searchStage = {};
    let searchIds: ObjectIdModel[] = [];
    if (search) {
      searchIds = await getAlgoliaProductsSearch({
        search,
      });
      searchStage = {
        productId: {
          $in: searchIds,
        },
      };
    }
    if (search && searchIds.length < 1) {
      res.status(200).send({
        shopProducts,
      });
      return;
    }

    const companyMatch = companyId
      ? {
          companyId: new ObjectId(companyId),
        }
      : {};

    const match = {
      ...searchStage,
      ...companyMatch,
      citySlug: city,
      ...ignoreNoImageStage,
    };

    const shopProductsAggregation = await shopProductsCollection
      .aggregate<ShopProductInterface>([
        {
          $match: match,
        },
        {
          $group: {
            _id: '$productId',
            itemId: { $first: '$itemId' },
            rubricId: { $first: '$rubricId' },
            rubricSlug: { $first: `$rubricSlug` },
            brandSlug: { $first: '$brandSlug' },
            brandCollectionSlug: { $first: '$brandCollectionSlug' },
            views: { $max: `$views.${companySlug}.${city}` },
            priorities: { $max: `$priorities.${companySlug}.${city}` },
            minPrice: {
              $min: '$price',
            },
            maxPrice: {
              $min: '$price',
            },
            available: {
              $max: '$available',
            },
            filterSlugs: {
              $first: '$filterSlugs',
            },
            shopProductsIds: {
              $addToSet: '$_id',
            },
          },
        },
        {
          $sort: {
            priorities: SORT_DESC,
            views: SORT_DESC,
            _id: SORT_DESC,
          },
        },
        {
          $limit: HEADER_SEARCH_PRODUCTS_LIMIT,
        },

        // get shop product fields
        ...summaryPipeline('$_id'),

        {
          $addFields: {
            shopsCount: { $size: '$shopProductsIds' },
            cardPrices: {
              min: '$minPrice',
              max: '$maxPrice',
            },
          },
        },
      ])
      .toArray();

    shopProductsAggregation.forEach((shopProduct) => {
      const { summary, shopsCount, ...restShopProduct } = shopProduct;
      if (!summary) {
        return;
      }

      shopProducts.push({
        ...restShopProduct,
        summary: {
          ...summary,
          shopsCount,
          minPrice: noNaN(shopProduct.minPrice),
          maxPrice: noNaN(shopProduct.maxPrice),
          name: getFieldStringLocale(summary?.nameI18n, locale),
          snippetTitle: getFieldStringLocale(summary?.snippetTitleI18n, locale),
          variants: [],
        },
      });
    });

    res.status(200).send({
      shopProducts,
    });
    return;
  } catch (e) {
    console.log(e);
    res.status(200).send({
      shopProducts,
    });
    return;
  }
};
