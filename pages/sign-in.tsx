import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { SessionUserQuery } from 'generated/apolloComponents';
import { SESSION_USER_QUERY } from 'graphql/query/initialQueries';
import SiteLayout from '../layout/SiteLayout/SiteLayout';
import { getSiteInitialData } from 'lib/ssrUtils';
import SignInRoute from '../routes/SignInRoute/SignInRoute';
import { csrfToken } from 'next-auth/client';

export interface SignInPageInterface {
  token: string;
}

const SignIn: NextPage<SignInPageInterface> = ({ token }) => {
  return (
    <SiteLayout title={'Авторизация'}>
      <SignInRoute token={token} />
    </SiteLayout>
  );
};

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<any>> {
  try {
    const { apolloClient } = await getSiteInitialData(context);

    // Redirect user to the Home page if already authorized
    const { data } = await apolloClient.query<SessionUserQuery>({
      query: SESSION_USER_QUERY,
    });
    if (data?.me) {
      return {
        redirect: {
          permanent: false,
          destination: '/',
        },
      };
    }

    // Get session token
    const token = await csrfToken(context);

    return {
      props: {
        token,
        initialApolloState: apolloClient.cache.extract(),
      },
    };
  } catch (e) {
    console.log('====== get Site server side props error ======');
    console.log(JSON.stringify(e, null, 2));
    return { props: {} };
  }
}

export default SignIn;
