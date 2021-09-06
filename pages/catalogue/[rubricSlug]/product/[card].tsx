import ErrorBoundaryFallback from 'components/ErrorBoundaryFallback';
import { CARD_LAYOUT_HALF_COLUMNS, DEFAULT_LAYOUT } from 'config/constantSelects';
import { useConfigContext } from 'context/configContext';
import { InitialCardDataInterface } from 'db/uiInterfaces';
import SiteLayoutProvider, { SiteLayoutProviderInterface } from 'layout/SiteLayoutProvider';
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

const Card: NextPage<CardInterface> = ({ cardData, company, ...props }) => {
  const { currentCity } = props;
  const { configs } = useConfigContext();
  if (!cardData) {
    return (
      <SiteLayoutProvider {...props}>
        <ErrorBoundaryFallback />
      </SiteLayoutProvider>
    );
  }

  const siteName = configs.siteName;
  const prefixConfig = configs.catalogueMetaPrefix;
  const prefix = prefixConfig ? ` ${prefixConfig}` : '';
  const cityDescription = currentCity ? ` в ${cityIn(`${currentCity.name}`)}` : '';

  return (
    <SiteLayoutProvider
      previewImage={cardData.product.mainImage}
      title={`${cardData.cardTitle}${prefix} ${siteName}${cityDescription}`}
      description={`${cardData.cardTitle} ${cardData.product.description}`}
      company={company}
      {...props}
    >
      <CardConsumer
        cardData={cardData}
        companySlug={company?.slug}
        companyId={company ? `${company._id}` : null}
      />
    </SiteLayoutProvider>
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
  const rawCardData = await getCardData({
    locale: `${locale}`,
    city: props.sessionCity,
    slug: `${query.card}`,
    companyId: props.company?._id,
    companySlug: props.companySlug,
    useUniqueConstructor: props.initialData.configs.useUniqueConstructor,
  });
  const cardData = castDbData(rawCardData);
  // console.log(`After card `, new Date().getTime() - startTime);

  return {
    props: {
      ...props,
      cardData,
    },
  };
}

export default Card;
