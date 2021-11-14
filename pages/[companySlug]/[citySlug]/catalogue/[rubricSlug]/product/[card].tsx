import { getSiteInitialData } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';

const CardPage: NextPage = () => {
  return <div />;
};

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<any>> {
  const { props } = await getSiteInitialData({
    context,
  });

  return {
    redirect: {
      destination: `${props.urlPrefix}${context.query?.card}`,
      permanent: true,
    },
  };
}

export default CardPage;
