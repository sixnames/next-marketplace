import Breadcrumbs from 'components/Breadcrumbs';
import Button from 'components/button/Button';
import FixedButtons from 'components/button/FixedButtons';
import { CatalogueHeadDefaultInterface } from 'components/Catalogue';
import Inner from 'components/Inner';
import PageEditor from 'components/PageEditor';
import Title from 'components/Title';
import { useSiteContext } from 'context/siteContext';
import { useSiteUserContext } from 'context/userSiteUserContext';
import { useRouter } from 'next/router';
import * as React from 'react';

const CatalogueHeadDefault: React.FC<CatalogueHeadDefaultInterface> = ({
  catalogueCounterString,
  catalogueTitle,
  textTop,
  breadcrumbs,
  textTopEditUrl,
}) => {
  const router = useRouter();
  const { urlPrefix } = useSiteContext();
  const sessionUser = useSiteUserContext();
  const { asPath } = router;

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

        {sessionUser?.showAdminUiInCatalogue ? (
          <FixedButtons>
            <Button
              size={'small'}
              onClick={() => {
                window.open(
                  `${sessionUser?.editLinkBasePath}${textTopEditUrl}?url=${asPath}`,
                  '_blank',
                );
              }}
            >
              Редактировать SEO текст
            </Button>
          </FixedButtons>
        ) : null}
      </Inner>
    </React.Fragment>
  );
};

export default CatalogueHeadDefault;
