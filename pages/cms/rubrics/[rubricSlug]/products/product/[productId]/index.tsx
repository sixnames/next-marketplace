import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import ConsoleRubricProductDetails from 'components/console/ConsoleRubricProductDetails';
import { DEFAULT_COMPANY_SLUG } from 'config/common';
import { AppContentWrapperBreadCrumbs, ProductSummaryInterface } from 'db/uiInterfaces';
import CmsProductLayout from 'layout/cms/CmsProductLayout';
import ConsoleLayout from 'layout/cms/ConsoleLayout';
import { getConsoleRubricLinks } from 'lib/linkUtils';
import { getFullProductSummaryWithDraft } from 'lib/productUtils';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';

interface ProductDetailsInterface {
  product: ProductSummaryInterface;
}

const ProductDetails: React.FC<ProductDetailsInterface> = ({ product }) => {
  const links = getConsoleRubricLinks({
    productId: product._id,
    rubricSlug: product.rubricSlug,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${product.cardTitle}`,
    config: [
      {
        name: 'Рубрикатор',
        href: links.parentLink,
      },
      {
        name: `${product.rubric?.name}`,
        href: links.root,
      },
      {
        name: `Товары`,
        href: links.product.parentLink,
      },
    ],
  };

  return (
    <CmsProductLayout product={product} breadcrumbs={breadcrumbs}>
      <ConsoleRubricProductDetails product={product} />
    </CmsProductLayout>
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
  const { productId } = query;
  const { props } = await getAppInitialData({ context });
  if (!props) {
    return {
      notFound: true,
    };
  }

  const payload = await getFullProductSummaryWithDraft({
    locale: props.sessionLocale,
    productId: `${productId}`,
    companySlug: DEFAULT_COMPANY_SLUG,
    isContentManager: Boolean(props.layoutProps.sessionUser.me.role?.isContentManager),
  });

  if (!payload) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...props,
      product: castDbData(payload.summary),
      companySlug: DEFAULT_COMPANY_SLUG,
    },
  };
};

export default Product;
