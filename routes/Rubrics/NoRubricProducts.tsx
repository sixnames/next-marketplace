import * as React from 'react';
import DataLayoutContentFrame from '../../components/DataLayout/DataLayoutContentFrame';
import DataLayoutTitle from '../../components/DataLayout/DataLayoutTitle';
import useDataLayoutMethods from '../../hooks/useDataLayoutMethods';
import Spinner from '../../components/Spinner/Spinner';
import RequestError from '../../components/RequestError/RequestError';
import Table from '../../components/Table/Table';
import useProductsListColumns from '../../hooks/useProductsListColumns';
import { RubricProductFragment, useGetNonRubricProductsQuery } from 'generated/apolloComponents';
import Pager from '../../components/Pager/Pager';

const NoRubricProducts: React.FC = () => {
  const { page, setPage } = useDataLayoutMethods();

  const { data, loading, error } = useGetNonRubricProductsQuery({
    fetchPolicy: 'network-only',
    variables: {
      input: {
        isWithoutRubrics: true,
        page,
      },
    },
  });

  const columns = useProductsListColumns({});

  if (loading) {
    return <Spinner isNested />;
  }
  if (error || !data || !data.getProductsList) {
    return <RequestError />;
  }

  const {
    getProductsList: { docs, totalPages },
  } = data;

  return (
    <div>
      <DataLayoutTitle>Товары вне рубрик</DataLayoutTitle>
      <DataLayoutContentFrame>
        <Table<RubricProductFragment>
          data={docs}
          columns={columns}
          emptyMessage={'Список пуст'}
          testIdKey={'name'}
        />
        <Pager page={page} setPage={setPage} totalPages={totalPages} />
      </DataLayoutContentFrame>
    </div>
  );
};

export default NoRubricProducts;
