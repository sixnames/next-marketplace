import { noNaN } from 'lib/numbers';
import * as React from 'react';
import { useRouter } from 'next/router';
import {
  ShopProductFragment,
  useAddProductToShopMutation,
  useDeleteProductFromShopMutation,
  useGetShopProductsQuery,
  useUpdateShopProductMutation,
} from 'generated/apolloComponents';
import useDataLayoutMethods from '../../hooks/useDataLayoutMethods';
import Spinner from '../../components/Spinner/Spinner';
import RequestError from '../../components/RequestError/RequestError';
import Inner from '../../components/Inner/Inner';
import RowWithGap from '../../layout/RowWithGap/RowWithGap';
import Table, { TableColumn } from '../../components/Table/Table';
import Button from '../../components/Buttons/Button';
import Pager from '../../components/Pager/Pager';
import Link from 'next/link';
import TableRowImage from '../../components/Table/TableRowImage';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import { SHOP_PRODUCTS_QUERY } from 'graphql/query/companiesQueries';
import ContentItemControls from '../../components/ContentItemControls/ContentItemControls';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal/ConfirmModal';
import { CONFIRM_MODAL, PRODUCT_SEARCH_MODAL, SHOP_PRODUCT_MODAL } from 'config/modals';
import { ShopProductModalInterface } from 'components/Modal/ShopProductModal/ShopProductModal';
import { ProductSearchModalInterface } from 'components/Modal/ProductSearchModal/ProductSearchModal';
import { ROUTE_CMS } from 'config/common';

const ShopProducts: React.FC = () => {
  const router = useRouter();
  const { query } = router;
  const { shopId } = query;
  const { setPage, page, contentFilters } = useDataLayoutMethods();

  const shopProductsVariables = {
    shopId: `${shopId}`,
    input: {
      page: noNaN(contentFilters.page) || 1,
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

  const refetchQueries = [
    {
      query: SHOP_PRODUCTS_QUERY,
      variables: shopProductsVariables,
    },
  ];

  const [deleteProductFromShopMutation] = useDeleteProductFromShopMutation({
    awaitRefetchQueries: true,
    onCompleted: (data) => onCompleteCallback(data.deleteProductFromShop),
    onError: onErrorCallback,
    refetchQueries,
  });

  const [updateShopProductMutation] = useUpdateShopProductMutation({
    awaitRefetchQueries: true,
    onCompleted: (data) => onCompleteCallback(data.updateShopProduct),
    onError: onErrorCallback,
    refetchQueries,
  });

  const [addProductToShopMutation] = useAddProductToShopMutation({
    awaitRefetchQueries: true,
    onCompleted: (data) => onCompleteCallback(data.addProductToShop),
    onError: onErrorCallback,
    refetchQueries,
  });

  if (loading) {
    return <Spinner isNested />;
  }

  if (error || !data || !data.getShop) {
    return <RequestError />;
  }

  const { shopProducts } = data.getShop;
  const { totalPages, docs } = shopProducts;
  const excludedProductsIds = docs.map(({ product }) => product._id);

  const columns: TableColumn<ShopProductFragment>[] = [
    {
      headTitle: 'Арт',
      render: ({ dataItem }) => (
        <Link href={`${ROUTE_CMS}/shops/${dataItem.product._id}`}>
          <a>{dataItem.product.itemId}</a>
        </Link>
      ),
    },
    {
      headTitle: 'Фото',
      render: ({ dataItem }) => {
        const { name, mainImage } = dataItem.product;
        return <TableRowImage src={mainImage} alt={name} title={name} />;
      },
    },
    {
      accessor: 'product.name',
      headTitle: 'Название',
      render: ({ cellData }) => cellData,
    },
    {
      headTitle: 'Наличие',
      render: ({ dataItem }) => {
        return <div data-cy={`${dataItem._id}-available`}>{dataItem.available}</div>;
      },
    },
    {
      headTitle: 'Цена',
      render: ({ dataItem }) => {
        return <div data-cy={`${dataItem._id}-price`}>{dataItem.price}</div>;
      },
    },
    {
      render: ({ dataItem }) => {
        return (
          <ContentItemControls
            justifyContent={'flex-end'}
            updateTitle={'Редактировать товар'}
            updateHandler={() => {
              showModal<ShopProductModalInterface>({
                variant: SHOP_PRODUCT_MODAL,
                props: {
                  title: 'Обновление товара',
                  shopProduct: dataItem,
                  confirm: (values) => {
                    showLoading();
                    updateShopProductMutation({
                      variables: {
                        input: {
                          ...values,
                          shopProductId: dataItem._id,
                          productId: dataItem.product._id,
                        },
                      },
                    }).catch(() => {
                      showErrorNotification();
                    });
                  },
                },
              });
            }}
            deleteTitle={'Удалить товар из магазина'}
            deleteHandler={() => {
              showModal<ConfirmModalInterface>({
                variant: CONFIRM_MODAL,
                props: {
                  testId: 'delete-shop-product-modal',
                  message: `Вы уверенны, что хотите удалить ${dataItem.product.name} из магазина?`,
                  confirm: () => {
                    showLoading();
                    deleteProductFromShopMutation({
                      variables: {
                        input: {
                          shopProductId: dataItem._id,
                          shopId: `${shopId}`,
                        },
                      },
                    }).catch(() => {
                      showErrorNotification();
                    });
                  },
                },
              });
            }}
            testId={dataItem._id}
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
        <Button
          onClick={() => {
            showModal<ProductSearchModalInterface>({
              variant: PRODUCT_SEARCH_MODAL,
              props: {
                createTitle: 'Выбрать товар',
                testId: 'product-search-modal',
                excludedProductsIds,
                createHandler: (product) => {
                  showModal<ShopProductModalInterface>({
                    variant: SHOP_PRODUCT_MODAL,
                    props: {
                      title: 'Добавление товара',
                      shopProduct: {
                        price: 0,
                        available: 0,
                        product: {
                          _id: product._id,
                          itemId: product.itemId,
                          mainImage: product.mainImage,
                          name: product.name,
                        },
                      },
                      confirm: (values) => {
                        showLoading();
                        addProductToShopMutation({
                          variables: {
                            input: {
                              ...values,
                              productId: product._id,
                              shopId: `${shopId}`,
                            },
                          },
                        }).catch(() => {
                          showErrorNotification();
                        });
                      },
                    },
                  });
                },
              },
            });
          }}
          testId={'add-shop-product'}
          size={'small'}
        >
          Добавить товар
        </Button>
      </RowWithGap>

      <Pager page={page} setPage={setPage} totalPages={totalPages} />
    </Inner>
  );
};

export default ShopProducts;
