import Breadcrumbs from 'components/Breadcrumbs';
import { CatalogueHeadDefaultInterface } from 'components/Catalogue';
import Inner from 'components/Inner';
import Title from 'components/Title';
import { useSiteContext } from 'context/siteContext';
import * as React from 'react';

const CatalogueHeadDefault: React.FC<CatalogueHeadDefaultInterface> = ({
  catalogueCounterString,
  catalogueTitle,
  breadcrumbs,
}) => {
  const { urlPrefix } = useSiteContext();

  return (
    <React.Fragment>
      <Breadcrumbs config={breadcrumbs} urlPrefix={urlPrefix} />
      <Inner lowBottom lowTop>
        <Title
          testId={'catalogue-title'}
          subtitle={<span className='lg:hidden'>{catalogueCounterString}</span>}
        >
          {catalogueTitle}
        </Title>
      </Inner>
    </React.Fragment>
  );
};

export default CatalogueHeadDefault;
