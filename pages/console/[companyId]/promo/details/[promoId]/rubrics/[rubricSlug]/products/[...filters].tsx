import ConsolePromoProducts, {
  ConsolePromoProductsInterface,
} from 'components/console/ConsolePromoProducts';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import ConsolePromoLayout from 'components/layout/console/ConsolePromoLayout';
import { getConsolePromoProductsListPageSsr } from 'db/ssr/company/getConsolePromoProductsListPageSsr';
import { AppContentWrapperBreadCrumbs } from 'db/uiInterfaces';
import { getProjectLinks } from 'lib/links/getProjectLinks';

import { GetConsoleInitialDataPropsInterface } from 'lib/ssrUtils';
import * as React from 'react';

export interface ConsolePromoProductsListPageInterface
  extends GetConsoleInitialDataPropsInterface,
    ConsolePromoProductsInterface {}

const ConsolePromoProductsListPage: React.FC<ConsolePromoProductsListPageInterface> = ({
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
    promoId: promo._id,
    rubricSlug: rubric.slug,
  });

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${rubric.name}`,
    config: [
      {
        name: 'Акции',
        href: links.console.companyId.promo.url,
      },
      {
        name: `${promo.name}`,
        href: links.console.companyId.promo.details.promoId.url,
      },
      {
        name: `Товары`,
        href: links.console.companyId.promo.details.promoId.rubrics.url,
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

export const getServerSideProps = getConsolePromoProductsListPageSsr;
export default ConsolePromoProductsListPage;
