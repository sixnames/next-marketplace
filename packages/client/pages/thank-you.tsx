import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import SiteLayout from '../layout/SiteLayout/SiteLayout';
import getSiteServerSideProps, { SitePagePropsType } from '../utils/getSiteServerSideProps';
import ThankYouRoute from '../routes/ThankYouRoute/ThankYouRoute';

const ThankYou: NextPage<SitePagePropsType> = ({ initialApolloState }) => {
  return (
    <SiteLayout initialApolloState={initialApolloState} title={'Спасибо за заказ!'}>
      <ThankYouRoute />
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

export default ThankYou;
