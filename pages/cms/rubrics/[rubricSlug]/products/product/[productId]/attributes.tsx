import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';
import ConsoleRubricProductAttributes from '../../../../../../../components/console/ConsoleRubricProductAttributes';
import { getCmsProductAttributesPageSsr } from '../../../../../../../db/dao/ssr/getCmsProductAttributesPageSsr';
import {
  AppContentWrapperBreadCrumbs,
  ProductSummaryInterface,
} from '../../../../../../../db/uiInterfaces';
import CmsProductLayout from '../../../../../../../layout/cms/CmsProductLayout';
import ConsoleLayout from '../../../../../../../layout/cms/ConsoleLayout';
import { getConsoleRubricLinks } from '../../../../../../../lib/linkUtils';
import { GetAppInitialDataPropsInterface } from '../../../../../../../lib/ssrUtils';

interface CmsProductAttributesPageConsumerInterface {
  product: ProductSummaryInterface;
}

const CmsProductAttributesPageConsumer: React.FC<CmsProductAttributesPageConsumerInterface> = ({
  product,
}) => {
  const links = getConsoleRubricLinks({
    productId: product._id,
    rubricSlug: product.rubricSlug,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Атрибуты',
    config: [
      {
        name: 'Рубрикатор',
        href: links.parentLink,
      },
      {
        name: `${product.rubric?.name}`,
        href: links.parentLink,
      },
      {
        name: `Товары`,
        href: links.product.parentLink,
      },
      {
        name: `${product.cardTitle}`,
        href: links.product.root,
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
