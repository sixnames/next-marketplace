import { ROUTE_SIGN_IN } from 'config/common';
import ProfileLayout from 'layout/ProfileLayout/ProfileLayout';
import { getCatalogueNavRubrics, getPageInitialData } from 'lib/catalogueUtils';
import { getSession } from 'next-auth/client';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import SiteLayout, { SiteLayoutInterface } from 'layout/SiteLayout/SiteLayout';
import { castDbData } from 'lib/ssrUtils';
import ProfileDetailsRoute from 'routes/ProfileDetailsRoute/ProfileDetailsRoute';

interface ProfileDetailsInterface extends PagePropsInterface, SiteLayoutInterface {}

const ProfileDetails: NextPage<ProfileDetailsInterface> = ({ navRubrics }) => {
  return (
    <SiteLayout title={'Профиль'} navRubrics={navRubrics}>
      <ProfileLayout>
        <ProfileDetailsRoute />
      </ProfileLayout>
    </SiteLayout>
  );
};

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<ProfileDetailsInterface>> {
  const { locale, query } = context;
  const session = await getSession(context);
  if (!session?.user) {
    return {
      redirect: {
        permanent: false,
        destination: `/${query.city}${ROUTE_SIGN_IN}`,
      },
    };
  }

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

export default ProfileDetails;
