import Breadcrumbs from 'components/Breadcrumbs';
import { CatalogueHeadDefaultInterface } from 'components/Catalogue';
import Inner from 'components/Inner';
import TextSeoInfo from 'components/TextSeoInfo';
import Title from 'components/Title';
import { useSiteContext } from 'context/siteContext';
import { useSiteUserContext } from 'context/userSiteUserContext';
import { TextUniquenessApiParsedResponseModel } from 'db/dbModels';
import * as React from 'react';

const CatalogueHeadDefault: React.FC<CatalogueHeadDefaultInterface> = ({
  catalogueCounterString,
  seoTextClassName,
  seoTop,
  catalogueTitle,
  textTop,
  breadcrumbs,
}) => {
  const { urlPrefix } = useSiteContext();
  const sessionUser = useSiteUserContext();

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
          <div className={`mb-12`}>
            <div className={seoTextClassName}>{textTop}</div>
            {sessionUser?.showAdminUiInCatalogue && seoTop ? (
              <div className='space-y-3 mt-6'>
                {(seoTop.locales || []).map((seoLocale: TextUniquenessApiParsedResponseModel) => {
                  return (
                    <TextSeoInfo
                      showLocaleName
                      listClassName='flex gap-3 flex-wrap'
                      key={seoLocale.locale}
                      seoLocale={seoLocale}
                    />
                  );
                })}
              </div>
            ) : null}
          </div>
        ) : null}
      </Inner>
    </React.Fragment>
  );
};

export default CatalogueHeadDefault;
