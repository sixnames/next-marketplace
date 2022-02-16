import Inner from 'components/Inner';
import AppContentWrapper from 'components/layout/AppContentWrapper';
import AppSubNav from 'components/layout/AppSubNav';
import WpTitle from 'components/WpTitle';
import { AppContentWrapperBreadCrumbs, CompanyInterface } from 'db/uiInterfaces';
import { getCmsCompanyLinks } from 'lib/links/getProjectLinks';
import Head from 'next/head';
import * as React from 'react';
import { ClientNavItemInterface } from 'types/clientTypes';

interface CmsCompanyLayoutInterface {
  company: CompanyInterface;
  breadcrumbs?: AppContentWrapperBreadCrumbs;
}

const CmsCompanyLayout: React.FC<CmsCompanyLayoutInterface> = ({
  company,
  breadcrumbs,
  children,
}) => {
  const navConfig = React.useMemo<ClientNavItemInterface[]>(() => {
    const links = getCmsCompanyLinks({
      companyId: company._id,
    });

    return [
      {
        name: 'Детали',
        testId: 'company-details',
        path: links.root.url,
        exact: true,
      },
      {
        name: 'Изображения',
        testId: 'company-assets',
        path: links.assets.url,
        exact: true,
      },
      {
        name: 'Магазины',
        testId: 'company-shops',
        path: links.shops.url,
        exact: true,
      },
      {
        name: 'Акции',
        testId: 'company-promo',
        path: links.promo.url,
      },
      {
        name: 'Подарочные сертификаты',
        testId: 'gift-certificates',
        path: links.giftCertificates.url,
      },
      {
        name: 'Рубрикатор',
        testId: 'company-rubrics',
        path: links.rubrics.url,
      },
      {
        name: 'Мероприятия',
        testId: 'company-events',
        path: links.events.url,
      },
      {
        name: 'Блог',
        testId: 'company-blog',
        path: links.blog.url,
      },
      {
        name: 'Страницы',
        testId: 'company-pages',
        path: links.pages.url,
        hidden: !company?.domain,
      },
      {
        name: 'Категории клиентов',
        testId: 'company-user-categories',
        path: links.userCategories.url,
      },
      {
        name: 'Задачи',
        testId: 'company-tasks',
        path: links.tasks.url,
      },
      {
        name: 'Типы задач',
        testId: 'company-task-variants',
        path: links.taskVariants.url,
      },
      {
        name: 'Основные настройки',
        testId: 'company-global-config',
        path: links.config.url,
        hidden: !company?.domain,
        exact: true,
      },
      {
        name: 'Аналитика',
        testId: 'company-analytics',
        path: links.config.analytics.url,
        hidden: !company?.domain,
        exact: true,
      },
      {
        name: 'Интерфейс',
        testId: 'company-ui',
        path: links.config.ui.url,
        hidden: !company?.domain,
        exact: true,
      },
      {
        name: 'Контактные данные',
        testId: 'company-contacts',
        path: links.config.contacts.url,
        hidden: !company?.domain,
        exact: true,
      },
      {
        name: 'SEO',
        testId: 'company-seo',
        path: links.config.seo.url,
        hidden: !company?.domain,
        exact: true,
      },
      {
        name: 'Каталог',
        testId: 'company-catalogue',
        path: links.config.catalogue.url,
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
