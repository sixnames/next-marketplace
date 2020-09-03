import React from 'react';
import AppLayout from '../../layout/AppLayout/AppLayout';
import { GetServerSideProps, NextPage } from 'next';
import Title from '../../components/Title/Title';
import Inner from '../../components/Inner/Inner';
import getAppServerSideProps, { AppPageInterface } from '../../utils/getAppServerSideProps';

const Profile: NextPage<AppPageInterface> = ({ initialApolloState }) => {
  return (
    <AppLayout title={'Настройки профиля'} initialApolloState={initialApolloState}>
      <Inner>
        <Title>Profile</Title>
      </Inner>
    </AppLayout>
  );
};

// noinspection JSUnusedGlobalSymbols
export const getServerSideProps: GetServerSideProps = getAppServerSideProps;

export default Profile;
