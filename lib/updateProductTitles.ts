import { exec } from 'child_process';
import { COL_LANGUAGES, COL_PRODUCT_FACETS, COL_PRODUCT_SUMMARIES } from 'db/collectionNames';
import {
  brandPipeline,
  productAttributesPipeline,
  productCategoriesPipeline,
  productRubricPipeline,
} from 'db/dao/constantPipelines';
import {
  LanguageModel,
  ProductFacetModel,
  ProductSummaryModel,
  TranslationModel,
} from 'db/dbModels';
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
require('dotenv').config();

/*async function getLogger(fileName: string) {
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
}*/

export async function updateProductTitles(match?: Record<any, any>) {
  const { db, client } = await getProdDb({
    dbName: `${process.env.MONGO_DB_NAME}`,
    uri: `${process.env.MONGO_URL}`,
  });
  const productFacetsCollection = db.collection<ProductFacetModel>(COL_PRODUCT_FACETS);
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

  const facets = await productFacetsCollection
    .aggregate<ProductFacetModel>(
      [
        ...aggregationMatch,
        {
          $project: {
            _id: true,
          },
        },
      ],
      {
        allowDiskUse: true,
      },
    )
    .toArray();
  console.log(`\nTotal products count ${facets.length}\n`);
  console.log(`Match \n${JSON.stringify(match, null, 2)}\n`);

  for await (const [index, facet] of facets.entries()) {
    const productAggregation = await productSummariesCollection
      .aggregate<ProductSummaryInterface>(
        [
          {
            $match: {
              _id: facet._id,
            },
          },

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
    const summary = productAggregation[0];
    if (!summary) {
      console.log(`No summary ${facet._id}`);
      continue;
    }

    const { rubric, attributes, categories, titleCategorySlugs, originalName, gender, brand } =
      summary;
    if (!rubric) {
      console.log(`No rubric ${originalName}`);
      console.log(JSON.stringify(summary, null, 2));
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
        _id: summary._id,
      },
      {
        $set: {
          cardTitleI18n,
          snippetTitleI18n,
        },
      },
    );

    // update algolia index
    await updateAlgoliaProducts({ _id: summary._id });

    const counter = index + 1;
    if (counter % 1000 === 0) {
      console.log(`${counter}`);
    }
  }
  console.log(`Done >>>>>>>>>>>>>>>>>>>>>>>>>>>>>`);
  await client.close();
  return true;
}

export function execUpdateProductTitles(param: string) {
  exec(
    `node -r esbuild-register db/dao/childProcess/updateProductTitlesInChildProcess.ts ${param}`,
    (error, _stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        // return;
      }

      if (stderr) {
        console.log(`stderr: ${stderr}`);
        // return;
      }

      console.log(`stdout:\n${_stdout}`);
    },
  );
}
