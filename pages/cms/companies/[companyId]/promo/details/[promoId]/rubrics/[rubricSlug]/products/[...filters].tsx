import * as React from 'react';
import ConsolePromoProducts, {
  ConsolePromoProductsInterface,
} from '../../../../../../../../../../components/console/ConsolePromoProducts';
import { getCmsPromoProductsListPageSsr } from '../../../../../../../../../../db/dao/ssr/getCmsPromoProductsListPageSsr';
import { AppContentWrapperBreadCrumbs } from '../../../../../../../../../../db/uiInterfaces';
import ConsoleLayout from '../../../../../../../../../../layout/cms/ConsoleLayout';
import ConsolePromoLayout from '../../../../../../../../../../layout/console/ConsolePromoLayout';
import { getCmsCompanyLinks } from '../../../../../../../../../../lib/linkUtils';
import { GetAppInitialDataPropsInterface } from '../../../../../../../../../../lib/ssrUtils';

export interface CmsPromoProductsListPageInterface
  extends GetAppInitialDataPropsInterface,
    ConsolePromoProductsInterface {}

const CmsPromoProductsListPage: React.FC<CmsPromoProductsListPageInterface> = ({
  layoutProps,
  promo,
  pageCompany,
  basePath,
  promoProducts,
  rubric,
  filters,
  search,
}) => {
  const links = getCmsCompanyLinks({
    companyId: pageCompany._id,
    promoId: promo._id,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${rubric.name}`,
    config: [
      {
        name: 'Компании',
        href: links.parentLink,
      },
      {
        name: pageCompany.name,
        href: links.root,
      },
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
      <ConsolePromoLayout basePath={basePath} promo={promo} breadcrumbs={breadcrumbs}>
        <ConsolePromoProducts
          basePath={basePath}
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
