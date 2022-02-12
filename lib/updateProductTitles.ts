import { exec } from 'child_process';
import { COL_LANGUAGES, COL_PRODUCT_SUMMARIES } from 'db/collectionNames';
import {
  brandPipeline,
  productAttributesPipeline,
  productCategoriesPipeline,
  productRubricPipeline,
} from 'db/dao/constantPipelines';
import { LanguageModel, ProductSummaryModel, TranslationModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { ProductSummaryInterface } from 'db/uiInterfaces';
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
        {
          $project: {
            _id: true,
            rubric: true,
            attributes: true,
            categories: true,
            titleCategorySlugs: true,
            originalName: true,
            gender: true,
            brand: true,
          },
        },
      ])
      .toArray();

    for await (const initialProduct of products) {
      const { rubric, attributes, categories, titleCategorySlugs, originalName, gender, brand } =
        initialProduct;
      if (!rubric) {
        return false;
      }

      // update titles
      const cardTitleI18n: TranslationModel = {};
      const snippetTitleI18n: TranslationModel = {};
      for await (const locale of locales) {
        const categoriesTree = getTreeFromList({
          list: categories,
          childrenFieldName: 'categories',
          locale,
        });

        const titleProps: GenerateCardTitleInterface = {
          locale,
          attributes,
          titleCategorySlugs,
          originalName,
          brand,
          defaultGender: gender,
          categories: categoriesTree,
          rubricName: getFieldStringLocale(rubric.nameI18n, locale),
          showRubricNameInProductTitle: rubric.showRubricNameInProductTitle,
          showCategoryInProductTitle: rubric.showCategoryInProductTitle,
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
