import { getCatalogueNavRubrics, getPageInitialData } from 'lib/catalogueUtils';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import SiteLayout, { SiteLayoutInterface } from 'layout/SiteLayout/SiteLayout';
import { castDbData } from 'lib/ssrUtils';
import MakeAnOrderRoute from 'routes/MakeAnOrderRoute/MakeAnOrderRoute';

interface MakeAnOrderInterface extends PagePropsInterface, SiteLayoutInterface {}

const MakeAnOrder: NextPage<MakeAnOrderInterface> = ({ navRubrics }) => {
  return (
    <SiteLayout title={'Корзина'} navRubrics={navRubrics}>
      <MakeAnOrderRoute />
    </SiteLayout>
  );
};

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<any>> {
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

export default MakeAnOrder;
