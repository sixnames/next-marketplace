import Button from 'components/Buttons/Button';
import ContentItemControls from 'components/ContentItemControls/ContentItemControls';
import DataLayout from 'components/DataLayout/DataLayout';
import DataLayoutContentFrame from 'components/DataLayout/DataLayoutContentFrame';
import FormikFilter from 'components/FormElements/Filter/FormikFilter';
import FormikSearch from 'components/FormElements/Search/FormikSearch';
import HorizontalList from 'components/HorizontalList/HorizontalList';
import Pager from 'components/Pager/Pager';
import RequestError from 'components/RequestError/RequestError';
import Spinner from 'components/Spinner/Spinner';
import Table, { TableColumn } from 'components/Table/Table';
import TableRowImage from 'components/Table/TableRowImage';
import { ROUTE_APP } from 'config/common';
import { useCompanyContext } from 'context/companyContext';
import { ShopInListFragment, useGetAppCompanyShopsQuery } from 'generated/apolloComponents';
import useDataLayoutMethods from 'hooks/useDataLayoutMethods';
import AppLayout from 'layout/AppLayout/AppLayout';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { GetServerSidePropsContext, NextPage } from 'next';
import { getAppInitialData } from 'lib/ssrUtils';

const ShopsFilter: React.FC = () => {
  const initialValues = { search: '' };

  return (
    <FormikFilter initialValues={initialValues}>
      {({ onResetHandler }) => (
        <React.Fragment>
          <FormikSearch testId={'shops'} />

          <HorizontalList>
            <Button type={'submit'} size={'small'}>
              Применить
            </Button>
            <Button onClick={onResetHandler} theme={'secondary'} size={'small'}>
              Сбросить
            </Button>
          </HorizontalList>
        </React.Fragment>
      )}
    </FormikFilter>
  );
};

const ShopsContent: React.FC = () => {
  const router = useRouter();
  const { setPage, page, contentFilters } = useDataLayoutMethods();
  const { company } = useCompanyContext();
  const { data, loading, error } = useGetAppCompanyShopsQuery({
    fetchPolicy: 'network-only',
    variables: {
      input: contentFilters,
      companyId: `${company?._id}`,
    },
  });

  if (loading) {
    return <Spinner isNested />;
  }

  if (error || !data || !data.getCompanyShops) {
    return <RequestError />;
  }

  const columns: TableColumn<ShopInListFragment>[] = [
    {
      accessor: 'itemId',
      headTitle: 'ID',
      render: ({ cellData, dataItem }) => (
        <Link href={`${ROUTE_APP}/shops/${dataItem.slug}`}>
          <a>{cellData}</a>
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
              router.push(`${ROUTE_APP}/shops/${dataItem.slug}`).catch((e) => console.log(e));
            }}
            testId={dataItem.name}
          />
        );
      },
    },
  ];

  return (
    <DataLayoutContentFrame testId={'shops-list'}>
      <Table<ShopInListFragment>
        columns={columns}
        data={data.getCompanyShops.docs}
        testIdKey={'name'}
      />
      <Pager page={page} setPage={setPage} totalPages={data.getCompanyShops.totalPages} />
    </DataLayoutContentFrame>
  );
};

const ShopsRoute: React.FC = () => {
  return (
    <DataLayout
      isFilterVisible
      title={'Магазины'}
      filterContent={<ShopsFilter />}
      filterResult={() => <ShopsContent />}
    />
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
  return getAppInitialData({ context });
};

export default CompanyShops;
