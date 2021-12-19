import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { getSiteInitialData } from '../../lib/ssrUtils';

const Home: NextPage = () => {
  return <div />;
};

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<any>> {
  try {
    const { props } = await getSiteInitialData({
      context,
    });

    if (!props || props.companyNotFound) {
      return {
        notFound: true,
      };
    }

    return {
      redirect: {
        destination: props.urlPrefix,
        permanent: true,
      },
    };
  } catch (e) {
    console.log(e);
    return {
      notFound: true,
    };
  }
}

export default Home;
