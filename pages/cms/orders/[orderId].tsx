import Inner from 'components/Inner/Inner';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import { useRouter } from 'next/router';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { GetServerSidePropsContext, NextPage } from 'next';
import { getAppInitialData } from 'lib/ssrUtils';

const CmsOrderRoute: React.FC = () => {
  const { query } = useRouter();
  const { orderId } = query;

  return <Inner testId={`order-details`}>Заказ №{orderId}</Inner>;
};

const Order: NextPage<PagePropsInterface> = ({ pageUrls }) => {
  return (
    <CmsLayout pageUrls={pageUrls}>
      <CmsOrderRoute />
    </CmsLayout>
  );
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  return getAppInitialData({ context, isCms: true });
};

export default Order;
