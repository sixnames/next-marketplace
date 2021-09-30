import { COL_PRODUCT_ASSETS, COL_PRODUCTS } from 'db/collectionNames';
import {
  brandPipeline,
  productAttributesPipeline,
  productCategoriesPipeline,
  productConnectionsSimplePipeline,
  productRubricPipeline,
  productSeoPipeline,
} from 'db/dao/constantPipelines';
import { getDatabase } from 'db/mongodb';
import {
  CategoryInterface,
  ProductConnectionInterface,
  ProductConnectionItemInterface,
  ProductInterface,
  RubricInterface,
} from 'db/uiInterfaces';
import { getFieldStringLocale } from 'lib/i18n';
import { getTreeFromList } from 'lib/optionsUtils';
import { generateCardTitle, generateSnippetTitle } from 'lib/titleUtils';
import { ObjectId } from 'mongodb';

interface GetCmsProductInterface {
  productId: string;
  locale: string;
}

interface GetCmsProductPayloadInterface {
  product: ProductInterface;
  rubric: RubricInterface;
  categoriesList: CategoryInterface[];
}

export async function getCmsProduct({
  productId,
  locale,
}: GetCmsProductInterface): Promise<GetCmsProductPayloadInterface | null> {
  const { db } = await getDatabase();
  const productsCollection = db.collection<ProductInterface>(COL_PRODUCTS);
  const productAggregation = await productsCollection
    .aggregate([
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

      // get product connections
      ...productConnectionsSimplePipeline,

      // get product seo info
      ...productSeoPipeline,
    ])
    .toArray();
  const initialProduct = productAggregation[0];
  if (!initialProduct) {
    return null;
  }

  const { rubric, ...restProduct } = initialProduct;
  if (!rubric) {
    return null;
  }
  const castedRubric: RubricInterface = {
    ...rubric,
    name: getFieldStringLocale(rubric.nameI18n, locale),
  };

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
  const snippetTitle = generateSnippetTitle(titleProps);

  // connections
  const connections: ProductConnectionInterface[] = [];
  for await (const productConnection of initialProduct.connections || []) {
    const connectionProducts: ProductConnectionItemInterface[] = [];
    for await (const connectionProduct of productConnection.connectionProducts || []) {
      if (connectionProduct.product) {
        const snippetTitle = generateSnippetTitle({
          locale,
          brand: connectionProduct.product.brand,
          rubricName: getFieldStringLocale(rubric.nameI18n, locale),
          showRubricNameInProductTitle: rubric.showRubricNameInProductTitle,
          showCategoryInProductTitle: rubric.showCategoryInProductTitle,
          attributes: connectionProduct.product.attributes,
          titleCategoriesSlugs: connectionProduct.product.titleCategoriesSlugs,
          originalName: connectionProduct.product.originalName,
          defaultGender: connectionProduct.product.gender,
          categories,
        });
        connectionProducts.push({
          ...connectionProduct,
          product: {
            ...connectionProduct.product,
            snippetTitle,
          },
          option: connectionProduct.option
            ? {
                ...connectionProduct.option,
                name: getFieldStringLocale(connectionProduct.option?.nameI18n, locale),
              }
            : null,
        });
      }
    }

    connections.push({
      ...productConnection,
      attribute: productConnection.attribute
        ? {
            ...productConnection.attribute,
            name: getFieldStringLocale(productConnection.attribute?.nameI18n, locale),
          }
        : null,
      connectionProducts,
    });
  }

  // attributes
  const attributes = (initialProduct.attributes || []).map((productAttribute) => {
    return {
      ...productAttribute,
      name: getFieldStringLocale(productAttribute.nameI18n, locale),
    };
  });

  const product: ProductInterface = {
    ...initialProduct,
    cardTitle,
    snippetTitle,
    connections,
    attributes,
  };

  return {
    product,
    rubric: castedRubric,
    categoriesList: initialProduct.categories || [],
  };
}
