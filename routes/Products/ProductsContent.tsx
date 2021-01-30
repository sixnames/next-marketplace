import * as React from 'react';
import Table from '../../components/Table/Table';
import useProductsListColumns from '../../hooks/useProductsListColumns';
import useDataLayoutMethods from '../../hooks/useDataLayoutMethods';
import Pager from '../../components/Pager/Pager';
import { RubricProductFragment, useGetAllProductsQuery } from 'generated/apolloComponents';
import Spinner from '../../components/Spinner/Spinner';
import RequestError from '../../components/RequestError/RequestError';
import DataLayoutContentFrame from '../../components/DataLayout/DataLayoutContentFrame';
import { useRouter } from 'next/router';
import { ROUTE_CMS } from 'config/common';

const ProductsContent: React.FC = () => {
  const { setPage, page, contentFilters } = useDataLayoutMethods();
  const router = useRouter();

  const { data, error, loading } = useGetAllProductsQuery({
    variables: {
      input: contentFilters,
    },
    fetchPolicy: 'network-only',
  });

  const columns = useProductsListColumns({
    updateTitle: 'Редактировать товар',
    updateHandler: ({ _id }) => router.push(`${ROUTE_CMS}/products/${_id}`),
  });

  if (loading) {
    return <Spinner isNested />;
  }

  if (error || !data || !data.getProductsList) {
    return <RequestError />;
  }

  const { totalPages, docs } = data.getProductsList;

  return (
    <DataLayoutContentFrame testId={'products-list'}>
      <Table<RubricProductFragment> columns={columns} data={docs} testIdKey={'name'} />
      <Pager page={page} setPage={setPage} totalPages={totalPages} />
    </DataLayoutContentFrame>
  );
};

export default ProductsContent;
