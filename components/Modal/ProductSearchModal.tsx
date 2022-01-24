import * as React from 'react';
import useSWR from 'swr';
import qs from 'qs';
import { DEFAULT_PAGE } from '../../config/common';
import { GetRubricProductsListInputInterface } from '../../db/dao/product/getRubricProductsList';
import {
  ConsoleRubricProductsInterface,
  ProductSummaryInterface,
  RubricInterface,
} from '../../db/uiInterfaces';
import { getCmsLinks } from '../../lib/linkUtils';
import ContentItemControls, { ContentItemControlsInterface } from '../button/ContentItemControls';
import FormikIndividualSearch from '../FormElements/Search/FormikIndividualSearch';
import WpLink from '../Link/WpLink';
import Pager from '../Pager';
import RequestError from '../RequestError';
import RubricsList from '../RubricsList';
import Spinner from '../Spinner';
import TableRowImage from '../TableRowImage';
import WpTable, { WpTableColumn } from '../WpTable';
import ModalFrame from './ModalFrame';
import ModalTitle from './ModalTitle';

export type ProductColumnsItemHandler = (product: ProductSummaryInterface) => void;
export type ProductColumnsHandlerPermission = (product: ProductSummaryInterface) => boolean;

export interface ProductColumnsInterface
  extends Omit<
    ContentItemControlsInterface,
    | 'isCreateDisabled'
    | 'isUpdateDisabled'
    | 'isDeleteDisabled'
    | 'createHandler'
    | 'updateHandler'
    | 'deleteHandler'
  > {
  createHandler?: ProductColumnsItemHandler;
  updateHandler?: ProductColumnsItemHandler;
  deleteHandler?: ProductColumnsItemHandler;
  isCreateDisabled?: ProductColumnsHandlerPermission;
  isUpdateDisabled?: ProductColumnsHandlerPermission;
  isDeleteDisabled?: ProductColumnsHandlerPermission;
}

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
  createTitle,
  updateTitle,
  deleteTitle,
  createHandler,
  updateHandler,
  deleteHandler,
  disabled,
  isCreateDisabled,
  isUpdateDisabled,
  isDeleteDisabled,
}) => {
  const [page, setPage] = React.useState<number>(DEFAULT_PAGE);
  const columns: WpTableColumn<ProductSummaryInterface>[] = [
    {
      accessor: 'itemId',
      headTitle: 'Арт.',
      render: ({ cellData, dataItem }) => {
        const links = getCmsLinks({
          rubricSlug: dataItem.rubricSlug,
          productId: dataItem._id,
        });
        return (
          <WpLink target={'_blank'} href={links.rubrics.product.root}>
            {cellData}
          </WpLink>
        );
      },
    },
    {
      accessor: 'mainImage',
      headTitle: 'Фото',
      render: ({ cellData, dataItem }) => {
        return (
          <TableRowImage src={cellData} alt={dataItem.originalName} title={dataItem.originalName} />
        );
      },
    },
    {
      accessor: 'snippetTitle',
      headTitle: 'Название',
      render: ({ cellData }) => cellData,
    },
    {
      render: ({ dataItem }) => {
        return (
          <div className='flex justify-end'>
            <ContentItemControls
              testId={dataItem.originalName}
              disabled={disabled}
              createTitle={createTitle}
              updateTitle={updateTitle}
              deleteTitle={deleteTitle}
              createHandler={createHandler ? () => createHandler(dataItem) : undefined}
              updateHandler={updateHandler ? () => updateHandler(dataItem) : undefined}
              deleteHandler={deleteHandler ? () => deleteHandler(dataItem) : undefined}
              isDeleteDisabled={isDeleteDisabled ? isDeleteDisabled(dataItem) : undefined}
              isCreateDisabled={isCreateDisabled ? isCreateDisabled(dataItem) : undefined}
              isUpdateDisabled={isUpdateDisabled ? isUpdateDisabled(dataItem) : undefined}
            />
          </div>
        );
      },
    },
  ];

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
        <WpTable<ProductSummaryInterface>
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

  if (rubricSlug) {
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
      <ModalFrame size={'wide'}>
        <ModalTitle>Ошибка загрузки рубрик</ModalTitle>
      </ModalFrame>
    );
  }

  if (!data && !error) {
    return (
      <ModalFrame size={'wide'}>
        <Spinner isNested isTransparent />
      </ModalFrame>
    );
  }

  if (!data) {
    return (
      <ModalFrame size={'wide'}>
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
        openAll={Boolean(search)}
        rubrics={data}
        render={({ slug }) => {
          return <ProductsList rubricSlug={slug} search={search} {...props} />;
        }}
      />
    </ModalFrame>
  );
};

export default ProductSearchModal;
