import Button from 'components/button/Button';
import ErrorBoundaryFallback from 'components/ErrorBoundaryFallback';
import FixedButtons from 'components/button/FixedButtons';
import Inner from 'components/Inner';
import { ISR_FIVE_SECONDS } from 'config/common';
import { CARD_LAYOUT_HALF_COLUMNS, DEFAULT_LAYOUT } from 'config/constantSelects';
import { useConfigContext } from 'context/configContext';
import { useSiteUserContext } from 'context/siteUserContext';
import { CardLayoutInterface, InitialCardDataInterface } from 'db/uiInterfaces';
import SiteLayout, { SiteLayoutProviderInterface } from 'layout/SiteLayout';
import { getCardData } from 'lib/cardUtils';
import { getIsrSiteInitialData, IsrContextInterface } from 'lib/isrUtils';
import { castDbData } from 'lib/ssrUtils';
import { cityIn } from 'lvovich';
import { GetStaticPathsResult, GetStaticPropsResult, NextPage } from 'next';
import dynamic from 'next/dynamic';
import * as React from 'react';

const CardDefaultLayout = dynamic(() => import('layout/card/CardDefaultLayout'));
const CardHalfColumnsLayout = dynamic(() => import('layout/card/CardHalfColumnsLayout'));

const CardConsumer: React.FC<CardLayoutInterface> = (props) => {
  const sessionUser = useSiteUserContext();

  return (
    <React.Fragment>
      {(props.cardData.cardLayout || DEFAULT_LAYOUT) === CARD_LAYOUT_HALF_COLUMNS ? (
        <CardHalfColumnsLayout {...props} />
      ) : (
        <CardDefaultLayout {...props} />
      )}

      {sessionUser?.showAdminUiInCatalogue ? (
        <FixedButtons>
          <Inner lowTop lowBottom>
            <Button
              size={'small'}
              onClick={() => {
                window.open(
                  `${sessionUser.editLinkBasePath}/rubrics/${props.cardData.product.rubricId}/products/product/${props.cardData.product._id}`,
                  '_blank',
                );
              }}
            >
              Редактировать товар
            </Button>
          </Inner>
        </FixedButtons>
      ) : null}
    </React.Fragment>
  );
};

interface CardInterface extends SiteLayoutProviderInterface {
  cardData?: InitialCardDataInterface | null;
}

const Card: NextPage<CardInterface> = ({ cardData, domainCompany, ...props }) => {
  const { currentCity } = props;
  const { configs } = useConfigContext();
  if (!cardData) {
    return (
      <SiteLayout {...props}>
        <ErrorBoundaryFallback />
      </SiteLayout>
    );
  }

  const siteName = configs.siteName;
  const prefixConfig = configs.catalogueMetaPrefix;
  const prefix = prefixConfig ? ` ${prefixConfig}` : '';
  const cityDescription = currentCity ? `в ${cityIn(`${currentCity.name}`)}` : '';

  return (
    <SiteLayout
      currentRubricSlug={cardData.product.rubricSlug}
      previewImage={cardData.product.mainImage}
      title={`${cardData.cardTitle}${prefix} ${cityDescription} ${siteName}`}
      description={`${cardData.cardTitle} ${cardData.product.description} ${cityDescription} ${siteName}`}
      domainCompany={domainCompany}
      {...props}
    >
      <CardConsumer
        cardData={cardData}
        companySlug={domainCompany?.slug}
        companyId={domainCompany ? `${domainCompany._id}` : null}
      />
    </SiteLayout>
  );
};

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
  const paths: any[] = [];
  return {
    paths,
    fallback: 'blocking',
  };
}

export async function getStaticProps(
  context: IsrContextInterface,
): Promise<GetStaticPropsResult<CardInterface>> {
  const { locale, params } = context;
  const { props } = await getIsrSiteInitialData({
    context,
  });

  // card data
  const rawCardData = await getCardData({
    locale: `${locale}`,
    city: props.sessionCity,
    slug: `${params?.card}`,
    companyId: props.domainCompany?._id,
    companySlug: props.companySlug,
  });

  if (!rawCardData) {
    return {
      redirect: {
        permanent: true,
        destination: `${props.urlPrefix}`,
      },
    };
  }

  return {
    revalidate: ISR_FIVE_SECONDS,
    props: {
      ...props,
      cardData: castDbData(rawCardData),
      showForIndex: true,
    },
  };
}

export default Card;
