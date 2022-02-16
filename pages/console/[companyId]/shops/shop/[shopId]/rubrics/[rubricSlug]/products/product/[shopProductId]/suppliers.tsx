import CompanyProductSuppliers, {
  CompanyProductSuppliersInterface,
} from 'components/company/CompanyProductSuppliers';
import { SelectOptionInterface } from 'components/FormElements/Select/Select';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import ConsoleShopProductLayout from 'components/layout/console/ConsoleShopProductLayout';
import RequestError from 'components/RequestError';
import { getDbCollections } from 'db/mongodb';
import { AppContentWrapperBreadCrumbs, SupplierInterface } from 'db/uiInterfaces';
import { SORT_ASC } from 'lib/config/common';
import { getFieldStringLocale } from 'lib/i18n';
import { getConsoleCompanyLinks } from 'lib/linkUtils';
import { getConsoleShopProduct } from 'lib/productUtils';
import {
  castDbData,
  getConsoleInitialData,
  GetConsoleInitialDataPropsInterface,
} from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';

interface ProductDetailsInterface extends CompanyProductSuppliersInterface {}

const ProductDetails: React.FC<ProductDetailsInterface> = ({
  shopProduct,
  disableAddSupplier,
  suppliers,
  routeBasePath,
}) => {
  const { summary, shop } = shopProduct;

  if (!summary || !shop) {
    return <RequestError />;
  }

  const { rubric, snippetTitle } = summary;
  if (!rubric) {
    return <RequestError />;
  }

  const links = getConsoleCompanyLinks({
    companyId: shop.companyId,
    shopId: shop._id,
    rubricSlug: rubric.slug,
    productId: shopProduct._id,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `Ценообразование`,
    config: [
      {
        name: 'Магазины',
        href: links.shop.parentLink,
      },
      {
        name: shop.name,
        href: links.shop.root,
      },
      {
        name: 'Товары',
        href: links.shop.rubrics.parentLink,
      },
      {
        name: `${rubric?.name}`,
        href: links.shop.rubrics.product.parentLink,
      },
      {
        name: `${snippetTitle}`,
        href: links.shop.rubrics.product.root,
      },
    ],
  };

  return (
    <ConsoleShopProductLayout
      breadcrumbs={breadcrumbs}
      shopProduct={shopProduct}
      basePath={links.parentLink}
    >
      <CompanyProductSuppliers
        shopProduct={shopProduct}
        routeBasePath={routeBasePath}
        disableAddSupplier={disableAddSupplier}
        suppliers={suppliers}
      />
    </ConsoleShopProductLayout>
  );
};

interface ProductPageInterface
  extends GetConsoleInitialDataPropsInterface,
    ProductDetailsInterface {}

const Product: NextPage<ProductPageInterface> = ({ layoutProps, ...props }) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <ProductDetails {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<ProductPageInterface>> => {
  const { query } = context;
  const { props } = await getConsoleInitialData({ context });
  const collections = await getDbCollections();
  const suppliersCollection = collections.suppliersCollection();
  if (!props) {
    return {
      notFound: true,
    };
  }

  const locale = props.sessionLocale;
  const shopProduct = await getConsoleShopProduct({
    shopProductId: `${query.shopProductId}`,
    companySlug: props.layoutProps.pageCompany.slug,
    locale,
  });
  if (!shopProduct) {
    return {
      notFound: true,
    };
  }

  const selectedSupplierIds = (shopProduct.supplierProducts || []).map(({ supplierId }) => {
    return supplierId;
  });

  const suppliersAggregation = await suppliersCollection
    .aggregate<SupplierInterface>([
      {
        $sort: {
          [`nameI18n.${locale}`]: SORT_ASC,
        },
      },
    ])
    .toArray();

  const suppliers: SelectOptionInterface[] = suppliersAggregation.map((supplier) => {
    const option: SelectOptionInterface = {
      ...supplier,
      name: getFieldStringLocale(supplier.nameI18n, locale),
      disabled: selectedSupplierIds.some((_id) => _id.equals(supplier._id)),
    };
    return option;
  });

  const disabledSuppliers = suppliers.filter(({ disabled }) => disabled);

  const links = getConsoleCompanyLinks({
    companyId: `${query.companyId}`,
    shopId: `${query.shopId}`,
    rubricSlug: `${query.rubricSlug}`,
    productId: `${query.shopProductId}`,
  });

  return {
    props: {
      ...props,
      shopProduct: castDbData(shopProduct),
      suppliers: castDbData(suppliers),
      disableAddSupplier: disabledSuppliers.length === suppliers.length,
      routeBasePath: links.root,
    },
  };
};

export default Product;
