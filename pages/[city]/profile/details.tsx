import { ROUTE_SIGN_IN } from 'config/common';
import ProfileLayout from 'layout/ProfileLayout/ProfileLayout';
import { getSession } from 'next-auth/client';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import SiteLayout from 'layout/SiteLayout/SiteLayout';
import { getSiteInitialData } from 'lib/ssrUtils';
import ProfileDetailsRoute from 'routes/ProfileDetailsRoute/ProfileDetailsRoute';

const ProfileDetails: NextPage = () => {
  return (
    <SiteLayout title={'Профиль'}>
      <ProfileLayout>
        <ProfileDetailsRoute />
      </ProfileLayout>
    </SiteLayout>
  );
};

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<any>> {
  try {
    // Check if user authenticated
    const session = await getSession(context);
    if (!session?.user) {
      return {
        redirect: {
          permanent: false,
          destination: ROUTE_SIGN_IN,
        },
      };
    }

    const { apolloClient } = await getSiteInitialData(context);

    return {
      props: {
        initialApolloState: apolloClient.cache.extract(),
      },
    };
  } catch (e) {
    console.log('====== get Site server side props error ======');
    console.log(JSON.stringify(e, null, 2));
    return { props: {} };
  }
}

export default ProfileDetails;
