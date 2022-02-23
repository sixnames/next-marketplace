import ConsolePromoProducts, {
  ConsolePromoProductsInterface,
} from 'components/console/ConsolePromoProducts';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import ConsolePromoLayout from 'components/layout/console/ConsolePromoLayout';
import { getCmsPromoProductsListPageSsr } from 'db/ssr/promo/getCmsPromoProductsListPageSsr';
import { AppContentWrapperBreadCrumbs } from 'db/uiInterfaces';
import { getProjectLinks } from 'lib/links/getProjectLinks';

import { GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import * as React from 'react';

export interface CmsPromoProductsListPageInterface
  extends GetAppInitialDataPropsInterface,
    Omit<ConsolePromoProductsInterface, 'basePath'> {}

const CmsPromoProductsListPage: React.FC<CmsPromoProductsListPageInterface> = ({
  layoutProps,
  promo,
  pageCompany,
  promoProducts,
  rubric,
  filters,
  search,
}) => {
  const links = getProjectLinks({
    companyId: pageCompany._id,
    rubricSlug: rubric.slug,
    promoId: promo._id,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${rubric.name}`,
    config: [
      {
        name: 'Компании',
        href: links.cms.companies.url,
      },
      {
        name: pageCompany.name,
        href: links.cms.companies.companyId.url,
      },
      {
        name: 'Акции',
        href: links.cms.companies.companyId.promo.url,
      },
      {
        name: `${promo.name}`,
        href: links.cms.companies.companyId.promo.details.promoId.url,
      },
      {
        name: `Товары`,
        href: links.cms.companies.companyId.promo.details.promoId.rubrics.url,
      },
    ],
  };

  return (
    <ConsoleLayout title={`${promo.name}`} {...layoutProps}>
      <ConsolePromoLayout promo={promo} breadcrumbs={breadcrumbs}>
        <ConsolePromoProducts
          promo={promo}
          rubric={rubric}
          pageCompany={pageCompany}
          promoProducts={promoProducts}
          filters={filters}
          search={search}
        />
      </ConsolePromoLayout>
    </ConsoleLayout>
  );
};

export const getServerSideProps = getCmsPromoProductsListPageSsr;
export default CmsPromoProductsListPage;
