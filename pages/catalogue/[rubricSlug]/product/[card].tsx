import ErrorBoundaryFallback from 'components/ErrorBoundaryFallback';
import { useConfigContext } from 'context/configContext';
import { ProductInterface } from 'db/uiInterfaces';
import SiteLayoutProvider, { SiteLayoutProviderInterface } from 'layout/SiteLayoutProvider';
import { getCardData } from 'lib/cardUtils';
import { castDbData, getSiteInitialData } from 'lib/ssrUtils';
import { cityIn } from 'lvovich';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import dynamic from 'next/dynamic';
import * as React from 'react';

export interface CardLayoutInterface {
  cardData: ProductInterface;
  companySlug?: string;
  companyId?: string | null;
}

const CardDefaultLayout = dynamic(() => import('layout/card/CardDefaultLayout'));
// const CardHalfColumnsLayout = dynamic(() => import('layout/card/CardHalfColumnsLayout'));

const CardConsumer: React.FC<CardLayoutInterface> = (props) => {
  // return <CardHalfColumnsLayout {...props} />;
  return <CardDefaultLayout {...props} />;
};

interface CardInterface extends SiteLayoutProviderInterface {
  cardData?: ProductInterface | null;
}

const Card: NextPage<CardInterface> = ({ cardData, company, ...props }) => {
  const { currentCity } = props;
  const { getSiteConfigSingleValue } = useConfigContext();
  if (!cardData) {
    return (
      <SiteLayoutProvider {...props}>
        <ErrorBoundaryFallback />
      </SiteLayoutProvider>
    );
  }

  const siteName = getSiteConfigSingleValue('siteName');
  const prefixConfig = getSiteConfigSingleValue('catalogueMetaPrefix');
  const prefix = prefixConfig ? ` ${prefixConfig}` : '';
  const cityDescription = currentCity ? ` в ${cityIn(`${currentCity.name}`)}` : '';

  return (
    <SiteLayoutProvider
      previewImage={cardData.mainImage}
      title={`${cardData.originalName}${prefix} ${siteName}${cityDescription}`}
      description={`${cardData.description}`}
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
