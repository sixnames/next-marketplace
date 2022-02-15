import { ROLE_SLUG_ADMIN, SORT_DESC } from 'lib/config/common';
import { COL_PRODUCT_SUMMARIES, COL_SHOP_PRODUCTS } from 'db/collectionNames';
import { ignoreNoImageStage } from 'db/utils/constantPipelines';
import { ProductSummaryModel, ShopProductModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import xlsx, { IJsonSheet, ISettings } from 'json-as-xlsx';
import { alwaysArray, alwaysString } from 'lib/arrayUtils';
import { castUrlFilters } from 'lib/castUrlFilters';
import { getFieldStringLocale } from 'lib/i18n';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { getRequestParams, getSessionRole } from 'lib/sessionHelpers';
import addZero from 'add-zero';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { db } = await getDatabase();
    const { locale } = await getRequestParams({ req, res });
    const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
    const productSummariesCollection = db.collection<ProductSummaryModel>(COL_PRODUCT_SUMMARIES);

    const { role } = await getSessionRole({ req, res });
    if (role.slug !== ROLE_SLUG_ADMIN) {
      res.status(401).send({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const date = currentDate.getDate();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const dateString = `${addZero(date, 2)}.${addZero(month, 2)}.${year}_${addZero(
      hours,
      2,
    )}_${addZero(minutes, 2)}`;

    // get filters
    const [shopId, rubricSlug, ...filters] = alwaysArray(req.query.filters);

    // cast selected filters
    const {
      rubricFilters,
      brandStage,
      brandCollectionStage,
      optionsStage,
      pricesStage,
      searchStage,
      noSearchResults,
    } = await castUrlFilters({
      search: alwaysString(req.query.search),
      filters,
      searchFieldName: 'productId',
    });

    // if no search results
    if (noSearchResults) {
      res.status(200).send({
        success: false,
        message: 'no search results',
      });
      return;
    }

    // rubric stage
    let rubricStage: Record<any, any> = rubricSlug
      ? {
          rubricSlug,
        }
      : {};
    if (rubricFilters && rubricFilters.length > 0) {
      rubricStage = {
        rubricSlug: {
          $in: rubricFilters,
        },
      };
    }

    // get shop products
    const shopProductsAggregationResult = await shopProductsCollection
      .aggregate<ShopProductModel>([
        {
          $match: {
            shopId: new ObjectId(shopId),
            ...rubricStage,
            ...brandStage,
            ...brandCollectionStage,
            ...optionsStage,
            ...ignoreNoImageStage,
            ...pricesStage,
            ...searchStage,
          },
        },
        {
          $project: {
            _id: true,
            productId: true,
            price: true,
            available: true,
            barcode: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        {
          $sort: {
            _id: SORT_DESC,
          },
        },
      ])
      .toArray();

    // get summaries
    const summaryIds = shopProductsAggregationResult.map(({ productId }) => productId);
    const summaryAggregationResult = await productSummariesCollection
      .aggregate<ProductSummaryModel>([
        {
          $match: {
            _id: {
              $in: summaryIds,
            },
          },
        },
        {
          $project: {
            _id: true,
            itemId: true,
            mainImage: true,
            cardTitleI18n: true,
          },
        },
      ])
      .toArray();

    const fileData: IJsonSheet = {
      sheet: dateString,
      columns: [
        { label: 'Фото', value: 'mainImage' },
        { label: 'Артикул', value: 'itemId' },
        { label: 'Название', value: 'name' },
        { label: 'Цена', value: 'price' },
        { label: 'В наличии', value: 'available' },
        { label: 'Штрихкод', value: 'barcode' },
      ],
      content: [],
    };

    for await (const shopProduct of shopProductsAggregationResult) {
      const summary = summaryAggregationResult.find(({ _id }) => {
        return _id.equals(shopProduct.productId);
      });
      if (!summary) {
        return;
      }

      fileData.content.push({
        mainImage: `https://${req.headers.host}${summary.mainImage}`,
        itemId: summary.itemId,
        name: getFieldStringLocale(summary.cardTitleI18n, locale),
        price: shopProduct.price,
        available: shopProduct.available,
        barcode: alwaysArray(shopProduct.barcode).join(', '),
      });
    }

    // throw 'temp';
    const settings: ISettings = {
      fileName: 'MySpreadsheet',
      extraLength: 3, // A bigger number means that columns will be wider
      writeOptions: {
        type: 'buffer',
        bookType: 'xlsx',
      },
    };

    const file = xlsx([fileData], settings);
    if (file) {
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment; filename=${dateString}.xlsx`);
      res.send(file);
      return;
    }

    res.status(500).send({
      success: false,
      message: 'Server Error',
    });
    return;
  } catch (e) {
    console.log('/api/xlsx/shop-products error', e);
    res.status(500).send({
      success: false,
      message: 'Server Error',
    });
    return;
  }
};
