import React from 'react';
import DataLayoutContentFrame from '../../components/DataLayout/DataLayoutContentFrame';
import DataLayoutTitle from '../../components/DataLayout/DataLayoutTitle';
import useDataLayoutMethods from '../../hooks/useDataLayoutMethods';
import Spinner from '../../components/Spinner/Spinner';
import RequestError from '../../components/RequestError/RequestError';
import Table from '../../components/Table/Table';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import useProductsListColumns from '../../hooks/useProductsListColumns';
import {
  useDeleteProductMutation,
  useGetNonRubricProductsQuery,
} from '../../generated/apolloComponents';
import { CONFIRM_MODAL } from '../../config/modals';
import Pager from '../../components/Pager/Pager';
import { GET_NON_RUBRIC_PRODUCTS_QUERY } from '../../graphql/CmsRubricsAndProducts';

const NoRubricProducts: React.FC = () => {
  const { showModal, showLoading, onErrorCallback, onCompleteCallback } = useMutationCallbacks({
    withModal: true,
  });
  const { page, setPage } = useDataLayoutMethods();

  const [deleteProductMutation] = useDeleteProductMutation({
    onError: onErrorCallback,
    onCompleted: (data) => onCompleteCallback(data.deleteProduct),
    awaitRefetchQueries: true,
    refetchQueries: [
      {
        query: GET_NON_RUBRIC_PRODUCTS_QUERY,
        variables: {
          input: {
            noRubrics: true,
            page,
          },
        },
      },
    ],
  });

  const { data, loading, error } = useGetNonRubricProductsQuery({
    fetchPolicy: 'network-only',
    variables: {
      input: {
        noRubrics: true,
        page,
      },
    },
  });

  function deleteProductHandler({ id, name }: { id: string; name: string }) {
    showModal({
      type: CONFIRM_MODAL,
      props: {
        testId: 'delete-product-modal',
        message: `Вы уверенны, что хотите удалить товар ${name} из базы данных?`,
        confirm: () => {
          showLoading();
          return deleteProductMutation({
            variables: { id },
          });
        },
      },
    });
  }

  const columns = useProductsListColumns({
    deleteTitle: 'Удалить товар из базы данных',
    deleteHandler: (product) => deleteProductHandler({ id: product.id, name: product.name }),
  });

  if (loading) return <Spinner isNested />;
  if (error || !data || !data.getAllProducts) return <RequestError />;

  const {
    getAllProducts: { docs, totalPages },
  } = data;

  return (
    <div>
      <DataLayoutTitle>Товары вне рубрик</DataLayoutTitle>
      <DataLayoutContentFrame>
        <Table data={docs} columns={columns} emptyMessage={'Список пуст'} testIdKey={'name'} />
        <Pager page={page} setPage={setPage} totalPages={totalPages} />
      </DataLayoutContentFrame>
    </div>
  );
};

export default NoRubricProducts;
