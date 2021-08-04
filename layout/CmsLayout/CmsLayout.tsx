import CmsWrapper from 'layout/CmsLayout/CmsWrapper';
import * as React from 'react';
import { PageUrlsInterface } from '../Meta';

interface AppLayoutInterface {
  description?: string;
  title?: string;
  pageUrls: PageUrlsInterface;
}

const CmsLayout: React.FC<AppLayoutInterface> = ({ children, pageUrls, title }) => {
  return (
    <CmsWrapper pageUrls={pageUrls} title={title}>
      {children}
    </CmsWrapper>
  );
};

export default CmsLayout;
