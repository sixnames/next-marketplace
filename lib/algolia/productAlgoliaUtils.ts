import { HITS_PER_PAGE, ID_COUNTER_DIGITS } from 'config/common';
import { COL_LANGUAGES, COL_PRODUCT_ASSETS, COL_PRODUCTS } from 'db/collectionNames';
import {
  brandPipeline,
  productAttributesPipeline,
  productCategoriesPipeline,
  productRubricPipeline,
} from 'db/dao/constantPipelines';
import { ObjectIdModel, TranslationModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { ProductInterface } from 'db/uiInterfaces';
import { getAlgoliaClient, saveAlgoliaObjects } from 'lib/algolia/algoliaUtils';
import { getFieldStringLocale } from 'lib/i18n';
import { getTreeFromList } from 'lib/optionUtils';
import { generateCardTitle, generateSnippetTitle } from 'lib/titleUtils';
import { ObjectId } from 'mongodb';
import addZero from 'add-zero';

export function getAlgoliaProductsIndex() {
  const { algoliaIndex } = getAlgoliaClient(`${process.env.ALG_INDEX_PRODUCTS}`);
  return algoliaIndex;
}

interface AlgoliaProductInterface {
  _id: string;
  objectID: string;
  cardTitleI18n: TranslationModel;
  snippetTitleI18n: TranslationModel;
  barcode?: string[] | null;
  slug: string;
}

export async function updateAlgoliaProducts(match?: Record<any, any>) {
  const { db } = await getDatabase();
  const productsCollection = db.collection<ProductInterface>(COL_PRODUCTS);
  const languagesCollection = db.collection<ProductInterface>(COL_LANGUAGES);
  const languages = await languagesCollection.find({}).toArray();
  const locales = languages.map(({ slug }) => slug);

  const aggregationMatch = match
    ? [
        {
          $match: match,
        },
      ]
    : [];

  const products = await productsCollection
    .aggregate<ProductInterface>([
      ...aggregationMatch,

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

  const algoliaProducts: AlgoliaProductInterface[] = [];

  for await (const initialProduct of products) {
    const { rubric, ...restProduct } = initialProduct;
    if (!rubric) {
      return false;
    }

    let algoliaProduct: AlgoliaProductInterface = {
      _id: initialProduct._id.toHexString(),
      slug: initialProduct.slug,
      objectID: initialProduct._id.toHexString(),
      barcode: initialProduct.barcode,
      cardTitleI18n: {},
      snippetTitleI18n: {},
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
    algoliaProducts.push(algoliaProduct);
  }

  if (algoliaProducts.length > 0) {
    const algoliaProductResult = await saveAlgoliaObjects({
      indexName: `${process.env.ALG_INDEX_PRODUCTS}`,
      objects: algoliaProducts,
    });

    if (!algoliaProductResult) {
      console.log('updateAlgoliaProducts algolia error');
      return false;
    }
  }

  return true;
}

interface GetAlgoliaProductsSearch {
  search: string;
  excludedProductsIds?: ObjectIdModel[] | null;
}

export async function getAlgoliaProductsSearch({
  search,
  excludedProductsIds,
}: GetAlgoliaProductsSearch): Promise<ObjectId[]> {
  const { db } = await getDatabase();
  const productsCollection = db.collection<ProductInterface>(COL_PRODUCTS);
  const algoliaIndex = getAlgoliaProductsIndex();
  const searchIds: ObjectId[] = [];
  try {
    if (!search) {
      return searchIds;
    }
    const productBySlug = await productsCollection.findOne({
      slug: addZero(search, ID_COUNTER_DIGITS),
    });
    if (productBySlug) {
      return [productBySlug._id];
    }

    const { hits } = await algoliaIndex.search<AlgoliaProductInterface>(search, {
      hitsPerPage: HITS_PER_PAGE,
      // optionalWords: `${search}`.split(' ').slice(1),
    });

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
}
