import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { ROUTE_PROFILE, ROUTE_SIGN_IN } from '../../config/common';
import { getPageSessionUser } from '../../db/dao/user/getPageSessionUser';
import { alwaysArray } from '../../lib/arrayUtils';
import { getSiteInitialData } from '../../lib/ssrUtils';

const Profile: NextPage = () => {
  return <div />;
};

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<any>> {
  const { query } = context;
  const { props } = await getSiteInitialData({
    context,
  });
  const filters = alwaysArray(query.filters).filter((path) => path);

  // Session user
  const sessionUser = await getPageSessionUser({
    context,
    locale: props.sessionLocale,
  });
  if (!sessionUser) {
    return {
      redirect: {
        permanent: false,
        destination: `${props.urlPrefix}${ROUTE_SIGN_IN}`,
      },
    };
  }

  const filtersPath = filters.length > 0 ? filters.join('/') : '';
  return {
    redirect: {
      permanent: false,
      destination: `${props.urlPrefix}${ROUTE_PROFILE}/${filtersPath}`,
    },
  };
}

export default Profile;
