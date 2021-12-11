import Button from 'components/button/Button';
import CheckBox from 'components/FormElements/Checkbox/Checkbox';
import AppContentFilter from 'components/AppContentFilter';
import FormikRouterSearch from 'components/FormElements/Search/FormikRouterSearch';
import Inner from 'components/Inner';
import Pager from 'components/Pager';
import Spinner from 'components/Spinner';
import Table, { TableColumn } from 'components/Table';
import TableRowImage from 'components/TableRowImage';
import { useAppContext } from 'context/appContext';
import {
  CompanyInterface,
  GetConsoleRubricPromoProductsPayloadInterface,
  PromoInterface,
  RubricInterface,
  ShopProductInterface,
} from 'db/uiInterfaces';
import { useAddPromoProducts, useDeletePromoProducts } from 'hooks/mutations/usePromoMutations';
import usePageLoadingState from 'hooks/usePageLoadingState';
import { alwaysArray } from 'lib/arrayUtils';
import * as React from 'react';

export interface ConsolePromoProductsInterface {
  rubric: RubricInterface;
  promo: PromoInterface;
  basePath: string;
  pageCompany: CompanyInterface;
  promoProducts: GetConsoleRubricPromoProductsPayloadInterface;
  filters: string[];
  search: string;
}

const ConsolePromoProducts: React.FC<ConsolePromoProductsInterface> = ({
  promoProducts,
  rubric,
  basePath,
  promo,
  pageCompany,
  filters,
  search,
}) => {
  const { showLoading } = useAppContext();
  const isPageLoading = usePageLoadingState();
  const [deletePromoProductsMutation] = useDeletePromoProducts();
  const [addPromoProductsMutation] = useAddPromoProducts();

  const columns: TableColumn<ShopProductInterface>[] = [
    {
      accessor: 'product.slug',
      headTitle: 'Арт',
      render: ({ cellData }) => {
        return <div>{cellData}</div>;
      },
    },
    {
      headTitle: 'Фото',
      render: ({ dataItem }) => {
        return (
          <TableRowImage
            src={`${dataItem.mainImage}`}
            alt={`${dataItem.product?.snippetTitle}`}
            title={`${dataItem.product?.snippetTitle}`}
          />
        );
      },
    },
    {
      accessor: 'product.snippetTitle',
      headTitle: 'Название',
      render: ({ cellData }) => cellData,
    },
    {
      accessor: 'barcode',
      headTitle: 'Штрих-код',
      render: ({ cellData }) => {
        const barcode = alwaysArray(cellData);
        return (
          <div>
            {barcode.map((barcodeItem, index) => {
              const isLastItem = barcode.length === index + 1;
              return (
                <span key={index}>
                  {barcodeItem}
                  {isLastItem ? '' : ', '}
                </span>
              );
            })}
          </div>
        );
      },
    },
    {
      accessor: '_id',
      headTitle: 'Участвует в акции',
      render: ({ cellData, rowIndex, dataItem }) => {
        const checked = promoProducts.selectedShopProductIds.includes(cellData);
        return (
          <CheckBox
            onChange={() => {
              showLoading();

              if (checked) {
                deletePromoProductsMutation({
                  filters: [],
                  all: false,
                  shopProductId: cellData,
                  companyId: `${pageCompany._id}`,
                  promoId: `${promo._id}`,
                  rubricId: `${dataItem.rubricId}`,
                }).catch(console.log);
              } else {
                addPromoProductsMutation({
                  filters: [],
                  all: false,
                  shopProductIds: [cellData],
                  companyId: `${pageCompany._id}`,
                  promoId: `${promo._id}`,
                  rubricId: `${dataItem.rubricId}`,
                }).catch(console.log);
              }
            }}
            name={'checked'}
            testId={`shop-product-${rowIndex}`}
            value={checked}
            checked={checked}
          />
        );
      },
    },
  ];

  return (
    <Inner testId={'promo-products-list'}>
      <FormikRouterSearch testId={'promo-products'} />

      <div className={`relative max-w-full`}>
        <div className={'mb-8'}>
          <AppContentFilter
            basePath={basePath}
            rubricSlug={rubric.slug}
            attributes={promoProducts.attributes}
            selectedAttributes={promoProducts.selectedAttributes}
            clearSlug={promoProducts.clearSlug}
            excludedParams={[`${rubric._id}`]}
          />
        </div>

        <div className='flex flex-wrap gap-4 mb-6'>
          {filters.length > 0 ? (
            <Button
              size={'small'}
              frameClassName={'w-auto'}
              testId={'add-filtered-rubric-products'}
              onClick={() => {
                addPromoProductsMutation({
                  filters,
                  all: true,
                  shopProductIds: [],
                  companyId: `${pageCompany._id}`,
                  promoId: `${promo._id}`,
                  rubricId: `${rubric._id}`,
                }).catch(console.log);
              }}
            >
              Добавить товары по выбранному фильтру
            </Button>
          ) : null}

          {search.length > 0 ? (
            <Button
              size={'small'}
              frameClassName={'w-auto'}
              testId={'add-search-rubric-products'}
              onClick={() => {
                addPromoProductsMutation({
                  filters,
                  all: true,
                  shopProductIds: [],
                  companyId: `${pageCompany._id}`,
                  promoId: `${promo._id}`,
                  rubricId: `${rubric._id}`,
                  search,
                }).catch(console.log);
              }}
            >
              Добавить результат поиска
            </Button>
          ) : null}

          {filters.length > 0 || search.length > 0 ? null : (
            <Button
              size={'small'}
              frameClassName={'w-auto'}
              testId={'add-all-rubric-products'}
              onClick={() => {
                addPromoProductsMutation({
                  filters: [],
                  all: true,
                  shopProductIds: [],
                  companyId: `${pageCompany._id}`,
                  promoId: `${promo._id}`,
                  rubricId: `${rubric._id}`,
                }).catch(console.log);
              }}
            >
              Добавить все товары рубрики
            </Button>
          )}

          {promoProducts.selectedShopProductIds.length > 0 ? (
            <Button
              theme={'secondary'}
              size={'small'}
              frameClassName={'w-auto'}
              testId={'delete-all-rubric-products'}
              onClick={() => {
                deletePromoProductsMutation({
                  filters: [],
                  all: true,
                  companyId: `${pageCompany._id}`,
                  promoId: `${promo._id}`,
                  rubricId: `${rubric._id}`,
                }).catch(console.log);
              }}
            >
              Удалить все товары рубрики
            </Button>
          ) : null}
        </div>

        <div className={' max-w-full'}>
          <div className={`relative overflow-x-auto overflow-y-hidden`}>
            <Table<ShopProductInterface>
              columns={columns}
              data={promoProducts.docs}
              testIdKey={'_id'}
            />

            {isPageLoading ? <Spinner isNestedAbsolute /> : null}
          </div>

          <Pager page={promoProducts.page} totalPages={promoProducts.totalPages} />
        </div>
      </div>
    </Inner>
  );
};

export default ConsolePromoProducts;
