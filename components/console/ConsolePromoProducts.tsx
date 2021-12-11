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
import { noNaN } from 'lib/numbers';
import { useRouter } from 'next/router';
import * as React from 'react';

export interface ConsolePromoProductsInterface {
  rubric: RubricInterface;
  promo: PromoInterface;
  basePath: string;
  pageCompany: CompanyInterface;
  promoProducts: GetConsoleRubricPromoProductsPayloadInterface;
}

const ConsolePromoProducts: React.FC<ConsolePromoProductsInterface> = ({
  promoProducts,
  rubric,
  basePath,
  promo,
  pageCompany,
}) => {
  const { query } = useRouter();
  const { showLoading } = useAppContext();
  const [shopProductIds, setShopProductIds] = React.useState<string[]>([]);
  const isPageLoading = usePageLoadingState();

  console.log(query.filters);
  const [deletePromoProductsMutation] = useDeletePromoProducts();
  const [addPromoProductsMutation] = useAddPromoProducts();

  React.useEffect(() => {
    const shopProductIds = promoProducts.docs.reduce(
      (acc: string[], { promoProductsCount, _id }) => {
        if (noNaN(promoProductsCount) > 0) {
          return [...acc, `${_id}`];
        }
        return acc;
      },
      [],
    );
    setShopProductIds(shopProductIds);
  }, [promoProducts.docs]);

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
        const checked = shopProductIds.includes(cellData);
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

      <div className={`max-w-full`}>
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

        <div className={'max-w-full'}>
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
