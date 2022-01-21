import * as React from 'react';
import ConsolePromoProducts, {
  ConsolePromoProductsInterface,
} from '../../../../../../../../../components/console/ConsolePromoProducts';
import { getConsolePromoProductsListPageSsr } from '../../../../../../../../../db/dao/ssr/getConsolePromoProductsListPageSsr';
import { AppContentWrapperBreadCrumbs } from '../../../../../../../../../db/uiInterfaces';
import ConsoleLayout from '../../../../../../../../../layout/cms/ConsoleLayout';
import ConsolePromoLayout from '../../../../../../../../../layout/console/ConsolePromoLayout';
import { getConsoleCompanyLinks } from '../../../../../../../../../lib/linkUtils';
import { GetConsoleInitialDataPropsInterface } from '../../../../../../../../../lib/ssrUtils';

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
  const links = getConsoleCompanyLinks({
    companyId: pageCompany._id,
    promoId: promo._id,
    rubricSlug: rubric.slug,
  });

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${rubric.name}`,
    config: [
      {
        name: 'Акции',
        href: links.promo.parentLink,
      },
      {
        name: `${promo.name}`,
        href: links.promo.root,
      },
      {
        name: `Товары`,
        href: links.promo.rubrics.parentLink,
      },
    ],
  };

  return (
    <ConsoleLayout title={`${promo.name}`} {...layoutProps}>
      <ConsolePromoLayout basePath={links.parentLink} promo={promo} breadcrumbs={breadcrumbs}>
        <ConsolePromoProducts
          basePath={links.root}
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
