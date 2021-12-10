import Pager from 'components/Pager';
import { DEFAULT_PAGE } from 'config/common';
import { GetRubricProductsListInputInterface } from 'db/dao/product/getRubricProductsList';
import { ConsoleRubricProductsInterface, ProductInterface, RubricInterface } from 'db/uiInterfaces';
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
import qs from 'qs';

interface ProductsListInterface extends ProductColumnsInterface {
  rubricSlug: string;
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
  const [page, setPage] = React.useState<number>(DEFAULT_PAGE);
  const columns = useProductsListColumns({
    createTitle: 'Добавить товар в рубрику',
    ...props,
  });

  const params = React.useMemo<string>(() => {
    const queryParams: Omit<GetRubricProductsListInputInterface, 'currency' | 'locale'> = {
      page,
      rubricSlug,
      attributesIds,
      excludedOptionsSlugs,
      excludedProductsIds,
      search,
    };
    return qs.stringify(queryParams);
  }, [attributesIds, excludedOptionsSlugs, excludedProductsIds, page, rubricSlug, search]);

  const { data, error } = useSWR<ConsoleRubricProductsInterface>(
    `/api/product/search-modal?${params}`,
  );

  if (error) {
    return <RequestError message={'Ошибка загрузки товаров'} />;
  }

  if (!data && !error) {
    return <Spinner isNested isTransparent />;
  }

  return (
    <div>
      <div className='overflow-x-auto'>
        <Table<ProductInterface>
          data={data?.docs}
          columns={columns}
          emptyMessage={'Список пуст'}
          tableTestId={'product-search-list'}
        />
      </div>
      <Pager page={page} setPage={setPage} totalPages={data?.totalPages} />
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
  rubricSlug,
  subtitle,
  ...props
}) => {
  const [search, setSearch] = React.useState<string | null>(null);
  const { data, error } = useSWR<RubricInterface[]>('/api/rubrics');

  if (rubricSlug || (search && rubricSlug)) {
    return (
      <ModalFrame testId={testId} size={'wide'}>
        <FormikIndividualSearch
          onSubmit={setSearch}
          testId={'product'}
          onReset={() => setSearch(null)}
        />

        <ProductsList search={search} rubricSlug={rubricSlug} {...props} />
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
          return <ProductsList rubricSlug={slug} search={search} {...props} />;
        }}
      />
    </ModalFrame>
  );
};

export default ProductSearchModal;
