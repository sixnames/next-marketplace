import React, { useState, Fragment } from 'react';
import ModalFrame from '../ModalFrame';
import ModalTitle from '../ModalTitle';
import Button from '../../Buttons/Button';
import {
  useAddProductTuRubricMutation,
  useGetNonRubricProductsQuery,
  useGetRubricProductsQuery,
  useGetRubricsTreeQuery,
} from '../../../generated/apolloComponents';
import DataLayoutTitle from '../../DataLayout/DataLayoutTitle';
import Spinner from '../../Spinner/Spinner';
import RequestError from '../../RequestError/RequestError';
import RubricsTree from '../../../routes/Rubrics/RubricsTree';
import Table from '../../Table/Table';
import useMutationCallbacks from '../../../hooks/mutations/useMutationCallbacks';
import { RUBRIC_PRODUCTS_QUERY } from '../../../graphql/query/getRubricProducts';
import { RUBRICS_TREE_QUERY } from '../../../graphql/query/getRubricsTree';
import Accordion from '../../Accordion/Accordion';
import FormikIndividualSearch from '../../FormElements/Search/FormikIndividualSearch';
import { useAppContext } from '../../../context/appContext';
import useProductsListColumns from '../../../hooks/useProductsListColumns';
import { CREATE_NEW_PRODUCT_MODAL } from '../../../config/modals';
import { QUERY_DATA_LAYOUT_NO_RUBRIC } from '../../../config';
import { CreateNewProductModalInterface } from '../CreateNewProductModal/CreateNewProductModal';

interface AddProductToRubricModalInterface {
  rubricId: string;
}

interface AddProductToRubricListInterface {
  notInRubric: string;
  viewRubric: string;
  addProductToRubricHandler: (id: string) => void;
}

interface NotInRubricProductsListInterface {
  addProductToRubricHandler: (id: string) => void;
}

interface ProductsSearchListInterface {
  addProductToRubricHandler: (id: string) => void;
  notInRubric: string;
  search: string;
}

const AddProductToRubricList: React.FC<AddProductToRubricListInterface> = ({
  viewRubric,
  notInRubric,
  addProductToRubricHandler,
}) => {
  const columns = useProductsListColumns({
    createTitle: 'Добавить товар в рубрику',
    createHandler: (product) => addProductToRubricHandler(product.id),
  });

  const { data, loading, error } = useGetRubricProductsQuery({
    fetchPolicy: 'network-only',
    variables: {
      id: `${viewRubric}`,
      notInRubric,
    },
  });

  if (!data && !loading && !error) {
    return <DataLayoutTitle>Ошибка загрузки данных</DataLayoutTitle>;
  }

  if (loading) return <Spinner isNested />;
  if (error || !data || !data.getRubric) return <RequestError />;
  const {
    getRubric: { products },
  } = data;

  return (
    <Table
      data={products.docs}
      columns={columns}
      emptyMessage={'Список пуст'}
      testIdKey={'nameString'}
    />
  );
};

const NotInRubricProductsList: React.FC<NotInRubricProductsListInterface> = ({
  addProductToRubricHandler,
}) => {
  const page = 1;
  const limit = 1000;

  const columns = useProductsListColumns({
    createTitle: 'Добавить товар в рубрику',
    createHandler: (product) => addProductToRubricHandler(product.id),
  });

  const { data, loading, error } = useGetNonRubricProductsQuery({
    fetchPolicy: 'network-only',
    variables: {
      input: {
        noRubrics: true,
        page,
        limit,
      },
    },
  });

  if (!data && !loading && !error) {
    return <DataLayoutTitle>Ошибка загрузки данных</DataLayoutTitle>;
  }

  if (loading) return <Spinner isNested />;
  if (error || !data || !data.getAllProducts) return <RequestError />;
  const {
    getAllProducts: { docs },
  } = data;

  return <Table data={docs} columns={columns} emptyMessage={'Список пуст'} testIdKey={'name'} />;
};

const ProductsSearchList: React.FC<ProductsSearchListInterface> = ({
  search,
  addProductToRubricHandler,
  notInRubric,
}) => {
  const page = 1;

  const columns = useProductsListColumns({
    createTitle: 'Добавить товар в рубрику',
    createHandler: (product) => addProductToRubricHandler(product.id),
  });

  const { data, loading, error } = useGetNonRubricProductsQuery({
    fetchPolicy: 'network-only',
    variables: {
      input: {
        page,
        notInRubric,
        search,
      },
    },
  });

  if (!data && !loading && !error) {
    return <DataLayoutTitle>Ошибка загрузки данных</DataLayoutTitle>;
  }

  if (loading) return <Spinner isNested />;
  if (error || !data || !data.getAllProducts) return <RequestError />;
  const {
    getAllProducts: { docs },
  } = data;

  return (
    <Table
      data={docs}
      columns={columns}
      emptyMessage={`По запросу &quot;${search}&quot; товаров не найдено`}
      testIdKey={'name'}
    />
  );
};

const AddProductToRubricModal: React.FC<AddProductToRubricModalInterface> = ({ rubricId }) => {
  const { onCompleteCallback, onErrorCallback } = useMutationCallbacks({ withModal: true });
  const [search, setSearch] = useState<string | null>(null);
  const { showModal } = useAppContext();
  const { data, error, loading } = useGetRubricsTreeQuery({
    fetchPolicy: 'network-only',
    variables: {
      excluded: [rubricId],
    },
  });

  const [addProductToRubricMutation] = useAddProductTuRubricMutation({
    onCompleted: (data) => onCompleteCallback(data.addProductToRubric),
    onError: onErrorCallback,
    awaitRefetchQueries: true,
    refetchQueries: [
      {
        query: RUBRICS_TREE_QUERY,
      },
      {
        query: RUBRIC_PRODUCTS_QUERY,
        variables: {
          id: rubricId,
        },
      },
    ],
  });

  function addProductToRubricHandler(productId: string) {
    return addProductToRubricMutation({
      variables: {
        input: {
          rubricId,
          productId,
        },
      },
    });
  }

  function createProductModalHandler() {
    showModal<CreateNewProductModalInterface>({
      type: CREATE_NEW_PRODUCT_MODAL,
      props: {
        rubricId,
        refetchQueries: [
          {
            query: RUBRICS_TREE_QUERY,
          },
          {
            query: RUBRIC_PRODUCTS_QUERY,
            variables: {
              id: rubricId,
            },
          },
        ],
      },
    });
  }

  if (!data && !loading && !error) {
    return <DataLayoutTitle>Ошибка загрузки данных</DataLayoutTitle>;
  }

  if (loading) return <Spinner isNested />;
  if (error || !data || !data.getRubricsTree) return <RequestError />;

  const { getRubricsTree } = data;

  return (
    <ModalFrame testId={'add-product-to-rubric-modal'} wide>
      <ModalTitle
        right={
          <Button size={'small'} onClick={createProductModalHandler} testId={'create-new-product'}>
            Создать товар
          </Button>
        }
      >
        Выберите товар
      </ModalTitle>

      <FormikIndividualSearch
        onSubmit={setSearch}
        testId={'product'}
        withReset
        onReset={() => setSearch(null)}
      />

      {search ? (
        <ProductsSearchList
          search={search}
          notInRubric={rubricId}
          addProductToRubricHandler={addProductToRubricHandler}
        />
      ) : (
        <Fragment>
          <RubricsTree
            low
            tree={getRubricsTree}
            render={(viewRubric) => (
              <AddProductToRubricList
                viewRubric={viewRubric}
                notInRubric={rubricId}
                addProductToRubricHandler={addProductToRubricHandler}
              />
            )}
          />

          <Accordion title={'Товары вне рубрик'} testId={QUERY_DATA_LAYOUT_NO_RUBRIC}>
            <NotInRubricProductsList addProductToRubricHandler={addProductToRubricHandler} />
          </Accordion>
        </Fragment>
      )}
    </ModalFrame>
  );
};

export default AddProductToRubricModal;
