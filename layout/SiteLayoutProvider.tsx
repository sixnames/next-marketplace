import { PagesGroupInterface, RubricInterface } from 'db/uiInterfaces';
import dynamic from 'next/dynamic';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';

const SiteLayout = dynamic(() => import('layout/SiteLayout/SiteLayout'));
const CompanyDefaultLayout = dynamic(
  () => import('layout/CompanyDefaultLayout/CompanyDefaultLayout'),
);

export interface SiteLayoutCatalogueCreatedPages {
  footerPageGroups: PagesGroupInterface[];
  headerPageGroups: PagesGroupInterface[];
}

export interface SiteLayoutProviderInterface
  extends PagePropsInterface,
    SiteLayoutCatalogueCreatedPages {
  title?: string;
  description?: string;
  navRubrics: RubricInterface[];
  previewImage?: string;
}

const SiteLayoutProvider: React.FC<SiteLayoutProviderInterface> = ({ children, ...props }) => {
  if (props.company) {
    return <CompanyDefaultLayout {...props}>{children}</CompanyDefaultLayout>;
  }

  return <SiteLayout {...props}>{children}</SiteLayout>;
};

export default SiteLayoutProvider;
