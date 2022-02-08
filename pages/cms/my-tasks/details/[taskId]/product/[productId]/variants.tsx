import ConsoleRubricProductConnections from 'components/console/ConsoleRubricProductConnections';
import { getTaskVariantSlugByRule } from 'config/constantSelects';
import CmsProductLayout from 'layout/cms/CmsProductLayout';
import ConsoleLayout from 'layout/cms/ConsoleLayout';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';
import { DEFAULT_COMPANY_SLUG } from 'config/common';
import { AppContentWrapperBreadCrumbs, ProductSummaryInterface } from 'db/uiInterfaces';
import { getConsoleRubricLinks } from 'lib/linkUtils';
import { getFullProductSummaryWithDraft } from 'lib/productUtils';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';

interface ProductVariantsPropsInterface {
  product: ProductSummaryInterface;
}

const ProductVariants: React.FC<ProductVariantsPropsInterface> = ({ product }) => {
  const links = getConsoleRubricLinks({
    productId: product._id,
    rubricSlug: product.rubricSlug,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Связи',
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
      {
        name: `${product.snippetTitle}`,
        href: links.product.root,
      },
    ],
  };

  return (
    <CmsProductLayout product={product} breadcrumbs={breadcrumbs}>
      <ConsoleRubricProductConnections product={product} />
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

  const payload = await getFullProductSummaryWithDraft({
    locale: props.sessionLocale,
    productId: `${productId}`,
    companySlug: DEFAULT_COMPANY_SLUG,
    userId: props.layoutProps.sessionUser.me._id,
    isContentManager: Boolean(props.layoutProps.sessionUser.me.role?.isContentManager),
    taskVariantSlug: getTaskVariantSlugByRule('updateProductVariants'),
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
