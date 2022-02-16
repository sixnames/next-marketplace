import CompanyProductSuppliers, {
  CompanyProductSuppliersInterface,
} from 'components/company/CompanyProductSuppliers';
import { SelectOptionInterface } from 'components/FormElements/Select/Select';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import ConsoleShopProductLayout from 'components/layout/console/ConsoleShopProductLayout';
import RequestError from 'components/RequestError';
import { getDbCollections } from 'db/mongodb';
import { AppContentWrapperBreadCrumbs, CompanyInterface, SupplierInterface } from 'db/uiInterfaces';
import { SORT_ASC } from 'lib/config/common';
import { getFieldStringLocale } from 'lib/i18n';
import { getProjectLinks } from 'lib/links/getProjectLinks';
import { getCmsCompanyLinks } from 'lib/linkUtils';
import { getConsoleShopProduct } from 'lib/productUtils';
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
  routeBasePath,
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

  const links = getCmsCompanyLinks({
    companyId: shop.companyId,
    shopId: shop._id,
    rubricSlug: rubric?.slug,
    productId: shopProduct._id,
  });

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `Ценообразование`,
    config: [
      {
        name: 'Компании',
        href: links.parentLink,
      },
      {
        name: `${pageCompany.name}`,
        href: links.root,
      },
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
    <ConsoleShopProductLayout showEditButton breadcrumbs={breadcrumbs} shopProduct={shopProduct}>
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

  const links = getProjectLinks({
    companyId: shopProduct.companyId,
  });
  return {
    props: {
      ...props,
      shopProduct: castDbData(shopProduct),
      suppliers: castDbData(suppliers),
      pageCompany: castDbData(companyResult),
      disableAddSupplier: disabledSuppliers.length === suppliers.length,
      routeBasePath: links.cms.companies.companyId.url,
    },
  };
};

export default Product;
