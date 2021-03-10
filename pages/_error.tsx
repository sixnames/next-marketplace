import Inner from 'components/Inner/Inner';
import Title from 'components/Title/Title';
import { DEFAULT_CITY } from 'config/common';
import SiteLayout, { SiteLayoutInterface } from 'layout/SiteLayout/SiteLayout';
import { getCatalogueNavRubrics, getPageInitialData } from 'lib/catalogueUtils';
import { castDbData } from 'lib/ssrUtils';
import { GetStaticProps, NextPage } from 'next';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';

interface ErrorPageInterface extends PagePropsInterface, SiteLayoutInterface {}

const ErrorPage: NextPage<ErrorPageInterface> = ({ navRubrics }) => {
  return (
    <SiteLayout navRubrics={navRubrics}>
      <Inner>
        <Title>Page not found</Title>
      </Inner>
    </SiteLayout>
  );
};

export const getStaticProps: GetStaticProps<any, { city: string }> = async ({ locale }) => {
  const city = DEFAULT_CITY;

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
  };
};

export default ErrorPage;
