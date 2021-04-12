import { RubricModel } from 'db/dbModels';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';

export interface CompanyDefaultLayoutInterface extends PagePropsInterface {
  title?: string;
  description?: string;
  navRubrics: RubricModel[];
  previewImage?: string;
}

const CompanyDefaultLayout: React.FC<CompanyDefaultLayoutInterface> = () => {
  return <div>Company</div>;
};

export default CompanyDefaultLayout;
