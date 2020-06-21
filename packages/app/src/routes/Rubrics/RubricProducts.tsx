import React from 'react';
import DataLayoutTitle from '../../components/DataLayout/DataLayoutTitle';
import DataLayoutContentFrame from '../../components/DataLayout/DataLayoutContentFrame';
import ContentItemControls from '../../components/ContentItemControls/ContentItemControls';
import Spinner from '../../components/Spinner/Spinner';
import RequestError from '../../components/RequestError/RequestError';
import Table from '../../components/Table/Table';
import useMutationCallbacks from '../../hooks/mutations/useMutationCallbacks';
import { RUBRICS_TREE_QUERY } from '../../graphql/query/getRubricsTree';
import {
  GetRubricProductsQuery,
  GetRubricQuery,
  useDeleteProductFromRubricMutation,
  useGetRubricProductsQuery,
} from '../../generated/apolloComponents';
import { ADD_PRODUCT_TO_RUBRIC_MODAL, CONFIRM_MODAL } from '../../config/modals';
import { RUBRIC_PRODUCTS_QUERY } from '../../graphql/query/getRubricProducts';
import Pager from '../../components/Pager/Pager';
import useDataLayoutMethods from '../../hooks/useDataLayoutMethods';
import TableRowImage from '../../components/Table/TableRowImage';

type RubricProduct = GetRubricProductsQuery['getRubric']['products']['docs'][0];

interface RubricDetailsInterface {
  rubric: GetRubricQuery['getRubric'];
}

const RubricProducts: React.FC<RubricDetailsInterface> = ({ rubric }) => {
  const { page, setPage } = useDataLayoutMethods();
  const { showModal, onCompleteCallback, onErrorCallback, showLoading } = useMutationCallbacks({
    withModal: true,
  });

  const { data, loading, error } = useGetRubricProductsQuery({
    skip: !rubric,
    fetchPolicy: 'network-only',
    variables: {
      id: rubric.id,
    },
  });

  const [deleteProductFromRubricMutation] = useDeleteProductFromRubricMutation({
    onCompleted: (data) => onCompleteCallback(data.deleteProductFromRubric),
    onError: onErrorCallback,
    awaitRefetchQueries: true,
    refetchQueries: [
      {
        query: RUBRICS_TREE_QUERY,
      },
      {
        query: RUBRIC_PRODUCTS_QUERY,
        variables: {
          id: rubric.id,
        },
      },
    ],
  });

  if (!data && !loading && !error) {
    return <DataLayoutTitle>Выберите рубрику</DataLayoutTitle>;
  }

  if (loading) return <Spinner isNested />;
  if (error || !data || !data.getRubric) return <RequestError />;

  const {
    getRubric: { products },
  } = data;

  function deleteProductFromRubricHandler(product: RubricProduct) {
    showModal({
      type: CONFIRM_MODAL,
      props: {
        testId: 'delete-product-from-rubric-modal',
        message: `Вы уверены, что хотите удалить товар ${product.name} из рубрики?`,
        confirm: () => {
          showLoading();
          return deleteProductFromRubricMutation({
            variables: {
              input: {
                rubricId: rubric.id,
                productId: product.id,
              },
            },
          });
        },
      },
    });
  }

  function addProductToRubricHandler() {
    showModal({
      type: ADD_PRODUCT_TO_RUBRIC_MODAL,
      props: {
        rubricId: rubric.id,
      },
    });
  }

  const columns = [
    {
      key: 'mainImage',
      title: 'Изображение',
      render: (mainImage: string, product: RubricProduct) => {
        return <TableRowImage url={mainImage} alt={product.name} title={product.name} />;
      },
    },
    {
      key: 'name',
      title: 'Название',
      render: (name: string) => name,
    },
    {
      key: 'price',
      title: 'Цена',
      render: (price: number) => price,
    },
    {
      key: 'id',
      title: '',
      textAlign: 'right',
      render: (_: string, product: RubricProduct) => {
        const { name } = product;
        return (
          <ContentItemControls
            justifyContent={'flex-end'}
            deleteTitle={'Удалить товар из рубрики'}
            deleteHandler={() => deleteProductFromRubricHandler(product)}
            testId={name}
          />
        );
      },
    },
  ];

  const { docs, totalPages } = products;

  return (
    <div data-cy={'rubric-products'}>
      <DataLayoutTitle
        titleRight={
          <ContentItemControls
            testId={'product'}
            createTitle={'Добавить товар в рубрику'}
            createHandler={addProductToRubricHandler}
          />
        }
      >
        Товары
      </DataLayoutTitle>
      <DataLayoutContentFrame>
        <Table data={docs} columns={columns} emptyMessage={'Список пуст'} testIdKey={'name'} />
        <Pager page={page} setPage={setPage} totalPages={totalPages} />
      </DataLayoutContentFrame>
    </div>
  );
};

export default RubricProducts;