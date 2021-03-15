import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import ThankYouRoute from 'routes/ThankYouRoute/ThankYouRoute';
import SiteLayout, { SiteLayoutInterface } from 'layout/SiteLayout/SiteLayout';
import { getSiteInitialData } from 'lib/ssrUtils';

interface ThankYouInterface extends PagePropsInterface, SiteLayoutInterface {}

const ThankYou: NextPage<ThankYouInterface> = ({ navRubrics }) => {
  return (
    <SiteLayout title={'Спасибо за заказ!'} navRubrics={navRubrics}>
      <ThankYouRoute />
    </SiteLayout>
  );
};

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<ThankYouInterface>> {
  const { locale, query } = context;

  const { cityNotFound, props, redirectPayload } = await getSiteInitialData({
    params: query,
    locale,
  });

  if (cityNotFound) {
    return redirectPayload;
  }

  return {
    props,
  };
}

export default ThankYou;
