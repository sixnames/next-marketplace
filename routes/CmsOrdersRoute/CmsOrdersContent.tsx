import * as React from 'react';
import DataLayoutContentFrame from '../../components/DataLayout/DataLayoutContentFrame';
import useDataLayoutMethods from '../../hooks/useDataLayoutMethods';
import Table, { TableColumn } from '../../components/Table/Table';
import { CmsOrderInListFragment, useGetAllCmsOrdersQuery } from 'generated/apolloComponents';
import Pager from '../../components/Pager/Pager';
import Spinner from '../../components/Spinner/Spinner';
import RequestError from '../../components/RequestError/RequestError';
import FormattedDateTime from '../../components/FormattedDateTime/FormattedDateTime';
import LinkPhone from '../../components/Link/LinkPhone';
import LinkEmail from '../../components/Link/LinkEmail';
import Link from '../../components/Link/Link';
import { ROUTE_CMS } from 'config/common';

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

export default CmsOrdersContent;
