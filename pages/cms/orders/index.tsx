import Button from 'components/Buttons/Button';
import DataLayout from 'components/DataLayout/DataLayout';
import DataLayoutContentFrame from 'components/DataLayout/DataLayoutContentFrame';
import FormattedDateTime from 'components/FormattedDateTime/FormattedDateTime';
import FormikFilter from 'components/FormElements/Filter/FormikFilter';
import FormikSearch from 'components/FormElements/Search/FormikSearch';
import HorizontalList from 'components/HorizontalList/HorizontalList';
import Link from 'components/Link/Link';
import LinkEmail from 'components/Link/LinkEmail';
import LinkPhone from 'components/Link/LinkPhone';
import Pager from 'components/Pager/Pager';
import RequestError from 'components/RequestError/RequestError';
import Spinner from 'components/Spinner/Spinner';
import Table, { TableColumn } from 'components/Table/Table';
import { ROUTE_CMS } from 'config/common';
import { CmsOrderInListFragment, useGetAllCmsOrdersQuery } from 'generated/apolloComponents';
import useDataLayoutMethods from 'hooks/useDataLayoutMethods';
import AppLayout from 'layout/AppLayout/AppLayout';
import * as React from 'react';
import { NextPage } from 'next';
import { getAppInitialData } from 'lib/ssrUtils';

const CmsOrdersFilter: React.FC = () => {
  const initialValues = { search: '' };

  return (
    <FormikFilter initialValues={initialValues}>
      {({ onResetHandler }) => (
        <React.Fragment>
          <FormikSearch testId={'orders'} />

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

const CmsOrdersContent: React.FC = () => {
  const { setPage, page, contentFilters } = useDataLayoutMethods();
  const { data, loading, error } = useGetAllCmsOrdersQuery({
    variables: {
      input: contentFilters,
    },
  });

  if (loading) {
    return <Spinner isNested />;
  }

  if (error || !data || !data.getAllOrders) {
    return <RequestError />;
  }

  const { totalPages, docs } = data.getAllOrders;

  const columns: TableColumn<CmsOrderInListFragment>[] = [
    {
      accessor: 'itemId',
      headTitle: 'ID',
      render: ({ cellData, dataItem }) => (
        <Link testId={`order-${dataItem.itemId}-link`} href={`${ROUTE_CMS}/orders/${dataItem._id}`}>
          {cellData}
        </Link>
      ),
    },
    {
      accessor: 'status',
      headTitle: 'Статус',
      render: ({ cellData }) => {
        return `${cellData.name}`;
      },
    },
    {
      accessor: 'createdAt',
      headTitle: 'Дата заказа',
      render: ({ cellData }) => {
        return <FormattedDateTime value={cellData} />;
      },
    },
    {
      accessor: 'productsCount',
      headTitle: 'Товаров',
      render: ({ cellData }) => {
        return cellData;
      },
    },
    {
      accessor: 'customer.shortName',
      headTitle: 'Заказчик',
      render: ({ cellData }) => {
        return cellData;
      },
    },
    {
      accessor: 'customer.formattedPhone',
      headTitle: 'Телефон',
      render: ({ cellData }) => {
        return <LinkPhone value={cellData} />;
      },
    },
    {
      accessor: 'customer.email',
      headTitle: 'Email',
      render: ({ cellData }) => {
        return <LinkEmail value={cellData} />;
      },
    },
  ];

  return (
    <div data-cy={'orders-list'}>
      <DataLayoutContentFrame>
        <Table<CmsOrderInListFragment> columns={columns} data={docs} testIdKey={'itemId'} />
        <Pager page={page} setPage={setPage} totalPages={totalPages} />
      </DataLayoutContentFrame>
    </div>
  );
};

const CmsOrdersRoute: React.FC = () => {
  return (
    <DataLayout
      isFilterVisible
      title={'Заказы'}
      filterContent={<CmsOrdersFilter />}
      filterResult={() => <CmsOrdersContent />}
    />
  );
};

const Orders: NextPage = () => {
  return (
    <AppLayout>
      <CmsOrdersRoute />
    </AppLayout>
  );
};

export const getServerSideProps = getAppInitialData;

export default Orders;
