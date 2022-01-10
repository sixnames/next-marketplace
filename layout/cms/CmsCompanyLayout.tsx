import Head from 'next/head';
import * as React from 'react';
import Inner from '../../components/Inner';
import WpTitle from '../../components/WpTitle';
import { AppContentWrapperBreadCrumbs, CompanyInterface } from '../../db/uiInterfaces';
import { getCmsCompanyLinks } from '../../lib/linkUtils';
import { ClientNavItemInterface } from '../../types/clientTypes';
import AppContentWrapper from '../AppContentWrapper';
import AppSubNav from '../AppSubNav';

interface CmsCompanyLayoutInterface {
  company?: CompanyInterface | null;
  breadcrumbs?: AppContentWrapperBreadCrumbs;
}

const CmsCompanyLayout: React.FC<CmsCompanyLayoutInterface> = ({
  company,
  breadcrumbs,
  children,
}) => {
  const navConfig = React.useMemo<ClientNavItemInterface[]>(() => {
    const {
      root,
      assets,
      shops,
      promo,
      giftCertificates,
      rubrics,
      blog,
      pages,
      userCategories,
      config,
    } = getCmsCompanyLinks({
      companyId: company?._id,
    });

    return [
      {
        name: 'Детали',
        testId: 'company-details',
        path: root,
        exact: true,
      },
      {
        name: 'Изображения',
        testId: 'company-assets',
        path: assets,
        exact: true,
      },
      {
        name: 'Магазины',
        testId: 'company-shops',
        path: shops,
        exact: true,
      },
      {
        name: 'Акции',
        testId: 'company-promo',
        path: promo.parentLink,
      },
      {
        name: 'Подарочные сертификаты',
        testId: 'gift-certificates',
        path: giftCertificates,
      },
      {
        name: 'Рубрикатор',
        testId: 'company-rubrics',
        path: rubrics.parentLink,
      },
      {
        name: 'Блог',
        testId: 'company-blog',
        path: blog,
      },
      {
        name: 'Страницы',
        testId: 'company-pages',
        path: pages,
        hidden: !company?.domain,
      },
      {
        name: 'Категории клиентов',
        testId: 'company-user-categories',
        path: userCategories,
      },
      {
        name: 'Основные настройки',
        testId: 'company-global-config',
        path: config.root,
        hidden: !company?.domain,
        exact: true,
      },
      {
        name: 'Аналитика',
        testId: 'company-analytics',
        path: config.analytics,
        hidden: !company?.domain,
        exact: true,
      },
      {
        name: 'Интерфейс',
        testId: 'company-ui',
        path: config.ui,
        hidden: !company?.domain,
        exact: true,
      },
      {
        name: 'Контактные данные',
        testId: 'company-contacts',
        path: config.contacts,
        hidden: !company?.domain,
        exact: true,
      },
      {
        name: 'SEO',
        testId: 'company-seo',
        path: config.seo,
        hidden: !company?.domain,
        exact: true,
      },
      {
        name: 'Каталог',
        testId: 'company-catalogue',
        path: config.catalogue,
        hidden: !company?.domain,
        exact: true,
      },
    ];
  }, [company]);

  return (
    <AppContentWrapper breadcrumbs={breadcrumbs}>
      <Head>
        <title>{company?.name}</title>
      </Head>
      <Inner lowBottom>
        <WpTitle>{company?.name}</WpTitle>
      </Inner>
      <AppSubNav navConfig={navConfig} />
      {children}
    </AppContentWrapper>
  );
};

export default CmsCompanyLayout;
