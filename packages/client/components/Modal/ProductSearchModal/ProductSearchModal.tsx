import React, { Fragment, useState } from 'react';
import { useAppContext } from '../../../context/appContext';
import {
  RubricProductFragment,
  useGetNonRubricProductsQuery,
  useGetRubricProductsQuery,
  useGetRubricsTreeQuery,
} from '../../../generated/apolloComponents';
import { RUBRIC_PRODUCTS_QUERY, RUBRICS_TREE_QUERY } from '../../../graphql/complex/rubricsQueries';
import { CreateNewProductModalInterface } from '../CreateNewProductModal/CreateNewProductModal';
import { CREATE_NEW_PRODUCT_MODAL } from '../../../config/modals';
import Spinner from '../../Spinner/Spinner';
import RequestError from '../../RequestError/RequestError';
import ModalFrame from '../ModalFrame';
import ModalTitle from '../ModalTitle';
import Button from '../../Buttons/Button';
import FormikIndividualSearch from '../../FormElements/Search/FormikIndividualSearch';
import RubricsTree from '../../../routes/Rubrics/RubricsTree';
import useProductsListColumns, {
  ProductColumnsInterface,
} from '../../../hooks/useProductsListColumns';
import Table from '../../Table/Table';
import Accordion from '../../Accordion/Accordion';
import { QUERY_DATA_LAYOUT_NO_RUBRIC } from '../../../config';
import RubricsTreeCounters from '../../../routes/Rubrics/RubricsTreeCounters';

interface ProductsListInterface extends ProductColumnsInterface {
  notInRubric?: string;
  viewRubric: string;
  excludedProductsIds?: string[];
}

const ProductsList: React.FC<ProductsListInterface> = ({
  viewRubric,
  notInRubric,
  excludedProductsIds,
  ...props
}) => {
  const columns = useProductsListColumns({
    createTitle: 'Добавить товар в рубрику',
    ...props,
  });

  const { data, loading, error } = useGetRubricProductsQuery({
    fetchPolicy: 'network-only',
    variables: {
      id: `${viewRubric}`,
      notInRubric,
      excludedProductsIds,
    },
  });

  if (!data && !loading && !error) {
    return (
      <ModalFrame>
        <ModalTitle>Ошибка загрузки данных</ModalTitle>
      </ModalFrame>
    );
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

  return (
    <Table<RubricProductFragment>
      data={products.docs}
      columns={columns}
      emptyMessage={'Список пуст'}
      testIdKey={'nameString'}
    />
  );
};

interface NotInRubricProductsListInterface extends ProductColumnsInterface {
  excludedProductsIds?: string[];
}

const NotInRubricProductsList: React.FC<NotInRubricProductsListInterface> = ({
  excludedProductsIds,
  ...props
}) => {
  const page = 1;
  const limit = 1000;

  const columns = useProductsListColumns({
    createTitle: 'Добавить товар в рубрику',
    ...props,
  });

  const { data, loading, error } = useGetNonRubricProductsQuery({
    fetchPolicy: 'network-only',
    variables: {
      input: {
        noRubrics: true,
        page,
        limit,
        countActiveProducts: true,
        excludedProductsIds,
      },
    },
  });

  if (!data && !loading && !error) {
    return (
      <ModalFrame>
        <ModalTitle>Ошибка загрузки данных</ModalTitle>
      </ModalFrame>
    );
  }

  if (loading) {
    return <Spinner isNested />;
  }

  if (error || !data || !data.getAllProducts) {
    return <RequestError />;
  }

  const {
    getAllProducts: { docs, totalDocs, activeProductsCount },
  } = data;

  return docs.length > 0 ? (
    <Accordion
      title={'Товары вне рубрик'}
      testId={QUERY_DATA_LAYOUT_NO_RUBRIC}
      titleRight={
        <RubricsTreeCounters
          activeProductsCount={activeProductsCount || 0}
          totalProductsCount={totalDocs}
          testId={QUERY_DATA_LAYOUT_NO_RUBRIC}
        />
      }
    >
      <Table<RubricProductFragment>
        data={docs}
        columns={columns}
        emptyMessage={'Список пуст'}
        testIdKey={'name'}
      />
    </Accordion>
  ) : null;
};

interface ProductsSearchListInterface extends ProductColumnsInterface {
  notInRubric?: string;
  excludedProductsIds?: string[];
  search: string;
}

const ProductsSearchList: React.FC<ProductsSearchListInterface> = ({
  search,
  notInRubric,
  excludedProductsIds,
  ...props
}) => {
  const page = 1;

  const columns = useProductsListColumns({
    createTitle: 'Добавить товар в рубрику',
    ...props,
  });

  const { data, loading, error } = useGetNonRubricProductsQuery({
    fetchPolicy: 'network-only',
    variables: {
      input: {
        page,
        notInRubric,
        search,
        excludedProductsIds,
      },
    },
  });

  if (!data && !loading && !error) {
    return (
      <ModalFrame>
        <ModalTitle>Ошибка загрузки данных</ModalTitle>
      </ModalFrame>
    );
  }

  if (loading) {
    return <Spinner isNested />;
  }

  if (error || !data || !data.getAllProducts) {
    return <RequestError />;
  }

  const {
    getAllProducts: { docs },
  } = data;

  return (
    <Table<RubricProductFragment>
      data={docs}
      columns={columns}
      emptyMessage={`По запросу "${search}" товаров не найдено`}
      testIdKey={'name'}
    />
  );
};

export interface ProductSearchModalInterface extends ProductColumnsInterface {
  rubricId?: string;
  excludedProductsIds?: string[];
  testId?: string;
}

const ProductSearchModal: React.FC<ProductSearchModalInterface> = ({
  rubricId,
  testId,
  excludedProductsIds,
  ...props
}) => {
  const [search, setSearch] = useState<string | null>(null);
  const { showModal } = useAppContext();
  const { data, error, loading } = useGetRubricsTreeQuery({
    fetchPolicy: 'network-only',
    variables: {
      excluded: rubricId ? [rubricId] : [],
      counters: {
        noRubrics: true,
        excludedProductsIds,
      },
    },
  });

  function createProductModalHandler() {
    showModal<CreateNewProductModalInterface>({
      type: CREATE_NEW_PRODUCT_MODAL,
      props: {
        rubricId,
        refetchQueries: [
          {
            query: RUBRICS_TREE_QUERY,
            variables: {
              counters: { noRubrics: true },
            },
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
    return (
      <ModalFrame>
        <ModalTitle>Ошибка загрузки данных</ModalTitle>
      </ModalFrame>
    );
  }

  if (loading) {
    return <Spinner isNested />;
  }

  if (error || !data || !data.getRubricsTree) {
    return <RequestError />;
  }

  const { getRubricsTree } = data;

  return (
    <ModalFrame testId={testId} size={'wide'}>
      <ModalTitle
        right={
          <Button
            size={'small'}
            theme={'secondary'}
            onClick={createProductModalHandler}
            testId={'create-new-product'}
          >
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
          excludedProductsIds={excludedProductsIds}
          {...props}
        />
      ) : (
        <Fragment>
          <RubricsTree
            low
            tree={getRubricsTree}
            render={(viewRubric) => {
              return (
                <ProductsList
                  viewRubric={viewRubric}
                  notInRubric={rubricId}
                  excludedProductsIds={excludedProductsIds}
                  {...props}
                />
              );
            }}
          />

          <NotInRubricProductsList excludedProductsIds={excludedProductsIds} {...props} />
        </Fragment>
      )}
    </ModalFrame>
  );
};

export default ProductSearchModal;
