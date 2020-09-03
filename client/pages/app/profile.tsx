import React from 'react';
import AppLayout from '../../layout/AppLayout/AppLayout';
import { GetServerSideProps, NextPage } from 'next';
import getAppServerSideProps, { AppPageInterface } from '../../utils/getAppServerSideProps';
import ProfileRoute from '../../routes/ProfileRoute/ProfileRoute';

const Profile: NextPage<AppPageInterface> = ({ initialApolloState }) => {
  return (
    <AppLayout title={'Настройки профиля'} initialApolloState={initialApolloState}>
      <ProfileRoute />
    </AppLayout>
  );
};

// noinspection JSUnusedGlobalSymbols
export const getServerSideProps: GetServerSideProps = getAppServerSideProps;

export default Profile;
