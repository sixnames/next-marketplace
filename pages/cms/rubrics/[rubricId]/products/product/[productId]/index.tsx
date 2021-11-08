import ConsoleRubricProductDetails from 'components/console/ConsoleRubricProductDetails';
import { DEFAULT_COMPANY_SLUG, ROUTE_CMS } from 'config/common';
import { ProductInterface, RubricInterface } from 'db/uiInterfaces';
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import CmsProductLayout from 'layout/cms/CmsProductLayout';
import { getCmsProduct } from 'lib/productUtils';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import CmsLayout from 'layout/cms/CmsLayout';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';

interface ProductDetailsInterface {
  product: ProductInterface;
  rubric: RubricInterface;
  companySlug: string;
}

const ProductDetails: React.FC<ProductDetailsInterface> = ({ product, companySlug, rubric }) => {
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${product.cardTitle}`,
    config: [
      {
        name: 'Рубрикатор',
        href: `${ROUTE_CMS}/rubrics`,
      },
      {
        name: `${rubric.name}`,
        href: `${ROUTE_CMS}/rubrics/${rubric._id}`,
      },
      {
        name: `Товары`,
        href: `${ROUTE_CMS}/rubrics/${rubric._id}/products/${rubric._id}`,
      },
    ],
  };

  return (
    <CmsProductLayout product={product} breadcrumbs={breadcrumbs}>
      <ConsoleRubricProductDetails product={product} companySlug={companySlug} />
    </CmsProductLayout>
  );
};

interface ProductPageInterface extends PagePropsInterface, ProductDetailsInterface {}

const Product: NextPage<ProductPageInterface> = ({ pageUrls, product, companySlug, rubric }) => {
  return (
    <CmsLayout pageUrls={pageUrls}>
      <ProductDetails product={product} rubric={rubric} companySlug={companySlug} />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<ProductPageInterface>> => {
  const { query } = context;
  const { productId, rubricId } = query;
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

  return {
    props: {
      ...props,
      product: castDbData(payload.product),
      rubric: castDbData(payload.rubric),
      companySlug: DEFAULT_COMPANY_SLUG,
    },
  };
};

export default Product;
