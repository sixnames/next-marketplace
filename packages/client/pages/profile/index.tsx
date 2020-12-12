import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import getSiteServerSideProps, { SitePagePropsType } from '../../utils/getSiteServerSideProps';
import SiteLayout from '../../layout/SiteLayout/SiteLayout';
import ProfileLayout from '../../layout/ProfileLayout/ProfileLayout';

const Profile: NextPage<SitePagePropsType> = ({ initialApolloState }) => {
  return (
    <SiteLayout initialApolloState={initialApolloState} title={'Профиль'}>
      <ProfileLayout>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores atque dolorum eos ipsum
        iusto quam quos ut. Culpa eius ipsum molestias sunt unde. Beatae inventore nulla qui quis
        quos unde.
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
