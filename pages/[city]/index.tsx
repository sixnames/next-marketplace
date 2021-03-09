import { getCatalogueNavRubrics, getPageInitialData } from 'lib/catalogueUtils';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Title from 'components/Title/Title';
import Inner from 'components/Inner/Inner';
import SiteLayout, { SiteLayoutInterface } from 'layout/SiteLayout/SiteLayout';
import { castDbData } from 'lib/ssrUtils';

interface HomePageInterface extends PagePropsInterface, SiteLayoutInterface {}

const Home: NextPage<HomePageInterface> = ({ navRubrics }) => {
  return (
    <SiteLayout navRubrics={navRubrics}>
      <Inner>
        <Title>Main page</Title>
      </Inner>
    </SiteLayout>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<any, { city: string }> = async ({ params, locale }) => {
  const { city } = params || {};

  // initial data
  const rawInitialData = await getPageInitialData({ locale: `${locale}`, city: `${city}` });
  const rawNavRubrics = await getCatalogueNavRubrics({ locale: `${locale}`, city: `${city}` });
  const initialData = castDbData(rawInitialData);
  const navRubrics = castDbData(rawNavRubrics);

  return {
    props: {
      initialData,
      navRubrics,
    },
    revalidate: 5,
  };
};

export default Home;
