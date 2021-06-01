import ContentItemControls from 'components/ContentItemControls/ContentItemControls';
import Inner from 'components/Inner/Inner';
import Link from 'components/Link/Link';
import Pager from 'components/Pager/Pager';
import RequestError from 'components/RequestError/RequestError';
import Spinner from 'components/Spinner/Spinner';
import Table, { TableColumn } from 'components/Table/Table';
import TableRowImage from 'components/Table/TableRowImage';
import Title from 'components/Title/Title';
import { ROUTE_CONSOLE } from 'config/common';
import { ShopInListFragment, useGetAppCompanyShopsQuery } from 'generated/apolloComponents';
import useDataLayoutMethods from 'hooks/useDataLayoutMethods';
import AppLayout from 'layout/AppLayout/AppLayout';
import { useRouter } from 'next/router';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { GetServerSidePropsContext, NextPage } from 'next';
import { getCompanyAppInitialData } from 'lib/ssrUtils';

const ShopsRoute: React.FC = () => {
  const router = useRouter();
  const { setPage, page } = useDataLayoutMethods();
  const { data, loading, error } = useGetAppCompanyShopsQuery({
    fetchPolicy: 'network-only',
    variables: {
      input: {
        page,
      },
      companyId: `${router.query.companyId}`,
    },
  });

  if (loading) {
    return <Spinner isNested isTransparent />;
  }

  if (error || !data || !data.getCompanyShops) {
    return <RequestError />;
  }

  const columns: TableColumn<ShopInListFragment>[] = [
    {
      accessor: 'itemId',
      headTitle: 'ID',
      render: ({ cellData, dataItem }) => (
        <Link href={`${ROUTE_CONSOLE}/shops/${router.query.companyId}/${dataItem._id}`}>
          {cellData}
        </Link>
      ),
    },
    {
      accessor: 'logo',
      headTitle: 'Лого',
      render: ({ cellData, dataItem }) => {
        return <TableRowImage src={cellData.url} alt={dataItem.name} title={dataItem.name} />;
      },
    },
    {
      accessor: 'name',
      headTitle: 'Название',
      render: ({ cellData }) => cellData,
    },
    {
      accessor: 'city.name',
      headTitle: 'Город',
      render: ({ cellData }) => cellData,
    },
    {
      render: ({ dataItem }) => {
        return (
          <ContentItemControls
            justifyContent={'flex-end'}
            updateTitle={'Редактировать магазин'}
            updateHandler={() => {
              router
                .push(`${ROUTE_CONSOLE}/shops/${router.query.companyId}/${dataItem._id}`)
                .catch(console.log);
            }}
            testId={dataItem.name}
          />
        );
      },
    },
  ];

  return (
    <Inner testId={'shops-list'}>
      <div className={'pt-11'}>
        <Title>Магазины компании</Title>

        <Table<ShopInListFragment>
          columns={columns}
          data={data.getCompanyShops.docs}
          testIdKey={'name'}
          onRowDoubleClick={(dataItem) => {
            router
              .push(`${ROUTE_CONSOLE}/shops/${router.query.companyId}/${dataItem._id}`)
              .catch(console.log);
          }}
        />
        <Pager page={page} setPage={setPage} totalPages={data.getCompanyShops.totalPages} />
      </div>
    </Inner>
  );
};

const CompanyShops: NextPage<PagePropsInterface> = ({ pageUrls }) => {
  return (
    <AppLayout title={'Магазины компании'} pageUrls={pageUrls}>
      <ShopsRoute />
    </AppLayout>
  );
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  return getCompanyAppInitialData({ context });
};

export default CompanyShops;
