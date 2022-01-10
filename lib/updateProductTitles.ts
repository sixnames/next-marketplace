import { exec } from 'child_process';
import { COL_LANGUAGES, COL_PRODUCT_SUMMARIES } from '../db/collectionNames';
import {
  brandPipeline,
  productAttributesPipeline,
  productCategoriesPipeline,
  productRubricPipeline,
} from '../db/dao/constantPipelines';
import { LanguageModel, ProductSummaryModel, TranslationModel } from '../db/dbModels';
import { getDatabase } from '../db/mongodb';
import { ProductSummaryInterface } from '../db/uiInterfaces';
import { updateAlgoliaProducts } from './algolia/productAlgoliaUtils';
import { getFieldStringLocale } from './i18n';
import { generateCardTitle, GenerateCardTitleInterface, generateSnippetTitle } from './titleUtils';
import { getTreeFromList } from './treeUtils';

export async function updateProductTitles(match?: Record<any, any>) {
  try {
    const { db } = await getDatabase();
    const productSummariesCollection = db.collection<ProductSummaryModel>(COL_PRODUCT_SUMMARIES);
    const languagesCollection = db.collection<LanguageModel>(COL_LANGUAGES);
    const languages = await languagesCollection.find({}).toArray();
    const locales = languages.map(({ slug }) => slug);

    const aggregationMatch = match
      ? [
          {
            $match: match,
          },
        ]
      : [];

    const products = await productSummariesCollection
      .aggregate<ProductSummaryInterface>([
        ...aggregationMatch,

        // get product rubric
        ...productRubricPipeline,

        // get product attributes
        ...productAttributesPipeline(),

        // get product brand
        ...brandPipeline,

        // get product categories
        ...productCategoriesPipeline(),
      ])
      .toArray();

    for await (const initialProduct of products) {
      const { rubric, ...restProduct } = initialProduct;
      if (!rubric) {
        return false;
      }

      // update titles
      const cardTitleI18n: TranslationModel = {};
      const snippetTitleI18n: TranslationModel = {};
      for await (const locale of locales) {
        const categories = getTreeFromList({
          list: initialProduct.categories,
          childrenFieldName: 'categories',
          locale,
        });

        const titleProps: GenerateCardTitleInterface = {
          locale,
          brand: initialProduct.brand,
          rubricName: getFieldStringLocale(rubric.nameI18n, locale),
          showRubricNameInProductTitle: rubric.showRubricNameInProductTitle,
          showCategoryInProductTitle: rubric.showCategoryInProductTitle,
          attributes: initialProduct.attributes,
          titleCategorySlugs: restProduct.titleCategorySlugs,
          originalName: restProduct.originalName,
          defaultGender: restProduct.gender,
          categories,
        };
        const cardTitle = generateCardTitle(titleProps);
        cardTitleI18n[locale] = cardTitle;
        const snippetTitle = generateSnippetTitle(titleProps);
        snippetTitleI18n[locale] = snippetTitle;
      }
      await productSummariesCollection.findOneAndUpdate(
        {
          _id: initialProduct._id,
        },
        {
          $set: {
            cardTitleI18n,
            snippetTitleI18n,
          },
        },
      );

      // update algolia index
      await updateAlgoliaProducts({ _id: initialProduct._id });
    }
    return true;
  } catch (e) {
    console.log('updateProductTitlesInterface error ', e);
    return false;
  }
}

export function execUpdateProductTitles(param: string) {
  exec(`yarn update-product-titles ${param}`);
}
