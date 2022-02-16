import ConsolePromoProducts, {
  ConsolePromoProductsInterface,
} from 'components/console/ConsolePromoProducts';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import ConsolePromoLayout from 'components/layout/console/ConsolePromoLayout';
import { getCmsPromoProductsListPageSsr } from 'db/ssr/promo/getCmsPromoProductsListPageSsr';
import { AppContentWrapperBreadCrumbs } from 'db/uiInterfaces';
import { getCmsCompanyLinks } from 'lib/linkUtils';
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
  const links = getCmsCompanyLinks({
    companyId: pageCompany._id,
    rubricSlug: rubric.slug,
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
        href: links.parentLink,
      },
      {
        name: 'Акции',
        href: links.promo.parentLink,
      },
      {
        name: `${promo.name}`,
        href: links.promo.parentLink,
      },
      {
        name: `Товары`,
        href: links.promo.rubrics.parentLink,
      },
    ],
  };

  return (
    <ConsoleLayout title={`${promo.name}`} {...layoutProps}>
      <ConsolePromoLayout promo={promo} breadcrumbs={breadcrumbs}>
        <ConsolePromoProducts
          basePath={links.promo.rubrics.product.parentLink}
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
