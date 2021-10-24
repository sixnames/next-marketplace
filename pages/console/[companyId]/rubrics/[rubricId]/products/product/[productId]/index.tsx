import CompanyProductDetails, {
  CompanyProductDetailsInterface,
} from 'components/CompanyProductDetails';
import { ROUTE_CONSOLE } from 'config/common';
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import CmsProductLayout from 'layout/cms/CmsProductLayout';
import { getCmsProduct } from 'lib/productUtils';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getConsoleInitialData } from 'lib/ssrUtils';
import ConsoleLayout from 'layout/console/ConsoleLayout';

interface ProductDetailsInterface extends CompanyProductDetailsInterface {}

const ProductDetails: React.FC<ProductDetailsInterface> = ({
  product,
  routeBasePath,
  currentCompany,
  rubric,
}) => {
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${product.cardTitle}`,
    config: [
      {
        name: `Рубрикатор`,
        href: `${routeBasePath}/rubrics`,
      },
      {
        name: `${rubric.name}`,
        href: `${routeBasePath}/rubrics/${rubric._id}`,
      },
      {
        name: `Товары`,
        href: `${routeBasePath}/rubrics/${rubric._id}/products/${rubric._id}`,
      },
    ],
  };

  return (
    <CmsProductLayout
      hideAssetsPath
      hideAttributesPath
      hideBrandPath
      hideCategoriesPath
      hideConnectionsPath
      product={product}
      basePath={routeBasePath}
      breadcrumbs={breadcrumbs}
    >
      <CompanyProductDetails
        routeBasePath={routeBasePath}
        rubric={rubric}
        product={product}
        currentCompany={currentCompany}
      />
    </CmsProductLayout>
  );
};

interface ProductPageInterface extends PagePropsInterface, ProductDetailsInterface {}

const Product: NextPage<ProductPageInterface> = ({ pageUrls, ...props }) => {
  return (
    <ConsoleLayout pageUrls={pageUrls} company={props.currentCompany}>
      <ProductDetails {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<ProductPageInterface>> => {
  const { query } = context;
  const { productId, rubricId } = query;
  const { props } = await getConsoleInitialData({ context });

  if (!props || !productId || !rubricId || !query.companyId) {
    return {
      notFound: true,
    };
  }

  // get company
  const companySlug = props.currentCompany.slug;

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

  return {
    props: {
      ...props,
      product: castDbData(payload.product),
      rubric: castDbData(payload.rubric),
      routeBasePath: `${ROUTE_CONSOLE}/${props.currentCompany._id}`,
    },
  };
};

export default Product;
