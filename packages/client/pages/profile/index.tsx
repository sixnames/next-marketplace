import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import Title from '../../components/Title/Title';
import getSiteServerSideProps, { SitePagePropsType } from '../../utils/getSiteServerSideProps';
import Inner from '../../components/Inner/Inner';
import SiteLayout from '../../layout/SiteLayout/SiteLayout';

const Profile: NextPage<SitePagePropsType> = ({ initialApolloState }) => {
  return (
    <SiteLayout initialApolloState={initialApolloState}>
      <Inner>
        <Title>Main page</Title>
      </Inner>
    </SiteLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) =>
  getSiteServerSideProps({
    context,
    callback: async ({ initialProps }) => {
      return {
        props: initialProps,
      };
    },
  });

export default Profile;
