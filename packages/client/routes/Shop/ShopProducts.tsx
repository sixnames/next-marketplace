import React from 'react';
import { useRouter } from 'next/router';
import {
  ShopProductFragment,
  useDeleteProductFromShopMutation,
  useGetShopProductsQuery,
} from '../../generated/apolloComponents';
import useDataLayoutMethods from '../../hooks/useDataLayoutMethods';
import Spinner from '../../components/Spinner/Spinner';
import RequestError from '../../components/RequestError/RequestError';
import Inner from '../../components/Inner/Inner';
import RowWithGap from '../../layout/RowWithGap/RowWithGap';
import Table, { TableColumn } from '../../components/Table/Table';
import Button from '../../components/Buttons/Button';
import Pager from '../../components/Pager/Pager';
import Link from 'next/link';
import { ROUTE_CMS } from '../../config';
import TableRowImage from '../../components/Table/TableRowImage';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import { SHOP_PRODUCTS_QUERY } from '../../graphql/query/companiesQueries';
import ContentItemControls from '../../components/ContentItemControls/ContentItemControls';
import { ConfirmModalInterface } from '../../components/Modal/ConfirmModal/ConfirmModal';
import { CONFIRM_MODAL } from '../../config/modals';

const ShopProducts: React.FC = () => {
  const router = useRouter();
  const { query } = router;
  const { shopId } = query;
  const { setPage, page, contentFilters } = useDataLayoutMethods();

  const shopProductsVariables = {
    shopId: `${shopId}`,
    input: {
      page: contentFilters.page,
    },
  };

  const { data, loading, error } = useGetShopProductsQuery({
    variables: shopProductsVariables,
  });
  const {
    showModal,
    onErrorCallback,
    onCompleteCallback,
    showLoading,
    showErrorNotification,
  } = useMutationCallbacks({ withModal: true });
  const [deleteProductFromShopMutation] = useDeleteProductFromShopMutation({
    onCompleted: (data) => onCompleteCallback(data.deleteProductFromShop),
    onError: onErrorCallback,
    refetchQueries: [
      {
        query: SHOP_PRODUCTS_QUERY,
        variables: shopProductsVariables,
      },
    ],
  });

  if (loading) {
    return <Spinner isNested />;
  }

  if (error || !data || !data.getShop) {
    return <RequestError />;
  }

  const { totalPages, docs } = data.getShop.products;

  const columns: TableColumn<ShopProductFragment>[] = [
    {
      accessor: 'product.itemId',
      headTitle: 'ID',
      render: ({ cellData, dataItem }) => (
        <Link href={`${ROUTE_CMS}/shops/${dataItem.product.id}`}>
          <a>{cellData}</a>
        </Link>
      ),
    },
    {
      headTitle: 'Фото',
      render: ({ dataItem }) => {
        const { nameString, mainImage } = dataItem.product;
        return <TableRowImage url={mainImage} alt={nameString} title={nameString} />;
      },
    },
    {
      accessor: 'product.nameString',
      headTitle: 'Название',
      render: ({ cellData }) => cellData,
    },
    {
      headTitle: 'Наличие',
      accessor: 'available',
      render: ({ cellData }) => {
        return cellData;
      },
    },
    {
      headTitle: 'Цена',
      accessor: 'price',
      render: ({ cellData }) => {
        return cellData;
      },
    },
    {
      render: ({ dataItem }) => {
        return (
          <ContentItemControls
            deleteTitle={'Удалить товар из магазина'}
            deleteHandler={() => {
              showModal<ConfirmModalInterface>({
                type: CONFIRM_MODAL,
                props: {
                  testId: 'delete-shop-product-modal',
                  message: `Вы уверенны, что хотите удалить ${dataItem.product.nameString} из магазина?`,
                  confirm: () => {
                    showLoading();
                    deleteProductFromShopMutation({
                      variables: {
                        input: {
                          productId: dataItem.id,
                          shopId: `${shopId}`,
                        },
                      },
                    }).catch(() => {
                      showErrorNotification({});
                    });
                  },
                },
              });
            }}
            testId={dataItem.itemId}
          />
        );
      },
    },
  ];

  return (
    <Inner testId={'shop-products'}>
      <RowWithGap>
        <Table<ShopProductFragment> columns={columns} data={docs} testIdKey={'slug'} />
      </RowWithGap>

      <RowWithGap>
        <Button testId={'add-product'} size={'small'}>
          Добавить товар
        </Button>
      </RowWithGap>

      <Pager page={page} setPage={setPage} totalPages={totalPages} />
    </Inner>
  );
};

export default ShopProducts;
