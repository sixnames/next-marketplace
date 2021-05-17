import Pager from 'components/Pager/Pager';
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
import RubricsList from 'routes/rubrics/RubricsList';
import useProductsListColumns, {
  ProductColumnsInterface,
} from '../../../hooks/useProductsListColumns';
import Table from '../../Table/Table';

interface ProductsListInterface extends ProductColumnsInterface {
  rubricSlug: string;
  excludedProductsIds?: string[];
  attributesIds?: string[] | null;
  search?: string | null;
}

const ProductsList: React.FC<ProductsListInterface> = ({
  rubricSlug,
  excludedProductsIds,
  attributesIds,
  search,
  ...props
}) => {
  const [page, setPage] = React.useState<number>(1);
  const columns = useProductsListColumns({
    createTitle: 'Добавить товар в рубрику',
    ...props,
  });

  const { data, loading, error } = useGetRubricProductsQuery({
    fetchPolicy: 'network-only',
    variables: {
      rubricSlug,
      productsInput: {
        search,
        excludedProductsIds,
        attributesIds,
        page,
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
    return <Spinner isNested isTransparent />;
  }

  if (error || !data || !data.getRubricBySlug) {
    return <RequestError />;
  }

  const {
    getRubricBySlug: { products },
  } = data;

  return (
    <div>
      <div className='overflow-x-auto'>
        <Table<RubricProductFragment>
          data={products.docs}
          columns={columns}
          emptyMessage={'Список пуст'}
          testIdKey={'nameString'}
        />
      </div>
      <Pager page={page} setPage={setPage} totalPages={products.totalPages} />
    </div>
  );
};

interface ProductsSearchListInterface extends ProductColumnsInterface {
  excludedProductsIds?: string[];
  attributesIds?: string[] | null;
  search: string;
  viewRubricSlug?: string;
}

const ProductsSearchList: React.FC<ProductsSearchListInterface> = ({
  search,
  excludedProductsIds,
  attributesIds,
  viewRubricSlug,
  ...props
}) => {
  const [page, setPage] = React.useState<number>(1);

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
    return <Spinner isNested isTransparent />;
  }

  if (error || !data || !data.getProductsList) {
    return <RequestError />;
  }

  const {
    getProductsList: { docs, totalPages },
  } = data;

  return (
    <div>
      <div className='overflow-x-auto'>
        <Table<RubricProductFragment>
          data={docs}
          columns={columns}
          emptyMessage={`По запросу "${search}" товаров не найдено`}
          testIdKey={'name'}
        />
      </div>
      <Pager page={page} setPage={setPage} totalPages={totalPages} />
    </div>
  );
};

export interface ProductSearchModalInterface extends ProductColumnsInterface {
  excludedProductsIds?: string[];
  attributesIds?: string[] | null;
  testId?: string;
  rubricSlug?: string;
}

const ProductSearchModal: React.FC<ProductSearchModalInterface> = ({
  testId,
  excludedProductsIds,
  attributesIds,
  rubricSlug,
  ...props
}) => {
  const [search, setSearch] = React.useState<string | null>(null);
  const { data, error, loading } = useGetAllRubricsQuery({
    fetchPolicy: 'network-only',
  });

  if (rubricSlug) {
    return (
      <ModalFrame testId={testId} size={'wide'}>
        <FormikIndividualSearch
          onSubmit={setSearch}
          testId={'product'}
          withReset
          onReset={() => setSearch(null)}
        />

        <ProductsList
          search={search}
          rubricSlug={rubricSlug}
          excludedProductsIds={excludedProductsIds}
          attributesIds={attributesIds}
          {...props}
        />
      </ModalFrame>
    );
  }

  if (!data && !loading && !error) {
    return (
      <ModalFrame>
        <ModalTitle>Ошибка загрузки данных</ModalTitle>
      </ModalFrame>
    );
  }

  if (loading) {
    return <Spinner isNested isTransparent />;
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
                  rubricSlug={slug}
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
