import Inner from 'components/Inner';
import AppContentWrapper from 'components/layout/AppContentWrapper';
import AppSubNav from 'components/layout/AppSubNav';
import WpTitle from 'components/WpTitle';
import { AppContentWrapperBreadCrumbs, RubricInterface } from 'db/uiInterfaces';
import { getConsoleCompanyLinks } from 'lib/links/getProjectLinks';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as React from 'react';
import { ClientNavItemInterface } from 'types/clientTypes';

interface EventRubricLayoutInterface {
  rubric: RubricInterface;
  basePath: string;
  breadcrumbs?: AppContentWrapperBreadCrumbs;
}

const EventRubricLayout: React.FC<EventRubricLayoutInterface> = ({
  rubric,
  basePath,
  breadcrumbs,
  children,
}) => {
  const { query } = useRouter();

  const navConfig = React.useMemo<ClientNavItemInterface[]>(() => {
    const links = getConsoleCompanyLinks({
      basePath,
      companyId: `${query.companyId}`,
      rubricSlug: rubric.slug,
    });

    return [
      {
        name: 'Товары',
        testId: 'events',
        path: links.events.rubricSlug.events.url,
      },
      {
        name: 'Атрибуты',
        testId: 'attributes',
        path: links.events.rubricSlug.attributes.url,
        exact: true,
      },
      {
        name: 'Детали',
        testId: 'details',
        path: links.events.rubricSlug.url,
        exact: true,
      },
      {
        name: 'SEO тексты',
        testId: 'seo-content',
        path: links.events.rubricSlug.seoContent.url,
      },
    ];
  }, [basePath, query.companyId, rubric.slug]);

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
