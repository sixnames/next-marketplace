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
    const links = getCmsCompanyLinks({
      companyId: company?._id,
    });

    return [
      {
        name: 'Детали',
        testId: 'company-details',
        path: links.root,
        exact: true,
      },
      {
        name: 'Изображения',
        testId: 'company-assets',
        path: links.assets,
        exact: true,
      },
      {
        name: 'Магазины',
        testId: 'company-shops',
        path: links.shop.parentLink,
        exact: true,
      },
      {
        name: 'Акции',
        testId: 'company-promo',
        path: links.promo.parentLink,
      },
      {
        name: 'Подарочные сертификаты',
        testId: 'gift-certificates',
        path: links.giftCertificate.parentLink,
      },
      {
        name: 'Рубрикатор',
        testId: 'company-rubrics',
        path: links.rubrics.parentLink,
      },
      {
        name: 'Блог',
        testId: 'company-blog',
        path: links.blog.parentLink,
      },
      {
        name: 'Страницы',
        testId: 'company-pages',
        path: links.pages.parentLink,
        hidden: !company?.domain,
      },
      {
        name: 'Категории клиентов',
        testId: 'company-user-categories',
        path: links.userCategories,
      },
      {
        name: 'Основные настройки',
        testId: 'company-global-config',
        path: links.config.root,
        hidden: !company?.domain,
        exact: true,
      },
      {
        name: 'Аналитика',
        testId: 'company-analytics',
        path: links.config.analytics,
        hidden: !company?.domain,
        exact: true,
      },
      {
        name: 'Интерфейс',
        testId: 'company-ui',
        path: links.config.ui,
        hidden: !company?.domain,
        exact: true,
      },
      {
        name: 'Контактные данные',
        testId: 'company-contacts',
        path: links.config.contacts,
        hidden: !company?.domain,
        exact: true,
      },
      {
        name: 'SEO',
        testId: 'company-seo',
        path: links.config.seo,
        hidden: !company?.domain,
        exact: true,
      },
      {
        name: 'Каталог',
        testId: 'company-catalogue',
        path: links.config.catalogue,
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
