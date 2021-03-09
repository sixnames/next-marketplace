import { getCatalogueNavRubrics, getPageInitialData } from 'lib/catalogueUtils';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import ThankYouRoute from 'routes/ThankYouRoute/ThankYouRoute';
import SiteLayout, { SiteLayoutInterface } from 'layout/SiteLayout/SiteLayout';
import { castDbData } from 'lib/ssrUtils';

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

  // initial data
  const rawInitialData = await getPageInitialData({ locale: `${locale}`, city: `${query.city}` });
  const rawNavRubrics = await getCatalogueNavRubrics({
    locale: `${locale}`,
    city: `${query.city}`,
  });
  const initialData = castDbData(rawInitialData);
  const navRubrics = castDbData(rawNavRubrics);

  return {
    props: {
      initialData,
      navRubrics,
    },
  };
}

export default ThankYou;
