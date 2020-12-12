import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import getSiteServerSideProps, { SitePagePropsType } from '../../utils/getSiteServerSideProps';
import SiteLayout from '../../layout/SiteLayout/SiteLayout';
import ProfileLayout from '../../layout/ProfileLayout/ProfileLayout';
import ProfileOrdersRoute from '../../routes/ProfileOrdersRoute/ProfileOrdersRoute';

const Profile: NextPage<SitePagePropsType> = ({ initialApolloState }) => {
  return (
    <SiteLayout initialApolloState={initialApolloState} title={'История заказов'}>
      <ProfileLayout>
        <ProfileOrdersRoute />
      </ProfileLayout>
    </SiteLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) =>
  getSiteServerSideProps({
    context,
    isProtected: true,
    callback: async ({ initialProps }) => {
      return {
        props: initialProps,
      };
    },
  });

export default Profile;
