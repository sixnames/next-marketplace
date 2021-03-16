import { ROUTE_SIGN_IN } from 'config/common';
import ProfileLayout from 'layout/ProfileLayout/ProfileLayout';
import { getSession } from 'next-auth/client';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import SiteLayout, { SiteLayoutInterface } from 'layout/SiteLayout/SiteLayout';
import { getSiteInitialData } from 'lib/ssrUtils';
import ProfileOrdersRoute from 'routes/ProfileOrdersRoute/ProfileOrdersRoute';

interface ProfileInterface extends PagePropsInterface, SiteLayoutInterface {}

const Profile: NextPage<ProfileInterface> = ({ navRubrics }) => {
  return (
    <SiteLayout title={'История заказов'} navRubrics={navRubrics}>
      <ProfileLayout>
        <ProfileOrdersRoute />
      </ProfileLayout>
    </SiteLayout>
  );
};

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<ProfileInterface>> {
  const { locale, query } = context;
  const { cityNotFound, props, redirectPayload } = await getSiteInitialData({
    params: query,
    locale,
  });

  if (cityNotFound) {
    return redirectPayload;
  }

  const session = await getSession(context);
  if (!session?.user) {
    return {
      redirect: {
        permanent: false,
        destination: `/${props.sessionCity}${ROUTE_SIGN_IN}`,
      },
    };
  }

  return {
    props,
  };
}

export default Profile;