import CompanyProductSuppliers, {
  CompanyProductSuppliersInterface,
} from 'components/company/CompanyProductSuppliers';
import { SelectOptionInterface } from 'components/FormElements/Select/Select';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import ConsoleShopProductLayout from 'components/layout/console/ConsoleShopProductLayout';
import RequestError from 'components/RequestError';
import { getDbCollections } from 'db/mongodb';
import { getConsoleShopProduct } from 'db/ssr/shops/getConsoleShopProduct';
import { AppContentWrapperBreadCrumbs, SupplierInterface } from 'db/uiInterfaces';
import { SORT_ASC } from 'lib/config/common';
import { getFieldStringLocale } from 'lib/i18n';
import { getProjectLinks } from 'lib/links/getProjectLinks';

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
}) => {
  const { summary, shop } = shopProduct;

  if (!summary || !shop) {
    return <RequestError />;
  }

  const { rubric, snippetTitle } = summary;
  if (!rubric) {
    return <RequestError />;
  }

  const links = getProjectLinks({
    companyId: shop.companyId,
    shopId: shop._id,
    rubricSlug: rubric.slug,
    shopProductId: shopProduct._id,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `Ценообразование`,
    config: [
      {
        name: 'Магазины',
        href: links.console.companyId.shops.url,
      },
      {
        name: shop.name,
        href: links.console.companyId.shops.shop.shopId.url,
      },
      {
        name: 'Товары',
        href: links.console.companyId.shops.shop.shopId.rubrics.url,
      },
      {
        name: `${rubric?.name}`,
        href: links.console.companyId.shops.shop.shopId.rubrics.rubricSlug.url,
      },
      {
        name: `${snippetTitle}`,
        href: links.console.companyId.shops.shop.shopId.rubrics.rubricSlug.products.product
          .shopProductId.url,
      },
    ],
  };

  return (
    <ConsoleShopProductLayout breadcrumbs={breadcrumbs} shopProduct={shopProduct}>
      <CompanyProductSuppliers
        shopProduct={shopProduct}
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

  return {
    props: {
      ...props,
      shopProduct: castDbData(shopProduct),
      suppliers: castDbData(suppliers),
      disableAddSupplier: disabledSuppliers.length === suppliers.length,
    },
  };
};

export default Product;
