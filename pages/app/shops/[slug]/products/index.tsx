import Inner from 'components/Inner/Inner';
import RequestError from 'components/RequestError/RequestError';
import Spinner from 'components/Spinner/Spinner';
import Title from 'components/Title/Title';
import { ROUTE_APP } from 'config/common';
import { useGetCompanyShopQuery } from 'generated/apolloComponents';
import AppLayout from 'layout/AppLayout/AppLayout';
import AppSubNav from 'layout/AppLayout/AppSubNav';
import { getAppInitialData } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { NavItemInterface } from 'types/clientTypes';

const ShopAssetsRoute: React.FC = () => {
  const { query } = useRouter();
  const { slug } = query;
  const { data, loading, error } = useGetCompanyShopQuery({
    fetchPolicy: 'network-only',
    variables: {
      slug: `${slug}`,
    },
  });

  if (loading) {
    return <Spinner />;
  }

  if (error || !data || !data.getShopBySlug) {
    return <RequestError />;
  }

  const navConfig: NavItemInterface[] = [
    {
      name: 'Детали',
      testId: 'details',
      path: `${ROUTE_APP}/shops/${data.getShopBySlug.slug}`,
    },
    {
      name: 'Товары',
      testId: 'products',
      path: `${ROUTE_APP}/shops/${data.getShopBySlug.slug}/products`,
    },
    {
      name: 'Изображения',
      testId: 'assets',
      path: `${ROUTE_APP}/shops/${data.getShopBySlug.slug}/assets`,
    },
  ];

  return (
    <div className={'pt-11'}>
      <Head>
        <title>{`Магазин ${data.getShopBySlug.name}`}</title>
      </Head>

      <Inner lowBottom>
        <Title>Магазин {data.getShopBySlug.name}</Title>
      </Inner>
      <AppSubNav navConfig={navConfig} />
      <Inner>Products</Inner>
    </div>
  );
};

const CompanyShopProducts: NextPage<PagePropsInterface> = ({ pageUrls }) => {
  return (
    <AppLayout pageUrls={pageUrls}>
      <ShopAssetsRoute />
    </AppLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<PagePropsInterface>> => {
  const initialProps = await getAppInitialData({ context });

  if (!initialProps.props) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...initialProps.props,
    },
  };
};

export default CompanyShopProducts;
