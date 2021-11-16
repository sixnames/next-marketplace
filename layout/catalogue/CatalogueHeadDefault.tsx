import Breadcrumbs from 'components/Breadcrumbs';
import { CatalogueHeadDefaultInterface } from 'components/Catalogue';
import Inner from 'components/Inner';
import PageEditor from 'components/PageEditor';
import Title from 'components/Title';
import { useSiteContext } from 'context/siteContext';
import * as React from 'react';

const CatalogueHeadDefault: React.FC<CatalogueHeadDefaultInterface> = ({
  catalogueCounterString,
  catalogueTitle,
  textTop,
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

        {textTop ? (
          <div>
            <PageEditor value={JSON.parse(textTop)} readOnly />
          </div>
        ) : null}
      </Inner>
    </React.Fragment>
  );
};

export default CatalogueHeadDefault;
