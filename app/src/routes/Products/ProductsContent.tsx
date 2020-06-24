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
import useMutationCallbacks from '../../hooks/mutations/useMutationCallbacks';
import DataLayoutContentFrame from '../../components/DataLayout/DataLayoutContentFrame';
import { CONFIRM_MODAL } from '../../config/modals';
import { GET_ALL_PRODUCTS_QUERY } from '../../graphql/CmsRubricsAndProducts';
import { useNavigate } from 'react-router-dom';

const ProductsContent: React.FC = () => {
  const { showModal, showLoading, onErrorCallback, onCompleteCallback } = useMutationCallbacks({
    withModal: true,
  });

  const { setPage, page, contentFilters } = useDataLayoutMethods();
  const navigate = useNavigate();

  const { data, error, loading } = useGetAllProductsQuery({
    variables: {
      input: contentFilters,
    },
    fetchPolicy: 'network-only',
  });

  const [deleteProductMutation] = useDeleteProductMutation({
    onError: onErrorCallback,
    onCompleted: (data) => onCompleteCallback(data.deleteProduct),
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
      navigate({
        pathname: '/app/cms/product',
        search: `?id=${id}`,
      }),
    deleteTitle: 'Удалить товар',
    deleteHandler: deleteProductHandler,
  });

  if (loading) return <Spinner isNested />;
  if (error || !data || !data.getAllProducts) return <RequestError />;

  const { totalPages, docs } = data.getAllProducts;

  return (
    <DataLayoutContentFrame testId={'products-list'}>
      <Table columns={columns} data={docs} testIdKey={'name'} />
      <Pager page={page} setPage={setPage} totalPages={totalPages} />
    </DataLayoutContentFrame>
  );
};

export default ProductsContent;
