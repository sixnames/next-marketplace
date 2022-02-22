import Inner from 'components/Inner';
import AppContentWrapper from 'components/layout/AppContentWrapper';
import AppSubNav from 'components/layout/AppSubNav';
import WpTitle from 'components/WpTitle';
import {
  AppContentWrapperBreadCrumbs,
  CompanyInterface,
  EventRubricInterface,
} from 'db/uiInterfaces';
import { useBasePath } from 'hooks/useBasePath';
import { getConsoleCompanyLinks } from 'lib/links/getProjectLinks';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as React from 'react';
import { ClientNavItemInterface } from 'types/clientTypes';

export interface EventRubricLayoutInterface {
  rubric: EventRubricInterface;
  breadcrumbs?: AppContentWrapperBreadCrumbs;
  pageCompany: CompanyInterface;
}

const EventRubricLayout: React.FC<EventRubricLayoutInterface> = ({
  rubric,
  breadcrumbs,
  children,
}) => {
  const { query } = useRouter();
  const routeBasePath = useBasePath('companyId');

  const navConfig = React.useMemo<ClientNavItemInterface[]>(() => {
    const links = getConsoleCompanyLinks({
      basePath: routeBasePath,
      companyId: `${query.companyId}`,
      rubricSlug: rubric.slug,
    });

    return [
      {
        name: 'Мероприятия',
        testId: 'events',
        path: links.eventRubrics.rubricSlug.events.url,
      },
      {
        name: 'Атрибуты',
        testId: 'attributes',
        path: links.eventRubrics.rubricSlug.attributes.url,
        exact: true,
      },
      {
        name: 'Детали',
        testId: 'details',
        path: links.eventRubrics.rubricSlug.url,
        exact: true,
      },
      {
        name: 'SEO тексты',
        testId: 'seo-content',
        path: links.eventRubrics.rubricSlug.seoContent.url,
      },
    ];
  }, [routeBasePath, query.companyId, rubric.slug]);

  const title = query.title || rubric.name;

  return (
    <AppContentWrapper breadcrumbs={breadcrumbs}>
      <Head>
        <title>{title}</title>
      </Head>
      <Inner lowBottom>
        <WpTitle>{title}</WpTitle>
      </Inner>
      <AppSubNav navConfig={navConfig} />
      {children}
    </AppContentWrapper>
  );
};

export default EventRubricLayout;
