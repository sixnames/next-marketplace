import { ObjectId } from 'mongodb';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import ConsoleRubricProductAttributes from '../../../../../../../../../components/console/ConsoleRubricProductAttributes';
import {
  ATTRIBUTE_VARIANT_MULTIPLE_SELECT,
  ATTRIBUTE_VARIANT_NUMBER,
  ATTRIBUTE_VARIANT_SELECT,
  ATTRIBUTE_VARIANT_STRING,
} from '../../../../../../../../../config/common';
import {
  COL_ATTRIBUTES_GROUPS,
  COL_COMPANIES,
} from '../../../../../../../../../db/collectionNames';
import { rubricAttributesGroupAttributesPipeline } from '../../../../../../../../../db/dao/constantPipelines';
import { ObjectIdModel } from '../../../../../../../../../db/dbModels';
import { getDatabase } from '../../../../../../../../../db/mongodb';
import {
  AppContentWrapperBreadCrumbs,
  AttributesGroupInterface,
  CompanyInterface,
  ProductAttributeInterface,
  ProductAttributesGroupInterface,
  ProductSummaryInterface,
} from '../../../../../../../../../db/uiInterfaces';
import CmsProductLayout from '../../../../../../../../../layout/cms/CmsProductLayout';
import ConsoleLayout from '../../../../../../../../../layout/cms/ConsoleLayout';
import { sortObjectsByField } from '../../../../../../../../../lib/arrayUtils';
import { getFieldStringLocale } from '../../../../../../../../../lib/i18n';
import { getCmsCompanyLinks } from '../../../../../../../../../lib/linkUtils';
import { getAttributeReadableValue } from '../../../../../../../../../lib/productAttributesUtils';
import { getCmsProduct } from '../../../../../../../../../lib/productUtils';
import {
  castDbData,
  getAppInitialData,
  GetAppInitialDataPropsInterface,
} from '../../../../../../../../../lib/ssrUtils';

interface ProductAttributesInterface {
  product: ProductSummaryInterface;
  routeBasePath: string;
  pageCompany: CompanyInterface;
}

const ProductAttributes: React.FC<ProductAttributesInterface> = ({
  product,
  pageCompany,
  routeBasePath,
}) => {
  const links = getCmsCompanyLinks({
    companyId: pageCompany._id,
    rubricSlug: product.rubricSlug,
    productId: product._id,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `Атрибуты`,
    config: [
      {
        name: 'Компании',
        href: links.parentLink,
      },
      {
        name: `${pageCompany.name}`,
        href: links.parentLink,
      },
      {
        name: `Рубрикатор`,
        href: links.rubrics.parentLink,
      },
      {
        name: `${product.rubric?.name}`,
        href: links.rubrics.parentLink,
      },
      {
        name: `Товары`,
        href: links.rubrics.products,
      },
      {
        name: `${product.snippetTitle}`,
        href: links.rubrics.product.parentLink,
      },
    ],
  };

  return (
    <CmsProductLayout
      companySlug={pageCompany.slug}
      product={product}
      breadcrumbs={breadcrumbs}
      basePath={routeBasePath}
    >
      <ConsoleRubricProductAttributes product={product} />
    </CmsProductLayout>
  );
};

interface ProductPageInterface
  extends GetAppInitialDataPropsInterface,
    ProductAttributesInterface {}

const Product: NextPage<ProductPageInterface> = ({ layoutProps, ...props }) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <ProductAttributes {...props} />
    </ConsoleLayout>
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

  const payload = await getCmsProduct({
    locale: props.sessionLocale,
    productId: `${productId}`,
    companySlug: companyResult.slug,
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

  // Get product attribute groups
  const productAttributesGroups: ProductAttributesGroupInterface[] = [];
  rubricAttributes.forEach((group) => {
    const groupAttributes: ProductAttributeInterface[] = [];

    const stringAttributesAST: ProductAttributeInterface[] = [];
    const numberAttributesAST: ProductAttributeInterface[] = [];
    const multipleSelectAttributesAST: ProductAttributeInterface[] = [];
    const selectAttributesAST: ProductAttributeInterface[] = [];

    (group.attributes || []).forEach((attribute) => {
      const currentProductAttribute = product.attributes.find(({ attributeId }) => {
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
          readableValueI18n: {},
          attributeId: attribute._id,
          readableValue: '',
          optionIds: [],
          filterSlugs: [],
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
      stringAttributesAST: sortObjectsByField(stringAttributesAST),
      numberAttributesAST: sortObjectsByField(numberAttributesAST),
      multipleSelectAttributesAST: sortObjectsByField(multipleSelectAttributesAST),
      selectAttributesAST: sortObjectsByField(selectAttributesAST),
    };

    productAttributesGroups.push(productAttributesGroup);
  });

  const finalProduct: ProductSummaryInterface = {
    ...product,
    attributesGroups: sortObjectsByField(productAttributesGroups),
  };

  const links = getCmsCompanyLinks({
    companyId: companyResult._id,
  });
  return {
    props: {
      ...props,
      product: castDbData(finalProduct),
      pageCompany: castDbData(companyResult),
      routeBasePath: links.parentLink,
    },
  };
};

export default Product;
