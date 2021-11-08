import Button from 'components/button/Button';
import ErrorBoundaryFallback from 'components/ErrorBoundaryFallback';
import FixedButtons from 'components/button/FixedButtons';
import Inner from 'components/Inner';
import { CARD_LAYOUT_HALF_COLUMNS, DEFAULT_LAYOUT } from 'config/constantSelects';
import { useConfigContext } from 'context/configContext';
import { InitialCardDataInterface } from 'db/uiInterfaces';
import SiteLayout, { SiteLayoutProviderInterface } from 'layout/SiteLayout';
import { getCardData } from 'lib/cardUtils';
import { castDbData, getSiteInitialData } from 'lib/ssrUtils';
import { cityIn } from 'lvovich';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
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
      {configs.showAdminUiInCatalogue ? (
        <FixedButtons>
          <Inner lowTop lowBottom>
            <Button
              size={'small'}
              onClick={() => {
                window.open(
                  `${configs.editLinkBasePath}/rubrics/${cardData.product.rubricId}/products/product/${cardData.product._id}`,
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

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CardInterface>> {
  const { locale, query } = context;
  // console.log(' ');
  // console.log('==================================');
  // const startTime = new Date().getTime();

  const { props } = await getSiteInitialData({
    context,
  });
  // console.log(`After initial data `, new Date().getTime() - startTime);

  // card data
  const { useUniqueConstructor, showAdminUiInCatalogue } = props.initialData.configs;
  const rawCardData = await getCardData({
    locale: `${locale}`,
    city: props.sessionCity,
    slug: `${query.card}`,
    companyId: props.domainCompany?._id,
    companySlug: props.companySlug,
    useUniqueConstructor,
    showAdminUiInCatalogue,
  });
  const cardData = castDbData(rawCardData);
  // console.log(`After card `, new Date().getTime() - startTime);

  if (!cardData) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...props,
      cardData,
    },
  };
}

export default Card;
