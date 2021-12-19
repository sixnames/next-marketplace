import * as React from 'react';
import { CatalogueHeadDefaultInterface } from '../../components/Catalogue';
import Inner from '../../components/Inner';
import WpBreadcrumbs from '../../components/WpBreadcrumbs';
import WpTitle from '../../components/WpTitle';
import { useSiteContext } from '../../context/siteContext';

const CatalogueHeadDefault: React.FC<CatalogueHeadDefaultInterface> = ({
  catalogueCounterString,
  catalogueTitle,
  breadcrumbs,
}) => {
  const { urlPrefix } = useSiteContext();

  return (
    <React.Fragment>
      <WpBreadcrumbs config={breadcrumbs} urlPrefix={urlPrefix} />
      <Inner lowBottom lowTop>
        <WpTitle
          testId={'catalogue-title'}
          subtitle={<span className='lg:hidden'>{catalogueCounterString}</span>}
        >
          {catalogueTitle}
        </WpTitle>
      </Inner>
    </React.Fragment>
  );
};

export default CatalogueHeadDefault;
