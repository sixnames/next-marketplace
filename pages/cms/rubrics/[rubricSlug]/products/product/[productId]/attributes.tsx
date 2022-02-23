import ConsoleRubricProductAttributes from 'components/console/ConsoleRubricProductAttributes';
import CmsProductLayout from 'components/layout/cms/CmsProductLayout';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import { getCmsProductAttributesPageSsr } from 'db/ssr/products/getCmsProductAttributesPageSsr';
import { AppContentWrapperBreadCrumbs, ProductSummaryInterface } from 'db/uiInterfaces';
import { getProjectLinks } from 'lib/links/getProjectLinks';

import { GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';

interface CmsProductAttributesPageConsumerInterface {
  product: ProductSummaryInterface;
}

const CmsProductAttributesPageConsumer: React.FC<CmsProductAttributesPageConsumerInterface> = ({
  product,
}) => {
  const links = getProjectLinks({
    productId: product._id,
    rubricSlug: product.rubricSlug,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Атрибуты',
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
        name: `${product.cardTitle}`,
        href: links.cms.rubrics.rubricSlug.products.product.productId.url,
      },
    ],
  };

  return (
    <CmsProductLayout product={product} breadcrumbs={breadcrumbs}>
      <ConsoleRubricProductAttributes product={product} />
    </CmsProductLayout>
  );
};

export interface CmsProductAttributesPageInterface
  extends GetAppInitialDataPropsInterface,
    CmsProductAttributesPageConsumerInterface {}

const CmsProductAttributesPage: NextPage<CmsProductAttributesPageInterface> = ({
  layoutProps,
  ...props
}) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <CmsProductAttributesPageConsumer {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CmsProductAttributesPageInterface>> => {
  const props = await getCmsProductAttributesPageSsr(context);
  if (!props) {
    return {
      notFound: true,
    };
  }
  return {
    props,
  };
};
export default CmsProductAttributesPage;
