import WpBreadcrumbs from 'components/WpBreadcrumbs';
import { BreadcrumbsItemInterface } from 'db/uiInterfaces';
import { getBasePath } from 'lib/links/linkUtils';
import { useRouter } from 'next/router';
import * as React from 'react';

export interface ConsoleBreadcrumbsConfigItemInterface {
  breakpoint: string;
  name: string;
}

export type ConsoleBreadcrumbsConfig = ConsoleBreadcrumbsConfigItemInterface[];

export interface ConsoleBreadcrumbsInterface {
  config?: ConsoleBreadcrumbsConfig;
  currentPageName?: string;
}

export const ConsoleBreadcrumbs: React.FC<ConsoleBreadcrumbsInterface> = ({
  config,
  currentPageName,
}) => {
  const { asPath, query } = useRouter();
  if (!config || config.length < 1) {
    return null;
  }

  const breadcrumbsConfig: BreadcrumbsItemInterface[] = [];
  config.forEach(({ breakpoint, name }) => {
    const basePath = getBasePath({
      breakpoint,
      query,
      asPath,
    });

    breadcrumbsConfig.push({
      name,
      href: basePath,
    });
  });

  return (
    <WpBreadcrumbs
      currentPageName={currentPageName}
      config={breadcrumbsConfig}
      noMainPage={true}
      lowWrapper={true}
      lowBottom={true}
    />
  );
};
