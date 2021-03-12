import * as React from 'react';
import {
  RubricProductFragment,
  useGetAllRubricsQuery,
  useGetNonRubricProductsQuery,
  useGetRubricProductsQuery,
} from 'generated/apolloComponents';
import Spinner from '../../Spinner/Spinner';
import RequestError from '../../RequestError/RequestError';
import ModalFrame from '../ModalFrame';
import ModalTitle from '../ModalTitle';
import FormikIndividualSearch from '../../FormElements/Search/FormikIndividualSearch';
import RubricsList from 'routes/Rubrics/RubricsList';
import useProductsListColumns, {
  ProductColumnsInterface,
} from '../../../hooks/useProductsListColumns';
import Table from '../../Table/Table';

interface ProductsListInterface extends ProductColumnsInterface {
  viewRubricSlug: string;
  excludedProductsIds?: string[];
  attributesIds?: string[] | null;
}

const ProductsList: React.FC<ProductsListInterface> = ({
  viewRubricSlug,
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
      rubricSlug: viewRubricSlug,
      productsInput: {
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

  if (error || !data || !data.getRubricBySlug) {
    return <RequestError />;
  }

  const {
    getRubricBySlug: { products },
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

interface ProductsSearchListInterface extends ProductColumnsInterface {
  excludedProductsIds?: string[];
  attributesIds?: string[] | null;
  search: string;
}

const ProductsSearchList: React.FC<ProductsSearchListInterface> = ({
  search,
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
  excludedProductsIds?: string[];
  attributesIds?: string[] | null;
  testId?: string;
}

const ProductSearchModal: React.FC<ProductSearchModalInterface> = ({
  testId,
  excludedProductsIds,
  attributesIds,
  ...props
}) => {
  const [search, setSearch] = React.useState<string | null>(null);
  const { data, error, loading } = useGetAllRubricsQuery({
    fetchPolicy: 'network-only',
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

  if (error || !data || !data.getAllRubrics) {
    return <RequestError />;
  }

  const { getAllRubrics } = data;

  return (
    <ModalFrame testId={testId} size={'wide'}>
      <ModalTitle>Выберите товар</ModalTitle>

      <FormikIndividualSearch
        onSubmit={setSearch}
        testId={'product'}
        withReset
        onReset={() => setSearch(null)}
      />

      {search ? (
        <ProductsSearchList
          search={search}
          excludedProductsIds={excludedProductsIds}
          attributesIds={attributesIds}
          {...props}
        />
      ) : (
        <React.Fragment>
          <RubricsList
            low
            rubrics={getAllRubrics}
            render={({ slug }) => {
              return (
                <ProductsList
                  viewRubricSlug={slug}
                  excludedProductsIds={excludedProductsIds}
                  attributesIds={attributesIds}
                  {...props}
                />
              );
            }}
          />
        </React.Fragment>
      )}
    </ModalFrame>
  );
};

export default ProductSearchModal;
