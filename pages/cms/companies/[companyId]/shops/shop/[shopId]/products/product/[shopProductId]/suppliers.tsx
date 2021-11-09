import CompanyProductSuppliers, {
  CompanyProductSuppliersInterface,
} from 'components/company/CompanyProductSuppliers';
import { SelectOptionInterface } from 'components/FormElements/Select/Select';
import RequestError from 'components/RequestError';
import { ROUTE_CMS, SORT_ASC } from 'config/common';
import { COL_SUPPLIERS } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { SupplierInterface } from 'db/uiInterfaces';
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import ConsoleLayout from 'layout/cms/ConsoleLayout';
import ConsoleShopProductLayout from 'layout/console/ConsoleShopProductLayout';
import { getFieldStringLocale } from 'lib/i18n';
import { getConsoleShopProduct } from 'lib/productUtils';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';

interface ProductDetailsInterface extends CompanyProductSuppliersInterface {}

const ProductDetails: React.FC<ProductDetailsInterface> = ({
  shopProduct,
  disableAddSupplier,
  suppliers,
  routeBasePath,
}) => {
  const { product, shop, company } = shopProduct;

  if (!product || !shop || !company) {
    return <RequestError />;
  }

  const { rubric, snippetTitle } = product;
  if (!rubric) {
    return <RequestError />;
  }

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Поставщики',
    config: [
      {
        name: 'Компании',
        href: `${ROUTE_CMS}/companies`,
      },
      {
        name: `${company.name}`,
        href: routeBasePath,
      },
      {
        name: 'Магазины',
        href: `${routeBasePath}/shops/${shop.companyId}`,
      },
      {
        name: shop.name,
        href: `${routeBasePath}/shops/shop/${shop._id}`,
      },
      {
        name: 'Товары',
        href: `${routeBasePath}/shops/shop/${shop._id}/products`,
      },
      {
        name: `${rubric?.name}`,
        href: `${routeBasePath}/shops/shop/${shop._id}/products/${rubric?._id}`,
      },
      {
        name: `${snippetTitle}`,
        href: `${routeBasePath}/shops/shop/${shop._id}/products/${rubric?._id}/${shopProduct._id}`,
      },
    ],
  };

  return (
    <ConsoleShopProductLayout
      showEditButton
      breadcrumbs={breadcrumbs}
      shopProduct={shopProduct}
      basePath={`${routeBasePath}/shops/shop/${shopProduct.shopId}/products/product`}
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

interface ProductPageInterface extends GetAppInitialDataPropsInterface, ProductDetailsInterface {}

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
  const { shopProductId, companyId, shopId } = query;
  const { props } = await getAppInitialData({ context });
  const { db } = await getDatabase();
  const suppliersCollection = db.collection<SupplierInterface>(COL_SUPPLIERS);
  if (!props || !shopProductId || !companyId || !shopId) {
    return {
      notFound: true,
    };
  }

  const locale = props.sessionLocale;
  const shopProduct = await getConsoleShopProduct({
    shopProductId,
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
      routeBasePath: `${ROUTE_CMS}/companies/${shopProduct.companyId}`,
    },
  };
};

export default Product;
