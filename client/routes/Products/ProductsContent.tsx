import React from 'react';
import Table from '../../components/Table/Table';
import useProductsListColumns, {
  ProductsListItemInterface,
} from '../../hooks/useProductsListColumns';
import useDataLayoutMethods from '../../hooks/useDataLayoutMethods';
import Pager from '../../components/Pager/Pager';
import { useDeleteProductMutation, useGetAllProductsQuery } from '../../generated/apolloComponents';
import Spinner from '../../components/Spinner/Spinner';
import RequestError from '../../components/RequestError/RequestError';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import DataLayoutContentFrame from '../../components/DataLayout/DataLayoutContentFrame';
import { CONFIRM_MODAL } from '../../config/modals';
import { GET_ALL_PRODUCTS_QUERY } from '../../graphql/rubrics';
import { useRouter } from 'next/router';
import { ROUTE_CMS } from '../../config';

const ProductsContent: React.FC = () => {
  const { showModal, showLoading, onErrorCallback, onCompleteCallback } = useMutationCallbacks({
    withModal: true,
  });

  const { setPage, page, contentFilters } = useDataLayoutMethods();
  const router = useRouter();

  const { data, error, loading } = useGetAllProductsQuery({
    variables: {
      input: contentFilters,
    },
    fetchPolicy: 'network-only',
  });

  const [deleteProductMutation] = useDeleteProductMutation({
    onError: onErrorCallback,
    onCompleted: (data) => onCompleteCallback(data.deleteProduct),
    awaitRefetchQueries: true,
    refetchQueries: [
      {
        query: GET_ALL_PRODUCTS_QUERY,
        variables: {
          input: contentFilters,
        },
      },
    ],
  });

  function deleteProductHandler(product: ProductsListItemInterface) {
    showModal({
      type: CONFIRM_MODAL,
      props: {
        testId: 'delete-product-modal',
        message: `Вы уверенны, что хотите удалить товар ${product.name} из базы данных?`,
        confirm: () => {
          showLoading();
          return deleteProductMutation({
            variables: { id: product.id },
          });
        },
      },
    });
  }

  const columns = useProductsListColumns({
    updateTitle: 'Редактировать товар',
    updateHandler: ({ id }) =>
      router.push({
        pathname: `${ROUTE_CMS}/products`,
        query: { productId: id },
      }),
    deleteTitle: 'Удалить товар',
    deleteHandler: deleteProductHandler,
  });

  if (loading) return <Spinner isNested />;
  if (error || !data || !data.getAllProducts) return <RequestError />;

  const { totalPages, docs } = data.getAllProducts;

  return (
    <DataLayoutContentFrame testId={'products-list'}>
      <Table columns={columns} data={docs} testIdKey={'nameString'} />
      <Pager page={page} setPage={setPage} totalPages={totalPages} />
    </DataLayoutContentFrame>
  );
};

export default ProductsContent;
