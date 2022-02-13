import addZero from 'add-zero';
import { exec } from 'child_process';
import { COL_LANGUAGES, COL_PRODUCT_SUMMARIES } from 'db/collectionNames';
import {
  brandPipeline,
  productAttributesPipeline,
  productCategoriesPipeline,
  productRubricPipeline,
} from 'db/dao/constantPipelines';
import { LanguageModel, ProductSummaryModel, TranslationModel } from 'db/dbModels';
import { ProductSummaryInterface } from 'db/uiInterfaces';
import { updateAlgoliaProducts } from 'lib/algolia/productAlgoliaUtils';
import { getFieldStringLocale } from 'lib/i18n';
import {
  generateCardTitle,
  GenerateCardTitleInterface,
  generateSnippetTitle,
} from 'lib/titleUtils';
import { getTreeFromList } from 'lib/treeUtils';
import { getProdDb } from 'tests/testUtils/getProdDb';
import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp';
require('dotenv').config();

async function getLogger(fileName: string) {
  const dirPath = path.join(process.cwd(), 'log');
  await mkdirp(dirPath);
  const logPath = path.join(dirPath, `${fileName}.txt`);

  function logger(message: string) {
    const exist = fs.existsSync(logPath);

    if (!exist) {
      fs.writeFileSync(logPath, message);
      return;
    }

    const file = fs.readFileSync(logPath);
    fs.writeFileSync(logPath, `${file.toString()} \n${message}`);
  }
  return logger;
}

function getLogFileDateName() {
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
  return dateString;
}

export async function updateProductTitles(match?: Record<any, any>) {
  const { db, client } = await getProdDb({
    dbName: `${process.env.MONGO_DB_NAME}`,
    uri: `${process.env.MONGO_URL}`,
  });
  const productSummariesCollection = db.collection<ProductSummaryModel>(COL_PRODUCT_SUMMARIES);
  const languagesCollection = db.collection<LanguageModel>(COL_LANGUAGES);
  const languages = await languagesCollection.find({}).toArray();
  const locales = languages.map(({ slug }) => slug);
  const fileName = getLogFileDateName();
  const logger = await getLogger(fileName);

  const aggregationMatch = match
    ? [
        {
          $match: match,
        },
      ]
    : [];

  const products = await productSummariesCollection
    .aggregate<ProductSummaryInterface>(
      [
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
      ],
      {
        allowDiskUse: true,
      },
    )
    .toArray();

  logger(`\n\nTotal products count ${products.length}\n`);
  logger(`Match \n${JSON.stringify(match, null, 2)}\n`);

  for await (const [index, initialProduct] of products.entries()) {
    const { rubric, attributes, categories, titleCategorySlugs, originalName, gender, brand } =
      initialProduct;
    // const { rubric, originalName } = initialProduct;
    if (!rubric) {
      logger(`No rubric ${originalName}`);
      logger(JSON.stringify(initialProduct, null, 2));
      continue;
    }

    // update titles
    const cardTitleI18n: TranslationModel = {};
    const snippetTitleI18n: TranslationModel = {};
    locales.forEach((locale) => {
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
    });

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

    /*logger(
      JSON.stringify(
        {
          updatedProductResult: updatedProductResult.ok,
          cardTitleI18n,
          snippetTitleI18n,
        },
        null,
        2,
      ),
    );*/

    // update algolia index
    await updateAlgoliaProducts({ _id: initialProduct._id });

    const counter = index + 1;
    if (counter % 10 === 0) {
      logger(`${counter}`);
    }
  }
  logger(`Done >>>>>>>>>>>>>>>>>>>>>>>>>>>>>`);
  await client.close();
  return true;
}

export function execUpdateProductTitles(param: string) {
  const fileName = getLogFileDateName();
  getLogger(`${fileName}_execUpdateProductTitles_result`).then((logger) => {
    exec(
      `node -r esbuild-register db/dao/childProcess/updateProductTitlesInChildProcess.ts ${param}`,
      (error, _stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`);
          logger(`error: ${error.message}`);
          return;
        }

        if (stderr) {
          console.log(`stderr: ${stderr}`);
          logger(`stderr: ${stderr}`);
          return;
        }

        // console.log(`stdout:\n${stdout}`);
        // logger(`stdout:\n${stdout}`);
      },
    );
  });
}
