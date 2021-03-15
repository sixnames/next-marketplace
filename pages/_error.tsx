import Inner from 'components/Inner/Inner';
import SiteLayout, { SiteLayoutInterface } from 'layout/SiteLayout/SiteLayout';
import { getSiteInitialData } from 'lib/ssrUtils';
import { GetStaticProps, NextPage } from 'next';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import Error from 'next/error';

interface ErrorPageInterface extends PagePropsInterface, SiteLayoutInterface {}

const ErrorPage: NextPage<ErrorPageInterface> = ({ navRubrics }) => {
  return (
    <SiteLayout navRubrics={navRubrics}>
      <Inner>
        <Error statusCode={500} />
      </Inner>
    </SiteLayout>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
  const { props, revalidate } = await getSiteInitialData({
    params,
    locale,
  });

  return {
    props,
    revalidate,
  };
};

export default ErrorPage;
