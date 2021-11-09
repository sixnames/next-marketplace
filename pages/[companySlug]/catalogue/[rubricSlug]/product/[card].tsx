import Button from 'components/button/Button';
import ErrorBoundaryFallback from 'components/ErrorBoundaryFallback';
import FixedButtons from 'components/button/FixedButtons';
import Inner from 'components/Inner';
import { ISR_FIVE_SECONDS } from 'config/common';
import { CARD_LAYOUT_HALF_COLUMNS, DEFAULT_LAYOUT } from 'config/constantSelects';
import { useConfigContext } from 'context/configContext';
import { useSiteUserContext } from 'context/userSiteUserContext';
import { InitialCardDataInterface } from 'db/uiInterfaces';
import SiteLayout, { SiteLayoutProviderInterface } from 'layout/SiteLayout';
import { getCardData } from 'lib/cardUtils';
import { getIsrSiteInitialData, IsrContextInterface } from 'lib/isrUtils';
import { castDbData } from 'lib/ssrUtils';
import { cityIn } from 'lvovich';
import { GetStaticPathsResult, GetStaticPropsResult, NextPage } from 'next';
import dynamic from 'next/dynamic';
import * as React from 'react';

export interface CardLayoutInterface {
  cardData: InitialCardDataInterface;
  companySlug?: string;
  companyId?: string | null;
}

const CardDefaultLayout = dynamic(() => import('layout/card/CardDefaultLayout'));
const CardHalfColumnsLayout = dynamic(() => import('layout/card/CardHalfColumnsLayout'));

const CardConsumer: React.FC<CardLayoutInterface> = (props) => {
  const layoutVariant = props.cardData.cardLayout || DEFAULT_LAYOUT;

  if (layoutVariant === CARD_LAYOUT_HALF_COLUMNS) {
    return <CardHalfColumnsLayout {...props} />;
  }

  return <CardDefaultLayout {...props} />;
};

interface CardInterface extends SiteLayoutProviderInterface {
  cardData?: InitialCardDataInterface | null;
}

const Card: NextPage<CardInterface> = ({ cardData, domainCompany, ...props }) => {
  const { currentCity } = props;
  const sessionUser = useSiteUserContext();
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
  const cityDescription = currentCity ? ` в ${cityIn(`${currentCity.name}`)}` : '';

  return (
    <SiteLayout
      previewImage={cardData.product.mainImage}
      title={`${cardData.cardTitle}${prefix} ${siteName}${cityDescription}`}
      description={`${cardData.cardTitle} ${cardData.product.description}`}
      domainCompany={domainCompany}
      {...props}
    >
      <CardConsumer
        cardData={cardData}
        companySlug={domainCompany?.slug}
        companyId={domainCompany ? `${domainCompany._id}` : null}
      />
      {sessionUser?.showAdminUiInCatalogue ? (
        <FixedButtons>
          <Inner lowTop lowBottom>
            <Button
              size={'small'}
              onClick={() => {
                window.open(
                  `${sessionUser.editLinkBasePath}/rubrics/${cardData.product.rubricId}/products/product/${cardData.product._id}`,
                  '_blank',
                );
              }}
            >
              Редактировать товар
            </Button>
          </Inner>
        </FixedButtons>
      ) : null}
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
  const { useUniqueConstructor } = props.initialData.configs;
  const rawCardData = await getCardData({
    locale: `${locale}`,
    city: props.sessionCity,
    slug: `${params?.card}`,
    companyId: props.domainCompany?._id,
    companySlug: props.companySlug,
    useUniqueConstructor,
  });
  const cardData = castDbData(rawCardData);

  if (!cardData) {
    return {
      notFound: true,
    };
  }

  return {
    revalidate: ISR_FIVE_SECONDS,
    props: {
      ...props,
      cardData,
    },
  };
}

export default Card;
