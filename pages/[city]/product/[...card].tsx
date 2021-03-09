import ErrorBoundaryFallback from 'components/ErrorBoundary/ErrorBoundaryFallback';
import { GetCatalogueCardQuery } from 'generated/apolloComponents';
import SiteLayout, { SiteLayoutInterface } from 'layout/SiteLayout/SiteLayout';
import { alwaysArray } from 'lib/arrayUtils';
import { getCardData } from 'lib/cardUtils';
import { getCatalogueNavRubrics, getPageInitialData } from 'lib/catalogueUtils';
import { castDbData } from 'lib/ssrUtils';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import CardRoute from 'routes/CardRoute/CardRoute';

interface CardInterface extends PagePropsInterface, SiteLayoutInterface {
  cardData?: GetCatalogueCardQuery['getProductCard'] | null;
}

const Card: NextPage<CardInterface> = ({ cardData, navRubrics }) => {
  if (!cardData) {
    return (
      <SiteLayout navRubrics={navRubrics}>
        <ErrorBoundaryFallback />
      </SiteLayout>
    );
  }

  return (
    <SiteLayout navRubrics={navRubrics}>
      <CardRoute cardData={cardData} />
    </SiteLayout>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<any, { city: string; card: string[] }> = async ({
  params,
  locale,
}) => {
  const { city, card } = params || {};

  // initial data
  const rawInitialData = await getPageInitialData({ locale: `${locale}`, city: `${city}` });
  const rawNavRubrics = await getCatalogueNavRubrics({ locale: `${locale}`, city: `${city}` });
  const initialData = castDbData(rawInitialData);
  const navRubrics = castDbData(rawNavRubrics);

  // card data
  const rawCardData = await getCardData({
    locale: `${locale}`,
    city: `${city}`,
    slug: alwaysArray(card),
  });
  const cardData = castDbData(rawCardData);

  return {
    props: {
      initialData,
      navRubrics,
      cardData,
    },
    revalidate: 5,
  };
};

/*export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<any>> {
  try {
    const { apolloClient } = await getSiteInitialData(context);

    // Get product card data
    const { query } = context;
    const { card } = query;

    const { data } = await apolloClient.query<
      GetCatalogueCardQuery,
      GetCatalogueCardQueryVariables
    >({
      query: CATALOGUE_CARD_QUERY,
      variables: {
        slug: alwaysArray(card),
      },
    });

    return {
      props: {
        initialApolloState: apolloClient.cache.extract(),
        cardData: data?.getProductCard,
      },
    };
  } catch (e) {
    console.log('====== get Site server side props error ======');
    console.log(JSON.stringify(e, null, 2));
    return { props: {} };
  }
}*/

export default Card;
