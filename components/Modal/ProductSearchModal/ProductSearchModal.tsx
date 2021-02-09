import * as React from 'react';
import { useAppContext } from 'context/appContext';
import {
  RubricProductFragment,
  useGetAllRubricsQuery,
  useGetNonRubricProductsQuery,
  useGetRubricProductsQuery,
} from 'generated/apolloComponents';
import { ALL_RUBRICS_QUERY, RUBRIC_PRODUCTS_QUERY } from 'graphql/complex/rubricsQueries';
import { CreateNewProductModalInterface } from '../CreateNewProductModal/CreateNewProductModal';
import { CREATE_NEW_PRODUCT_MODAL } from 'config/modals';
import Spinner from '../../Spinner/Spinner';
import RequestError from '../../RequestError/RequestError';
import ModalFrame from '../ModalFrame';
import ModalTitle from '../ModalTitle';
import Button from '../../Buttons/Button';
import FormikIndividualSearch from '../../FormElements/Search/FormikIndividualSearch';
import RubricsList from 'routes/Rubrics/RubricsList';
import useProductsListColumns, {
  ProductColumnsInterface,
} from '../../../hooks/useProductsListColumns';
import Table from '../../Table/Table';
import Accordion from '../../Accordion/Accordion';
import RubricsTreeCounters from '../../../routes/Rubrics/RubricsTreeCounters';
import { PAGINATION_DEFAULT_LIMIT, QUERY_DATA_LAYOUT_NO_RUBRIC } from 'config/common';

interface ProductsListInterface extends ProductColumnsInterface {
  excludedRubricsId?: string;
  viewRubric: string;
  excludedProductsIds?: string[];
  attributesIds?: string[] | null;
}

const ProductsList: React.FC<ProductsListInterface> = ({
  viewRubric,
  excludedRubricsId,
  excludedProductsIds,
  attributesIds,
  ...props
}) => {
  const columns = useProductsListColumns({
    createTitle: 'Добавить товар в рубрику',
    ...props,
  });

  const { data, loading, error } = useGetRubricProductsQuery({
    fetchPolicy: 'network-only',
    variables: {
      rubricId: viewRubric,
      excludedProductsIds,
      attributesIds,
      excludedRubricsIds: excludedRubricsId ? [excludedRubricsId] : null,
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
  attributesIds?: string[] | null;
}

const NotInRubricProductsList: React.FC<NotInRubricProductsListInterface> = ({
  excludedProductsIds,
  attributesIds,
  ...props
}) => {
  const page = 1;
  const limit = PAGINATION_DEFAULT_LIMIT;

  const columns = useProductsListColumns({
    createTitle: 'Добавить товар в рубрику',
    ...props,
  });

  const { data, loading, error } = useGetNonRubricProductsQuery({
    fetchPolicy: 'network-only',
    variables: {
      input: {
        isWithoutRubrics: true,
        page,
        limit,
        excludedProductsIds,
        attributesIds,
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

  if (error || !data || !data.getProductsList) {
    return <RequestError />;
  }

  const {
    getProductsList: { docs, totalDocs, totalActiveDocs },
  } = data;

  return docs.length > 0 ? (
    <Accordion
      title={'Товары вне рубрик'}
      testId={QUERY_DATA_LAYOUT_NO_RUBRIC}
      titleRight={
        <RubricsTreeCounters
          activeProductsCount={totalActiveDocs}
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
  excludedRubricsId?: string;
  excludedProductsIds?: string[];
  attributesIds?: string[] | null;
  search: string;
}

const ProductsSearchList: React.FC<ProductsSearchListInterface> = ({
  search,
  excludedRubricsId,
  excludedProductsIds,
  attributesIds,
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
        search,
        excludedProductsIds,
        attributesIds,
        excludedRubricsIds: excludedRubricsId ? [excludedRubricsId] : null,
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

  if (error || !data || !data.getProductsList) {
    return <RequestError />;
  }

  const {
    getProductsList: { docs },
  } = data;

  return (
    <React.Fragment>
      <Table<RubricProductFragment>
        data={docs}
        columns={columns}
        emptyMessage={`По запросу "${search}" товаров не найдено`}
        testIdKey={'name'}
      />
    </React.Fragment>
  );
};

export interface ProductSearchModalInterface extends ProductColumnsInterface {
  rubricId?: string;
  excludedProductsIds?: string[];
  attributesIds?: string[] | null;
  testId?: string;
}

const ProductSearchModal: React.FC<ProductSearchModalInterface> = ({
  rubricId,
  testId,
  excludedProductsIds,
  attributesIds,
  ...props
}) => {
  const [search, setSearch] = React.useState<string | null>(null);
  const { showModal } = useAppContext();
  const { data, error, loading } = useGetAllRubricsQuery({
    fetchPolicy: 'network-only',
    variables: {
      input: {
        excludedRubricsIds: rubricId ? [rubricId] : [],
      },
    },
  });

  function createProductModalHandler() {
    showModal<CreateNewProductModalInterface>({
      variant: CREATE_NEW_PRODUCT_MODAL,
      props: {
        rubricId,
        refetchQueries: [
          {
            query: ALL_RUBRICS_QUERY,
            variables: {
              counters: { noRubrics: true },
            },
          },
          {
            query: RUBRIC_PRODUCTS_QUERY,
            variables: {
              _id: rubricId,
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

  if (error || !data || !data.getAllRubrics) {
    return <RequestError />;
  }

  const { getAllRubrics } = data;

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
          excludedRubricsId={rubricId}
          excludedProductsIds={excludedProductsIds}
          attributesIds={attributesIds}
          {...props}
        />
      ) : (
        <React.Fragment>
          <RubricsList
            low
            rubrics={getAllRubrics}
            render={(viewRubric) => {
              return (
                <ProductsList
                  viewRubric={viewRubric}
                  excludedRubricsId={rubricId}
                  excludedProductsIds={excludedProductsIds}
                  attributesIds={attributesIds}
                  {...props}
                />
              );
            }}
          />

          <NotInRubricProductsList
            excludedProductsIds={excludedProductsIds}
            attributesIds={attributesIds}
            {...props}
          />
        </React.Fragment>
      )}
    </ModalFrame>
  );
};

export default ProductSearchModal;
