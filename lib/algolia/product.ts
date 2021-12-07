import { HITS_PER_PAGE } from 'config/common';
import {
  COL_LANGUAGES,
  COL_PRODUCT_ASSETS,
  COL_PRODUCTS,
  COL_SHOP_PRODUCTS,
} from 'db/collectionNames';
import {
  brandPipeline,
  productAttributesPipeline,
  productCategoriesPipeline,
  productRubricPipeline,
} from 'db/dao/constantPipelines';
import { ObjectIdModel, ShopProductModel, TranslationModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { ProductInterface, ShopProductInterface } from 'db/uiInterfaces';
import { getAlgoliaClient, saveAlgoliaObjects } from 'lib/algolia/algoliaUtils';
import { getFieldStringLocale } from 'lib/i18n';
import { getTreeFromList } from 'lib/optionUtils';
import { generateCardTitle, generateSnippetTitle } from 'lib/titleUtils';
import { ObjectId } from 'mongodb';

interface AlgoliaProductInterface {
  _id: string;
  objectID: string;
  cardTitleI18n: TranslationModel;
  snippetTitleI18n: TranslationModel;
  barcode?: string[] | null;
  slug: string;
  shopProductItemIds: string[];
}

export async function updateAlgoliaProduct(productId: ObjectIdModel) {
  const { db } = await getDatabase();
  const productsCollection = db.collection<ProductInterface>(COL_PRODUCTS);
  const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
  const languagesCollection = db.collection<ProductInterface>(COL_LANGUAGES);
  const languages = await languagesCollection.find({}).toArray();
  const locales = languages.map(({ slug }) => slug);

  const productAggregation = await productsCollection
    .aggregate<ProductInterface>([
      {
        $match: {
          _id: new ObjectId(productId),
        },
      },

      // get product assets
      {
        $lookup: {
          as: 'assets',
          from: COL_PRODUCT_ASSETS,
          localField: '_id',
          foreignField: 'productId',
        },
      },
      {
        $addFields: {
          assets: {
            $arrayElemAt: ['$assets', 0],
          },
        },
      },

      // get product rubric
      ...productRubricPipeline,

      // get product attributes
      ...productAttributesPipeline,

      // get product brand
      ...brandPipeline,

      // get product categories
      ...productCategoriesPipeline(),
    ])
    .toArray();
  const initialProduct = productAggregation[0];
  if (!initialProduct) {
    return false;
  }

  const { rubric, ...restProduct } = initialProduct;
  if (!rubric) {
    return false;
  }

  const shopProducts = await shopProductsCollection
    .aggregate([
      {
        $match: {
          productId: initialProduct._id,
        },
      },
      {
        $project: {
          _id: false,
          itemId: true,
        },
      },
    ])
    .toArray();

  let algoliaProduct: AlgoliaProductInterface = {
    _id: initialProduct._id.toHexString(),
    slug: initialProduct.slug,
    objectID: initialProduct._id.toHexString(),
    barcode: initialProduct.barcode,
    cardTitleI18n: {},
    snippetTitleI18n: {},
    shopProductItemIds: shopProducts.map(({ itemId }) => itemId),
  };

  for await (const locale of locales) {
    const categories = getTreeFromList({
      list: initialProduct.categories,
      childrenFieldName: 'categories',
      locale,
    });

    // title
    const titleProps = {
      locale,
      brand: initialProduct.brand,
      rubricName: getFieldStringLocale(rubric.nameI18n, locale),
      showRubricNameInProductTitle: rubric.showRubricNameInProductTitle,
      showCategoryInProductTitle: rubric.showCategoryInProductTitle,
      attributes: initialProduct.attributes,
      titleCategoriesSlugs: restProduct.titleCategoriesSlugs,
      originalName: restProduct.originalName,
      defaultGender: restProduct.gender,
      categories,
    };
    const cardTitle = generateCardTitle(titleProps);
    algoliaProduct.cardTitleI18n[locale] = cardTitle;
    const snippetTitle = generateSnippetTitle(titleProps);
    algoliaProduct.snippetTitleI18n[locale] = snippetTitle;
  }

  const algoliaProductResult = await saveAlgoliaObjects({
    indexName: `${process.env.ALG_INDEX_PRODUCTS}`,
    objects: [algoliaProduct],
  });
  if (!algoliaProductResult) {
    console.log('algolia error');
    return false;
  }

  return true;
}

interface GetAlgoliaProductsSearch {
  search: string;
  excludedProductsIds?: ObjectIdModel[] | null;
}

export const getAlgoliaProductsSearch = async ({
  search,
  excludedProductsIds,
}: GetAlgoliaProductsSearch): Promise<ObjectId[]> => {
  const { algoliaIndex } = getAlgoliaClient(`${process.env.ALG_INDEX_PRODUCTS}`);
  const searchIds: ObjectId[] = [];
  try {
    const { hits } = await algoliaIndex.search<ProductInterface | ShopProductInterface>(
      `${search}`,
      {
        hitsPerPage: HITS_PER_PAGE,
        // optionalWords: `${search}`.split(' ').slice(1),
      },
    );
    hits.forEach((hit) => {
      const hitId = new ObjectId(hit._id);
      const exist = (excludedProductsIds || []).some((_id) => {
        return _id.equals(hitId);
      });

      if (!exist) {
        searchIds.push(hitId);
      }
    });

    return searchIds;
  } catch (e) {
    console.log(e);
    return searchIds;
  }
};
