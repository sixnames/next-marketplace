import * as React from 'react';
import { CatalogueHeadDefaultInterface } from '../../components/Catalogue';
import Inner from '../../components/Inner';
import WpBreadcrumbs from '../../components/WpBreadcrumbs';
import WpTitle from '../../components/WpTitle';

const CatalogueHeadDefault: React.FC<CatalogueHeadDefaultInterface> = ({
  catalogueCounterString,
  catalogueTitle,
  breadcrumbs,
}) => {
  return (
    <React.Fragment>
      <WpBreadcrumbs config={breadcrumbs} />
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
