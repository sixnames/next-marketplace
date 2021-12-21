import { ObjectId } from 'mongodb';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import ConsoleRubricProductAttributes from '../../../../../../../components/console/ConsoleRubricProductAttributes';
import {
  ATTRIBUTE_VARIANT_MULTIPLE_SELECT,
  ATTRIBUTE_VARIANT_NUMBER,
  ATTRIBUTE_VARIANT_SELECT,
  ATTRIBUTE_VARIANT_STRING,
  DEFAULT_COMPANY_SLUG,
  ROUTE_CMS,
} from '../../../../../../../config/common';
import { COL_ATTRIBUTES_GROUPS } from '../../../../../../../db/collectionNames';
import { rubricAttributesGroupAttributesPipeline } from '../../../../../../../db/dao/constantPipelines';
import { ObjectIdModel } from '../../../../../../../db/dbModels';
import { getDatabase } from '../../../../../../../db/mongodb';
import {
  AppContentWrapperBreadCrumbs,
  AttributesGroupInterface,
  ProductAttributeInterface,
  ProductAttributesGroupInterface,
  ProductInterface,
} from '../../../../../../../db/uiInterfaces';
import CmsProductLayout from '../../../../../../../layout/cms/CmsProductLayout';
import ConsoleLayout from '../../../../../../../layout/cms/ConsoleLayout';
import { sortObjectsByField } from '../../../../../../../lib/arrayUtils';
import { getFieldStringLocale } from '../../../../../../../lib/i18n';
import { getAttributeReadableValue } from '../../../../../../../lib/productAttributesUtils';
import { getCmsProduct } from '../../../../../../../lib/productUtils';
import {
  castDbData,
  getAppInitialData,
  GetAppInitialDataPropsInterface,
} from '../../../../../../../lib/ssrUtils';

interface ProductAttributesInterface {
  product: ProductInterface;
}

const ProductAttributes: React.FC<ProductAttributesInterface> = ({ product }) => {
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Атрибуты',
    config: [
      {
        name: 'Рубрикатор',
        href: `${ROUTE_CMS}/rubrics`,
      },
      {
        name: `${product.rubric?.name}`,
        href: `${ROUTE_CMS}/rubrics/${product.rubric?._id}`,
      },
      {
        name: `Товары`,
        href: `${ROUTE_CMS}/rubrics/${product.rubric?._id}/products/${product.rubric?._id}`,
      },
      {
        name: `${product.cardTitle}`,
        href: `${ROUTE_CMS}/rubrics/${product.rubric?._id}/products/product/${product._id}`,
      },
    ],
  };

  return (
    <CmsProductLayout product={product} breadcrumbs={breadcrumbs}>
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
  const { props } = await getAppInitialData({ context });
  if (!props || !productId || !rubricId) {
    return {
      notFound: true,
    };
  }

  const payload = await getCmsProduct({
    locale: props.sessionLocale,
    productId: `${productId}`,
    companySlug: DEFAULT_COMPANY_SLUG,
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
          readableValueI18n: {},
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
      stringAttributesAST: sortObjectsByField(stringAttributesAST),
      numberAttributesAST: sortObjectsByField(numberAttributesAST),
      multipleSelectAttributesAST: sortObjectsByField(multipleSelectAttributesAST),
      selectAttributesAST: sortObjectsByField(selectAttributesAST),
    };

    productAttributesGroups.push(productAttributesGroup);
  });

  const finalProduct: ProductInterface = {
    ...restProduct,
    attributesGroups: sortObjectsByField(productAttributesGroups),
  };

  return {
    props: {
      ...props,
      product: castDbData(finalProduct),
    },
  };
};

export default Product;
