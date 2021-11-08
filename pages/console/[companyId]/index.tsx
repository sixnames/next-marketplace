import Inner from 'components/Inner';
import Title from 'components/Title';
import AppContentWrapper from 'layout/AppContentWrapper';
import ConsoleLayout from 'layout/console/ConsoleLayout';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { getConsoleInitialData } from 'lib/ssrUtils';

interface OrdersInterface extends PagePropsInterface {}

const Orders: NextPage<OrdersInterface> = ({ pageUrls, pageCompany }) => {
  return (
    <ConsoleLayout pageUrls={pageUrls} company={pageCompany}>
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
      pageCompany: props.pageCompany,
    },
  };
};

export default Orders;
