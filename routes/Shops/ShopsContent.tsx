import * as React from 'react';
import { ShopInListFragment, useGetAllShopsQuery } from 'generated/apolloComponents';
import useDataLayoutMethods from '../../hooks/useDataLayoutMethods';
import Spinner from '../../components/Spinner/Spinner';
import RequestError from '../../components/RequestError/RequestError';
import DataLayoutContentFrame from '../../components/DataLayout/DataLayoutContentFrame';
import Table, { TableColumn } from '../../components/Table/Table';
import Pager from '../../components/Pager/Pager';
import Link from 'next/link';
import TableRowImage from '../../components/Table/TableRowImage';
import ContentItemControls from '../../components/ContentItemControls/ContentItemControls';
import { useRouter } from 'next/router';
import { ROUTE_CMS } from 'config/common';

const ShopsContent: React.FC = () => {
  const router = useRouter();
  const { setPage, page, contentFilters } = useDataLayoutMethods();
  const { data, loading, error } = useGetAllShopsQuery({
    fetchPolicy: 'network-only',
    variables: {
      input: contentFilters,
    },
  });

  if (loading) {
    return <Spinner isNested />;
  }

  if (error || !data || !data.getAllShops) {
    return <RequestError />;
  }

  const columns: TableColumn<ShopInListFragment>[] = [
    {
      accessor: 'itemId',
      headTitle: 'ID',
      render: ({ cellData, dataItem }) => (
        <Link href={`${ROUTE_CMS}/shops/${dataItem._id}`}>
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
              router.push(`${ROUTE_CMS}/shops/${dataItem._id}`).catch((e) => console.log(e));
            }}
            testId={dataItem.name}
          />
        );
      },
    },
  ];

  const { totalPages, docs } = data.getAllShops;

  return (
    <DataLayoutContentFrame testId={'shops-list'}>
      <Table<ShopInListFragment> columns={columns} data={docs} testIdKey={'name'} />
      <Pager page={page} setPage={setPage} totalPages={totalPages} />
    </DataLayoutContentFrame>
  );
};

export default ShopsContent;
