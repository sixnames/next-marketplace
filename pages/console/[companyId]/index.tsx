import Inner from 'components/Inner';
import Title from 'components/Title';
import AppContentWrapper from 'layout/AppContentWrapper';
import ConsoleLayout from 'layout/cms/ConsoleLayout';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { getConsoleInitialData } from 'lib/ssrUtils';

interface OrdersInterface extends PagePropsInterface {}

const Orders: NextPage<OrdersInterface> = ({ layoutProps, pageCompany }) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <AppContentWrapper>
        <Inner>
          <Title>{pageCompany?.name}</Title>
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
      pageCompany: props.layoutProps.pageCompany,
    },
  };
};

export default Orders;
