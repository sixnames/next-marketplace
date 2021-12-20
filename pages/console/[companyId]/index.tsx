import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import Inner from '../../../components/Inner';
import WpTitle from '../../../components/WpTitle';
import AppContentWrapper from '../../../layout/AppContentWrapper';
import ConsoleLayout from '../../../layout/cms/ConsoleLayout';
import { getConsoleInitialData, GetConsoleInitialDataPropsInterface } from '../../../lib/ssrUtils';

interface OrdersInterface extends GetConsoleInitialDataPropsInterface {}

const Orders: NextPage<OrdersInterface> = ({ layoutProps }) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <AppContentWrapper>
        <Inner>
          <WpTitle>{layoutProps.pageCompany.name}</WpTitle>
        </Inner>
      </AppContentWrapper>
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<OrdersInterface>> => {
  const { props } = await getConsoleInitialData({ context });
  if (!props) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...props,
    },
  };
};

export default Orders;
