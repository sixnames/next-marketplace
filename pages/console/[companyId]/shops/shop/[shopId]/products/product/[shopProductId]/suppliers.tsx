import { ObjectId } from 'mongodb';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import CompanyProductSuppliers, {
  CompanyProductSuppliersInterface,
} from '../../../../../../../../../components/company/CompanyProductSuppliers';
import { SelectOptionInterface } from '../../../../../../../../../components/FormElements/Select/Select';
import RequestError from '../../../../../../../../../components/RequestError';
import { ROUTE_CMS, ROUTE_CONSOLE, SORT_ASC } from '../../../../../../../../../config/common';
import { COL_COMPANIES, COL_SUPPLIERS } from '../../../../../../../../../db/collectionNames';
import { getDatabase } from '../../../../../../../../../db/mongodb';
import {
  AppContentWrapperBreadCrumbs,
  CompanyInterface,
  SupplierInterface,
} from '../../../../../../../../../db/uiInterfaces';
import ConsoleLayout from '../../../../../../../../../layout/cms/ConsoleLayout';
import ConsoleShopProductLayout from '../../../../../../../../../layout/console/ConsoleShopProductLayout';
import { getFieldStringLocale } from '../../../../../../../../../lib/i18n';
import { getConsoleShopProduct } from '../../../../../../../../../lib/productUtils';
import {
  castDbData,
  getConsoleInitialData,
  GetConsoleInitialDataPropsInterface,
} from '../../../../../../../../../lib/ssrUtils';

interface ProductDetailsInterface extends CompanyProductSuppliersInterface {}

const ProductDetails: React.FC<ProductDetailsInterface> = ({
  shopProduct,
  disableAddSupplier,
  suppliers,
  routeBasePath,
}) => {
  const { summary, shop, company } = shopProduct;

  if (!summary || !shop || !company) {
    return <RequestError />;
  }

  const { rubric, snippetTitle } = summary;
  if (!rubric) {
    return <RequestError />;
  }

  const companyBasePath = `${ROUTE_CONSOLE}/${shop.companyId}/shops`;
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Поставщики',
    config: [
      {
        name: 'Магазины',
        href: companyBasePath,
      },
      {
        name: shop.name,
        href: `${companyBasePath}/shop/${shop._id}`,
      },
      {
        name: 'Товары',
        href: `${companyBasePath}/shop/${shop._id}/products`,
      },
      {
        name: `${rubric.name}`,
        href: `${companyBasePath}/shop/${shop._id}/products/${rubric._id}`,
      },
      {
        name: `${snippetTitle}`,
        href: `${companyBasePath}/shop/${shop._id}/products/product/${shopProduct._id}`,
      },
    ],
  };

  return (
    <ConsoleShopProductLayout
      breadcrumbs={breadcrumbs}
      shopProduct={shopProduct}
      basePath={`${companyBasePath}/shop/${shopProduct.shopId}/products/product`}
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
  const { shopProductId, companyId, shopId } = query;
  const { props } = await getConsoleInitialData({ context });
  const { db } = await getDatabase();
  const suppliersCollection = db.collection<SupplierInterface>(COL_SUPPLIERS);
  const companiesCollection = db.collection<CompanyInterface>(COL_COMPANIES);
  if (!props || !shopProductId || !companyId || !shopId) {
    return {
      notFound: true,
    };
  }

  const companyResult = await companiesCollection.findOne({
    _id: new ObjectId(`${companyId}`),
  });
  if (!companyResult) {
    return {
      notFound: true,
    };
  }

  const locale = props.sessionLocale;
  const shopProduct = await getConsoleShopProduct({
    shopProductId,
    locale,
    companySlug: companyResult.slug,
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
