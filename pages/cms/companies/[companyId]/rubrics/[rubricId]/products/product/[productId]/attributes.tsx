import ConsoleRubricProductAttributes from 'components/console/ConsoleRubricProductAttributes';
import {
  ATTRIBUTE_VARIANT_MULTIPLE_SELECT,
  ATTRIBUTE_VARIANT_NUMBER,
  ATTRIBUTE_VARIANT_SELECT,
  ATTRIBUTE_VARIANT_STRING,
  ROUTE_CMS,
} from 'config/common';
import { COL_ATTRIBUTES_GROUPS, COL_COMPANIES } from 'db/collectionNames';
import { rubricAttributesGroupAttributesPipeline } from 'db/dao/constantPipelines';
import { ObjectIdModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import {
  ProductAttributeInterface,
  ProductInterface,
  AttributesGroupInterface,
  ProductAttributesGroupInterface,
  CompanyInterface,
} from 'db/uiInterfaces';
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import CmsProductLayout from 'layout/cms/CmsProductLayout';
import { getFieldStringLocale } from 'lib/i18n';
import { sortByName } from 'lib/optionsUtils';
import { getAttributeReadableValue } from 'lib/productAttributesUtils';
import { getCmsProduct } from 'lib/productUtils';
import { ObjectId } from 'mongodb';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import CmsLayout from 'layout/cms/CmsLayout';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';

interface ProductAttributesInterface {
  product: ProductInterface;
  routeBasePath: string;
  currentCompany?: CompanyInterface | null;
}

const ProductAttributes: React.FC<ProductAttributesInterface> = ({
  product,
  currentCompany,
  routeBasePath,
}) => {
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Атрибуты',
    config: [
      {
        name: 'Компании',
        href: `${ROUTE_CMS}/companies`,
      },
      {
        name: `${currentCompany?.name}`,
        href: routeBasePath,
      },
      {
        name: `Рубрикатор`,
        href: `${routeBasePath}/rubrics`,
      },
      {
        name: `${product.rubric?.name}`,
        href: `${routeBasePath}/rubrics/${product.rubric?._id}`,
      },
      {
        name: `Товары`,
        href: `${routeBasePath}/rubrics/${product.rubric?._id}/products/${product.rubric?._id}`,
      },
      {
        name: `${product.snippetTitle}`,
        href: `${routeBasePath}/rubrics/${product.rubric?._id}/products/product/${product._id}`,
      },
    ],
  };

  return (
    <CmsProductLayout product={product} breadcrumbs={breadcrumbs} basePath={routeBasePath}>
      <ConsoleRubricProductAttributes product={product} />
    </CmsProductLayout>
  );
};

interface ProductPageInterface extends PagePropsInterface, ProductAttributesInterface {}

const Product: NextPage<ProductPageInterface> = ({ pageUrls, ...props }) => {
  return (
    <CmsLayout pageUrls={pageUrls}>
      <ProductAttributes {...props} />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<ProductPageInterface>> => {
  const { query } = context;
  const { productId, rubricId } = query;
  const { db } = await getDatabase();
  const attributesGroupsCollection = db.collection<AttributesGroupInterface>(COL_ATTRIBUTES_GROUPS);
  const companiesCollection = db.collection<CompanyInterface>(COL_COMPANIES);
  const { props } = await getAppInitialData({ context });
  if (!props || !productId || !rubricId || !query.companyId) {
    return {
      notFound: true,
    };
  }

  // get company
  const companyId = new ObjectId(`${query.companyId}`);
  const companyAggregationResult = await companiesCollection
    .aggregate([
      {
        $match: {
          _id: companyId,
        },
      },
    ])
    .toArray();
  const companyResult = companyAggregationResult[0];
  if (!companyResult) {
    return {
      notFound: true,
    };
  }
  const companySlug = companyResult.slug;

  const payload = await getCmsProduct({
    locale: props.sessionLocale,
    productId: `${productId}`,
    companySlug,
  });

  if (!payload) {
    return {
      notFound: true,
    };
  }

  const { product, categoriesList } = payload;
  const attributesGroupIds: ObjectIdModel[] = product.rubric?.attributesGroupIds || [];
  categoriesList.forEach((category) => {
    category.attributesGroupIds.forEach((_id) => {
      attributesGroupIds.push(_id);
    });
  });

  const rubricAttributes = await attributesGroupsCollection
    .aggregate<AttributesGroupInterface>([
      {
        $match: {
          _id: {
            $in: attributesGroupIds,
          },
        },
      },
      // get attributes
      ...rubricAttributesGroupAttributesPipeline,
    ])
    .toArray();

  // Cast rubric attributes to product attributes
  const { attributes, ...restProduct } = product;

  const productAttributesGroups: ProductAttributesGroupInterface[] = [];
  rubricAttributes.forEach((group) => {
    const groupAttributes: ProductAttributeInterface[] = [];

    const stringAttributesAST: ProductAttributeInterface[] = [];
    const numberAttributesAST: ProductAttributeInterface[] = [];
    const multipleSelectAttributesAST: ProductAttributeInterface[] = [];
    const selectAttributesAST: ProductAttributeInterface[] = [];

    (group.attributes || []).forEach((attribute) => {
      const currentProductAttribute = (attributes || []).find(({ attributeId }) => {
        return attributeId.equals(attribute._id);
      });

      if (currentProductAttribute) {
        const { attribute } = currentProductAttribute;
        if (!attribute) {
          return;
        }
        const readableValue = getAttributeReadableValue({
          productAttribute: currentProductAttribute,
          locale: props.sessionLocale,
        });

        groupAttributes.push({
          ...currentProductAttribute,
          readableValue: readableValue || '',
          attribute: {
            ...attribute,
            name: getFieldStringLocale(attribute.nameI18n, props.sessionLocale),
          },
        });
      } else {
        const newProductAttribute: ProductAttributeInterface = {
          _id: new ObjectId(),
          attribute: {
            ...attribute,
            name: getFieldStringLocale(attribute.nameI18n, props.sessionLocale),
          },
          rubricId: product.rubricId,
          rubricSlug: product.rubricSlug,
          attributeId: attribute._id,
          productId: product._id,
          productSlug: product.slug,
          selectedOptionsIds: [],
          selectedOptionsSlugs: [],
          number: undefined,
          textI18n: {},
        };

        groupAttributes.push(newProductAttribute);
      }
    });

    groupAttributes.forEach((productAttribute) => {
      const { attribute } = productAttribute;
      if (!attribute) {
        return;
      }
      const { variant } = attribute;

      if (variant === ATTRIBUTE_VARIANT_STRING) {
        stringAttributesAST.push(productAttribute);
      }

      if (variant === ATTRIBUTE_VARIANT_NUMBER) {
        numberAttributesAST.push(productAttribute);
      }

      if (variant === ATTRIBUTE_VARIANT_MULTIPLE_SELECT) {
        multipleSelectAttributesAST.push(productAttribute);
      }

      if (variant === ATTRIBUTE_VARIANT_SELECT) {
        selectAttributesAST.push(productAttribute);
      }
    });

    const productAttributesGroup: ProductAttributesGroupInterface = {
      ...group,
      name: getFieldStringLocale(group.nameI18n),
      attributes: [],
      stringAttributesAST: sortByName(stringAttributesAST),
      numberAttributesAST: sortByName(numberAttributesAST),
      multipleSelectAttributesAST: sortByName(multipleSelectAttributesAST),
      selectAttributesAST: sortByName(selectAttributesAST),
    };

    productAttributesGroups.push(productAttributesGroup);
  });

  const finalProduct: ProductInterface = {
    ...restProduct,
    attributesGroups: sortByName(productAttributesGroups),
  };

  return {
    props: {
      ...props,
      product: castDbData(finalProduct),
      currentCompany: castDbData(companyResult),
      routeBasePath: `${ROUTE_CMS}/companies/${companyResult._id}`,
    },
  };
};

export default Product;
