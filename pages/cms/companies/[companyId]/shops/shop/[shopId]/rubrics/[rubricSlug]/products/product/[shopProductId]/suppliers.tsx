import CompanyProductSuppliers, {
  CompanyProductSuppliersInterface,
} from 'components/company/CompanyProductSuppliers';
import { SelectOptionInterface } from 'components/FormElements/Select/Select';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import ConsoleShopProductLayout from 'components/layout/console/ConsoleShopProductLayout';
import RequestError from 'components/RequestError';
import { getDbCollections } from 'db/mongodb';
import { getConsoleShopProduct } from 'db/ssr/shops/getConsoleShopProduct';
import { AppContentWrapperBreadCrumbs, CompanyInterface, SupplierInterface } from 'db/uiInterfaces';
import { SORT_ASC } from 'lib/config/common';
import { getFieldStringLocale } from 'lib/i18n';
import { getProjectLinks } from 'lib/links/getProjectLinks';

import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';

interface ProductDetailsInterface extends CompanyProductSuppliersInterface {
  pageCompany: CompanyInterface;
}

const ProductDetails: React.FC<ProductDetailsInterface> = ({
  shopProduct,
  disableAddSupplier,
  suppliers,
  pageCompany,
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
    rubricSlug: rubric?.slug,
    shopProductId: shopProduct._id,
  });

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `Ценообразование`,
    config: [
      {
        name: 'Компании',
        href: links.cms.companies.url,
      },
      {
        name: `${pageCompany.name}`,
        href: links.cms.companies.companyId.url,
      },
      {
        name: 'Магазины',
        href: links.cms.companies.companyId.shops.url,
      },
      {
        name: shop.name,
        href: links.cms.companies.companyId.shops.shop.shopId.url,
      },
      {
        name: 'Товары',
        href: links.cms.companies.companyId.shops.shop.shopId.rubrics.url,
      },
      {
        name: `${rubric?.name}`,
        href: links.cms.companies.companyId.shops.shop.shopId.rubrics.rubricSlug.url,
      },
      {
        name: `${snippetTitle}`,
        href: links.cms.companies.companyId.shops.shop.shopId.rubrics.rubricSlug.products.product
          .shopProductId.url,
      },
    ],
  };

  return (
    <ConsoleShopProductLayout showEditButton breadcrumbs={breadcrumbs} shopProduct={shopProduct}>
      <CompanyProductSuppliers
        shopProduct={shopProduct}
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
  const collections = await getDbCollections();
  const companiesCollection = collections.companiesCollection();
  const suppliersCollection = collections.suppliersCollection();
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
      pageCompany: castDbData(companyResult),
      disableAddSupplier: disabledSuppliers.length === suppliers.length,
    },
  };
};

export default Product;
