import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import CompanyProductSuppliers, {
  CompanyProductSuppliersInterface,
} from '../../../../../../../../../../components/company/CompanyProductSuppliers';
import { SelectOptionInterface } from '../../../../../../../../../../components/FormElements/Select/Select';
import RequestError from '../../../../../../../../../../components/RequestError';
import { SORT_ASC } from '../../../../../../../../../../config/common';
import { COL_SUPPLIERS } from '../../../../../../../../../../db/collectionNames';
import { getDatabase } from '../../../../../../../../../../db/mongodb';
import {
  AppContentWrapperBreadCrumbs,
  SupplierInterface,
} from '../../../../../../../../../../db/uiInterfaces';
import ConsoleLayout from '../../../../../../../../../../layout/cms/ConsoleLayout';
import ConsoleShopProductLayout from '../../../../../../../../../../layout/console/ConsoleShopProductLayout';
import { getFieldStringLocale } from '../../../../../../../../../../lib/i18n';
import { getConsoleCompanyLinks } from '../../../../../../../../../../lib/linkUtils';
import { getConsoleShopProduct } from '../../../../../../../../../../lib/productUtils';
import {
  castDbData,
  getConsoleInitialData,
  GetConsoleInitialDataPropsInterface,
} from '../../../../../../../../../../lib/ssrUtils';

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
        href: links.shops,
      },
      {
        name: shop.name,
        href: links.shop.root,
      },
      {
        name: 'Товары',
        href: links.shop.products.root,
      },
      {
        name: `${rubric.name}`,
        href: links.shop.products.rubric.root,
      },
      {
        name: `${snippetTitle}`,
        href: links.shop.products.rubric.product.root,
      },
    ],
  };

  return (
    <ConsoleShopProductLayout
      breadcrumbs={breadcrumbs}
      shopProduct={shopProduct}
      basePath={links.shop.products.rubric.product.parentLink}
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
  const { db } = await getDatabase();
  const suppliersCollection = db.collection<SupplierInterface>(COL_SUPPLIERS);
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
