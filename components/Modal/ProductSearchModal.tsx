import Pager from 'components/Pager';
import { ONE_MINUTE } from 'config/common';
import { ProductInterface, RubricInterface } from 'db/uiInterfaces';
import * as React from 'react';
import Spinner from 'components/Spinner';
import RequestError from 'components/RequestError';
import ModalFrame from 'components/Modal/ModalFrame';
import ModalTitle from 'components/Modal/ModalTitle';
import FormikIndividualSearch from 'components/FormElements/Search/FormikIndividualSearch';
import RubricsList from 'components/RubricsList';
import useProductsListColumns, { ProductColumnsInterface } from 'hooks/useProductsListColumns';
import Table from 'components/Table';
import useSWR from 'swr';

interface ProductsListInterface extends ProductColumnsInterface {
  rubricSlug?: string | null;
  excludedProductsIds?: string[];
  attributesIds?: string[] | null;
  excludedOptionsSlugs?: string[] | null;
  search?: string | null;
}

const ProductsList: React.FC<ProductsListInterface> = ({
  rubricSlug,
  excludedProductsIds,
  attributesIds,
  excludedOptionsSlugs,
  search,
  ...props
}) => {
  const [page, setPage] = React.useState<number>(1);
  const columns = useProductsListColumns({
    createTitle: 'Добавить товар в рубрику',
    ...props,
  });

  const { data, loading } = useGetRubricProductsQuery({
    fetchPolicy: 'network-only',
    variables: {
      rubricSlug,
      productsInput: {
        search,
        excludedProductsIds,
        attributesIds,
        excludedOptionsSlugs,
        page,
      },
    },
  });

  if (!data && !loading) {
    return (
      <ModalFrame>
        <ModalTitle>Ошибка загрузки данных</ModalTitle>
      </ModalFrame>
    );
  }

  if (loading) {
    return <Spinner isNested isTransparent />;
  }

  const {
    getRubricBySlug: { products },
  } = data;

  return (
    <div>
      <div className='overflow-x-auto'>
        <Table<ProductInterface>
          data={products.docs}
          columns={columns}
          emptyMessage={'Список пуст'}
          tableTestId={'product-search-list'}
        />
      </div>
      <Pager page={page} setPage={setPage} totalPages={products.totalPages} />
    </div>
  );
};

export interface ProductSearchModalInterface extends ProductColumnsInterface {
  excludedProductsIds?: string[];
  attributesIds?: string[] | null;
  excludedOptionsSlugs?: string[] | null;
  testId?: string;
  rubricSlug?: string;
  subtitle?: any;
}

const ProductSearchModal: React.FC<ProductSearchModalInterface> = ({
  testId,
  excludedProductsIds,
  excludedOptionsSlugs,
  attributesIds,
  rubricSlug,
  subtitle,
  ...props
}) => {
  const [search, setSearch] = React.useState<string | null>(null);
  const { data, error } = useSWR<RubricInterface[]>('/api/rubrics', {
    refreshInterval: ONE_MINUTE,
  });

  if (rubricSlug || search) {
    return (
      <ModalFrame testId={testId} size={'wide'}>
        <FormikIndividualSearch
          onSubmit={setSearch}
          testId={'product'}
          onReset={() => setSearch(null)}
        />

        <ProductsList
          search={search}
          rubricSlug={search ? null : rubricSlug}
          excludedProductsIds={excludedProductsIds}
          attributesIds={attributesIds}
          excludedOptionsSlugs={excludedOptionsSlugs}
          {...props}
        />
      </ModalFrame>
    );
  }

  if (!data && error) {
    return (
      <ModalFrame>
        <ModalTitle>Ошибка загрузки рубрик</ModalTitle>
      </ModalFrame>
    );
  }

  if (!data && !error) {
    return (
      <ModalFrame>
        <Spinner isNested isTransparent />
      </ModalFrame>
    );
  }

  if (!data) {
    return (
      <ModalFrame>
        <RequestError />
      </ModalFrame>
    );
  }

  return (
    <ModalFrame testId={testId} size={'wide'}>
      <ModalTitle>Выберите товар</ModalTitle>
      {subtitle}

      <FormikIndividualSearch
        onSubmit={setSearch}
        testId={'product'}
        onReset={() => setSearch(null)}
      />

      <RubricsList
        low
        rubrics={data}
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
    </ModalFrame>
  );
};

export default ProductSearchModal;
