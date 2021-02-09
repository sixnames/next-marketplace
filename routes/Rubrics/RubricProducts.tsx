import * as React from 'react';
import DataLayoutTitle from '../../components/DataLayout/DataLayoutTitle';
import DataLayoutContentFrame from '../../components/DataLayout/DataLayoutContentFrame';
import ContentItemControls from '../../components/ContentItemControls/ContentItemControls';
import Spinner from '../../components/Spinner/Spinner';
import RequestError from '../../components/RequestError/RequestError';
import Table from '../../components/Table/Table';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import {
  GetRubricQuery,
  RubricProductFragment,
  useAddProductTuRubricMutation,
  useDeleteProductFromRubricMutation,
  useGetRubricProductsQuery,
} from 'generated/apolloComponents';
import { CONFIRM_MODAL, PRODUCT_SEARCH_MODAL } from 'config/modals';
import Pager from '../../components/Pager/Pager';
import useDataLayoutMethods from '../../hooks/useDataLayoutMethods';
import useProductsListColumns from '../../hooks/useProductsListColumns';
import { RUBRIC_PRODUCTS_QUERY, ALL_RUBRICS_QUERY } from 'graphql/complex/rubricsQueries';
import { useRouter } from 'next/router';
import { ProductSearchModalInterface } from 'components/Modal/ProductSearchModal/ProductSearchModal';
import { ROUTE_CMS } from 'config/common';

interface RubricDetailsInterface {
  rubric: GetRubricQuery['getRubric'];
}

const RubricProducts: React.FC<RubricDetailsInterface> = ({ rubric }) => {
  const router = useRouter();
  const { page, setPage } = useDataLayoutMethods();
  const { showModal, onCompleteCallback, onErrorCallback, showLoading } = useMutationCallbacks({
    withModal: true,
  });

  const { data, loading, error } = useGetRubricProductsQuery({
    skip: !rubric,
    fetchPolicy: 'network-only',
    variables: {
      rubricId: rubric._id,
    },
  });

  const refetchQueries = [
    {
      query: ALL_RUBRICS_QUERY,
    },
    {
      query: RUBRIC_PRODUCTS_QUERY,
      variables: {
        rubricId: rubric._id,
      },
    },
  ];

  const [deleteProductFromRubricMutation] = useDeleteProductFromRubricMutation({
    onCompleted: (data) => onCompleteCallback(data.deleteProductFromRubric),
    onError: onErrorCallback,
    awaitRefetchQueries: true,
    refetchQueries,
  });

  const [addProductToRubricMutation] = useAddProductTuRubricMutation({
    onCompleted: (data) => onCompleteCallback(data.addProductToRubric),
    onError: onErrorCallback,
    awaitRefetchQueries: true,
    refetchQueries,
  });

  function deleteProductFromRubricHandler(product: RubricProductFragment) {
    showModal({
      variant: CONFIRM_MODAL,
      props: {
        testId: 'delete-product-from-rubric-modal',
        message: `Вы уверены, что хотите удалить товар ${product.name} из рубрики?`,
        confirm: () => {
          showLoading();
          return deleteProductFromRubricMutation({
            variables: {
              input: {
                rubricId: rubric._id,
                productId: product._id,
              },
            },
          });
        },
      },
    });
  }

  function addProductToRubricModalHandler() {
    showModal<ProductSearchModalInterface>({
      variant: PRODUCT_SEARCH_MODAL,
      props: {
        rubricId: rubric._id,
        createHandler: (product) => {
          addProductToRubricMutation({
            variables: {
              input: {
                rubricId: rubric._id,
                productId: product._id,
              },
            },
          }).catch((e) => console.log(e));
        },
        createTitle: 'Добавить товар в рубрику',
        testId: 'add-product-to-rubric-modal',
      },
    });
  }

  const columns = useProductsListColumns({
    deleteTitle: 'Удалить товар из рубрики',
    deleteHandler: deleteProductFromRubricHandler,
    updateTitle: 'Редактировать товар',
    updateHandler: ({ _id }) => router.push(`${ROUTE_CMS}/products/${_id}`),
    isDeleteDisabled: ({ rubricsIds }) => {
      return !rubricsIds.includes(rubric._id);
    },
  });

  if (!data && !loading && !error) {
    return <DataLayoutTitle>Выберите рубрику</DataLayoutTitle>;
  }

  if (loading) {
    return <Spinner isNested />;
  }

  if (error || !data || !data.getRubric) {
    return <RequestError />;
  }

  const {
    getRubric: { products },
  } = data;

  const { docs, totalPages } = products;

  return (
    <div data-cy={'rubric-products'}>
      <DataLayoutTitle
        testId={'rubric-title'}
        titleRight={
          <ContentItemControls
            testId={'product'}
            createTitle={'Добавить товар в рубрику'}
            createHandler={addProductToRubricModalHandler}
          />
        }
      >
        {rubric.name}
      </DataLayoutTitle>
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

export default RubricProducts;
