import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import getSiteServerSideProps, { SitePagePropsType } from '../../utils/getSiteServerSideProps';
import SiteLayout from '../../layout/SiteLayout/SiteLayout';
import ProfileLayout from '../../layout/ProfileLayout/ProfileLayout';
import ProfileDetailsRoute from '../../routes/ProfileDetailsRoute/ProfileDetailsRoute';

const ProfileDetails: NextPage<SitePagePropsType> = ({ initialApolloState }) => {
  return (
    <SiteLayout initialApolloState={initialApolloState} title={'Профиль'}>
      <ProfileLayout>
        <ProfileDetailsRoute />
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

export default ProfileDetails;
