import Inner from 'components/Inner/Inner';
import {
  ATTRIBUTE_VARIANT_MULTIPLE_SELECT,
  ATTRIBUTE_VARIANT_NUMBER,
  ATTRIBUTE_VARIANT_SELECT,
  ATTRIBUTE_VARIANT_STRING,
  SORT_DESC,
} from 'config/common';
import { COL_PRODUCT_ATTRIBUTES, COL_PRODUCTS, COL_RUBRIC_ATTRIBUTES } from 'db/collectionNames';
import { AttributeVariantModel, ProductModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import {
  ProductAttributeInterface,
  ProductAttributesGroupASTInterface,
  ProductInterface,
} from 'db/uiInterfaces';
import CmsProductLayout from 'layout/CmsLayout/CmsProductLayout';
import { getFieldStringLocale } from 'lib/i18n';
import { ObjectId } from 'mongodb';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';

interface ProductAttributesInterface {
  product: ProductModel;
}

const ProductAttributes: React.FC<ProductAttributesInterface> = ({ product }) => {
  console.log(product);
  return (
    <CmsProductLayout product={product}>
      <Inner></Inner>
    </CmsProductLayout>
  );
};

interface ProductPageInterface extends PagePropsInterface, ProductAttributesInterface {}

const Product: NextPage<ProductPageInterface> = ({ pageUrls, product }) => {
  return (
    <CmsLayout pageUrls={pageUrls}>
      <ProductAttributes product={product} />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<ProductPageInterface>> => {
  const { query } = context;
  const { productId } = query;
  const db = await getDatabase();
  const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
  const { props } = await getAppInitialData({ context, isCms: true });
  if (!props || !productId) {
    return {
      notFound: true,
    };
  }

  const productAggregation = await productsCollection
    .aggregate<ProductInterface>([
      {
        $match: {
          _id: new ObjectId(`${productId}`),
        },
      },
      {
        $lookup: {
          from: COL_PRODUCT_ATTRIBUTES,
          as: 'attributes',
          let: { productId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$$productId', '$productId'],
                },
              },
            },
            {
              $sort: {
                variant: SORT_DESC,
                _id: SORT_DESC,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: COL_RUBRIC_ATTRIBUTES,
          as: 'rubricAttributesAST',
          let: { rubricId: '$rubricId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$$rubricId', '$rubricId'],
                },
              },
            },
            {
              $sort: {
                variant: SORT_DESC,
                _id: SORT_DESC,
              },
            },
            {
              $group: {
                _id: '$variant',
                attributes: {
                  $push: {
                    attributeId: '$attributeId',
                    slug: '$slug',
                    nameI18n: '$nameI18n',
                    viewVariant: '$viewVariant',
                  },
                },
              },
            },
          ],
        },
      },
    ])
    .toArray();
  const product = productAggregation[0];
  if (!product) {
    return {
      notFound: true,
    };
  }

  // Cast rubric attributes to product attributes
  const { attributes, rubricAttributesAST, ...restProduct } = product;
  let stringAttributesAST: ProductAttributesGroupASTInterface | null = null;
  let numberAttributesAST: ProductAttributesGroupASTInterface | null = null;
  let multipleSelectAttributesAST: ProductAttributesGroupASTInterface | null = null;
  let selectAttributesAST: ProductAttributesGroupASTInterface | null = null;

  for await (const rubricAttributesASTGroup of rubricAttributesAST || []) {
    const variant = rubricAttributesASTGroup._id;
    const astGroup: ProductAttributesGroupASTInterface = {
      _id: variant,
      attributes: [],
    };

    for await (const rubricAttributeAST of rubricAttributesASTGroup.attributes) {
      const productAttributes = attributes || [];
      const currentProductAttribute = productAttributes.find(({ attributeId }) => {
        return attributeId.equals(rubricAttributeAST.attributeId);
      });
      // console.log(currentProductAttribute, rubricAttributeAST.attributeId);
      if (currentProductAttribute) {
        astGroup.attributes.push(currentProductAttribute);
        continue;
      }

      const { attributeId, nameI18n, slug, viewVariant } = rubricAttributeAST;
      const newProductAttribute: ProductAttributeInterface = {
        _id: new ObjectId(),
        attributeId,
        productId: product._id,
        productSlug: product.slug,
        attributeNameI18n: nameI18n,
        attributeName: getFieldStringLocale(nameI18n, props.sessionLocale),
        attributeViewVariant: viewVariant,
        attributeVariant: variant as AttributeVariantModel,
        attributeSlug: slug,
        selectedOptionsIds: [],
        optionsValueI18n: {},
        selectedOptionsSlugs: [],
        attributeMetric: null,
        number: undefined,
        textI18n: {},
        showAsBreadcrumb: false,
        showInCard: true,
      };

      astGroup.attributes.push(newProductAttribute);
    }

    if (variant === ATTRIBUTE_VARIANT_STRING) {
      stringAttributesAST = astGroup;
    }

    if (variant === ATTRIBUTE_VARIANT_NUMBER) {
      numberAttributesAST = astGroup;
    }

    if (variant === ATTRIBUTE_VARIANT_SELECT) {
      multipleSelectAttributesAST = astGroup;
    }

    if (variant === ATTRIBUTE_VARIANT_MULTIPLE_SELECT) {
      selectAttributesAST = astGroup;
    }
  }

  const finalProduct: ProductInterface = {
    ...restProduct,
    stringAttributesAST,
    numberAttributesAST,
    multipleSelectAttributesAST,
    selectAttributesAST,
  };
  // console.log(JSON.stringify(product.rubricAttributes, null, 2));
  return {
    props: {
      ...props,
      product: castDbData(finalProduct),
    },
  };
};

export default Product;
