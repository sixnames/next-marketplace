import ConsoleRubricProductVariants from 'components/console/ConsoleRubricProductVariants';
import CmsProductLayout from 'components/layout/cms/CmsProductLayout';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import { getProductFullSummaryWithDraft } from 'db/ssr/products/getProductFullSummary';
import { AppContentWrapperBreadCrumbs, ProductSummaryInterface } from 'db/uiInterfaces';
import { DEFAULT_COMPANY_SLUG } from 'lib/config/common';
import { getProjectLinks } from 'lib/links/getProjectLinks';

import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';

interface ProductVariantsPropsInterface {
  product: ProductSummaryInterface;
}

const ProductVariants: React.FC<ProductVariantsPropsInterface> = ({ product }) => {
  const links = getProjectLinks({
    productId: product._id,
    rubricSlug: product.rubricSlug,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Связи',
    config: [
      {
        name: 'Рубрикатор',
        href: links.cms.rubrics.url,
      },
      {
        name: `${product.rubric?.name}`,
        href: links.cms.rubrics.rubricSlug.url,
      },
      {
        name: `Товары`,
        href: links.cms.rubrics.rubricSlug.products.url,
      },
      {
        name: `${product.snippetTitle}`,
        href: links.cms.rubrics.rubricSlug.products.product.productId.url,
      },
    ],
  };

  return (
    <CmsProductLayout product={product} breadcrumbs={breadcrumbs}>
      <ConsoleRubricProductVariants product={product} />
    </CmsProductLayout>
  );
};

interface ProductPageInterface
  extends GetAppInitialDataPropsInterface,
    ProductVariantsPropsInterface {}

const Product: NextPage<ProductPageInterface> = ({ layoutProps, ...props }) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <ProductVariants {...props} />
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

  const payload = await getProductFullSummaryWithDraft({
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

  const { summary } = payload;

  return {
    props: {
      ...props,
      product: castDbData(summary),
    },
  };
};

export default Product;
