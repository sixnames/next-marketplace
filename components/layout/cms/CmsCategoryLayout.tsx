import Inner from 'components/Inner';
import AppContentWrapper from 'components/layout/AppContentWrapper';
import AppSubNav from 'components/layout/AppSubNav';
import WpTitle from 'components/WpTitle';
import { AppContentWrapperBreadCrumbs, CategoryInterface } from 'db/uiInterfaces';
import { getConsoleRubricLinks } from 'lib/linkUtils';
import Head from 'next/head';
import * as React from 'react';
import { ClientNavItemInterface } from 'types/clientTypes';

interface CmsCategoryLayoutInterface {
  category: CategoryInterface;
  breadcrumbs?: AppContentWrapperBreadCrumbs;
  basePath?: string;
  hideAttributesPath?: boolean;
}

const CmsCategoryLayout: React.FC<CmsCategoryLayoutInterface> = ({
  category,
  breadcrumbs,
  children,
  basePath,
  hideAttributesPath,
}) => {
  const links = getConsoleRubricLinks({
    rubricSlug: `${category.rubric?.slug}`,
    basePath,
    categoryId: category._id,
  });

  const navConfig = React.useMemo<ClientNavItemInterface[]>(() => {
    return [
      {
        name: 'Детали',
        testId: 'details',
        path: links.category.root,
        exact: true,
      },
      {
        name: 'Атрибуты',
        testId: 'attributes',
        path: links.category.attributes,
        exact: true,
        hidden: hideAttributesPath,
      },
    ];
  }, [links, hideAttributesPath]);

  return (
    <AppContentWrapper breadcrumbs={breadcrumbs}>
      <Head>
        <title>{category.name}</title>
      </Head>
      <Inner lowBottom>
        <WpTitle>{category.name}</WpTitle>
      </Inner>
      <AppSubNav navConfig={navConfig} />
      {children}
    </AppContentWrapper>
  );
};

export default CmsCategoryLayout;
