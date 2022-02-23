import Inner from 'components/Inner';
import AppContentWrapper from 'components/layout/AppContentWrapper';
import AppSubNav from 'components/layout/AppSubNav';
import WpTitle from 'components/WpTitle';
import { AppContentWrapperBreadCrumbs, EventRubricInterface } from 'db/uiInterfaces';
import { useBasePath } from 'hooks/useBasePath';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as React from 'react';
import { ClientNavItemInterface } from 'types/clientTypes';

export interface EventRubricLayoutInterface {
  rubric: EventRubricInterface;
  breadcrumbs?: AppContentWrapperBreadCrumbs;
  hideAttributesLink?: boolean;
  hideDetailsLink?: boolean;
}

const EventRubricLayout: React.FC<EventRubricLayoutInterface> = ({
  rubric,
  breadcrumbs,
  children,
  hideDetailsLink,
  hideAttributesLink,
}) => {
  const { query } = useRouter();
  const routeBasePath = useBasePath('rubricSlug');

  const navConfig: ClientNavItemInterface[] = [
    {
      name: 'Мероприятия',
      testId: 'events',
      path: `${routeBasePath}/events`,
    },
    {
      name: 'Атрибуты',
      testId: 'attributes',
      path: `${routeBasePath}/attributes`,
      exact: true,
      hidden: hideAttributesLink,
    },
    {
      name: 'Детали',
      testId: 'details',
      path: routeBasePath,
      exact: true,
      hidden: hideDetailsLink,
    },
    {
      name: 'SEO тексты',
      testId: 'seo-content',
      path: `${routeBasePath}/seo-content`,
    },
  ];

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
