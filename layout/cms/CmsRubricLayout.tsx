import Head from 'next/head';
import { useRouter } from 'next/router';
import * as React from 'react';
import Inner from '../../components/Inner';
import WpTitle from '../../components/WpTitle';
import { AppContentWrapperBreadCrumbs, RubricInterface } from '../../db/uiInterfaces';
import { getConsoleRubricLinks } from '../../lib/linkUtils';
import { ClientNavItemInterface } from '../../types/clientTypes';
import AppContentWrapper from '../AppContentWrapper';
import AppSubNav from '../AppSubNav';

interface CmsRubricLayoutInterface {
  rubric: RubricInterface;
  basePath?: string;
  breadcrumbs?: AppContentWrapperBreadCrumbs;
  hideAttributesPath?: boolean;
}

const CmsRubricLayout: React.FC<CmsRubricLayoutInterface> = ({
  rubric,
  basePath,
  breadcrumbs,
  children,
  hideAttributesPath,
}) => {
  const { query } = useRouter();

  const navConfig = React.useMemo<ClientNavItemInterface[]>(() => {
    const links = getConsoleRubricLinks({
      basePath,
      rubricSlug: rubric.slug,
    });

    return [
      {
        name: 'Товары',
        testId: 'products',
        path: links.product.parentLink,
      },
      {
        name: 'Атрибуты',
        testId: 'attributes',
        path: links.attributes,
        exact: true,
        hidden: hideAttributesPath,
      },
      {
        name: 'Категории',
        testId: 'categories',
        path: links.category.parentLink,
      },
      {
        name: 'Детали',
        testId: 'details',
        path: links.root,
        exact: true,
      },
      {
        name: 'SEO тексты',
        testId: 'seo-content',
        path: links.seoContent,
      },
    ];
  }, [basePath, hideAttributesPath, rubric.slug]);

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

export default CmsRubricLayout;
