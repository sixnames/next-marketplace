import { RubricModel } from 'db/dbModels';
import dynamic from 'next/dynamic';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';

const SiteLayout = dynamic(() => import('layout/SiteLayout/SiteLayout'));
const CompanyDefaultLayout = dynamic(
  () => import('layout/CompanyDefaultLayout/CompanyDefaultLayout'),
);

export interface SiteLayoutProviderInterface extends PagePropsInterface {
  title?: string;
  description?: string;
  navRubrics: RubricModel[];
  previewImage?: string;
}

const SiteLayoutProvider: React.FC<SiteLayoutProviderInterface> = ({ children, ...props }) => {
  if (props.company) {
    return <CompanyDefaultLayout {...props}>{children}</CompanyDefaultLayout>;
  }

  return <SiteLayout {...props}>{children}</SiteLayout>;
};

export default SiteLayoutProvider;
