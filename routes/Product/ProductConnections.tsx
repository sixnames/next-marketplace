import * as React from 'react';
import {
  CmsProductConnectionFragment,
  CmsProductConnectionItemFragment,
  CmsProductFragment,
  useAddProductToConnectionMutation,
  useCreateProductConnectionMutation,
  useDeleteProductFromConnectionMutation,
} from 'generated/apolloComponents';
import Inner from '../../components/Inner/Inner';
import Button from '../../components/Buttons/Button';
import { CreateConnectionModalInterface } from 'components/Modal/CreateConnectionModal/CreateConnectionModal';
import { CONFIRM_MODAL, CREATE_CONNECTION_MODAL, PRODUCT_SEARCH_MODAL } from 'config/modals';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import { PRODUCT_QUERY } from 'graphql/complex/productsQueries';
import classes from './ProductConnections.module.css';
import Accordion from '../../components/Accordion/Accordion';
import Table, { TableColumn } from '../../components/Table/Table';
import TableRowImage from '../../components/Table/TableRowImage';
import ContentItemControls from '../../components/ContentItemControls/ContentItemControls';
import { ProductSearchModalInterface } from 'components/Modal/ProductSearchModal/ProductSearchModal';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal/ConfirmModal';

interface ProductConnectionControlsInterface {
  connection: CmsProductConnectionFragment;
  productId: string;
}

const ProductConnectionControls: React.FC<ProductConnectionControlsInterface> = ({
  connection,
  productId,
}) => {
  const { showModal, showLoading, onCompleteCallback, onErrorCallback } = useMutationCallbacks({
    withModal: true,
  });
  const [addProductToConnectionMutation] = useAddProductToConnectionMutation({
    onCompleted: (data) => onCompleteCallback(data.addProductToConnection),
    onError: onErrorCallback,
    awaitRefetchQueries: true,
    refetchQueries: [{ query: PRODUCT_QUERY, variables: { _id: productId } }],
  });

  const excludedProductsIds = connection.connectionProducts.map(({ productId }) => productId);

  return (
    <ContentItemControls
      testId={`${connection.attributeName}-connection`}
      createTitle={'Добавить товар к связи'}
      createHandler={() => {
        showModal<ProductSearchModalInterface>({
          variant: PRODUCT_SEARCH_MODAL,
          props: {
            createHandler: (product) => {
              showLoading();
              addProductToConnectionMutation({
                variables: {
                  input: {
                    addProductId: product._id,
                    connectionId: connection._id,
                    productId,
                  },
                },
              }).catch((e) => console.log(e));
            },
            createTitle: 'Добавить товар в связь',
            testId: 'add-product-to-connection-modal',
            excludedProductsIds,
            attributesIds: [connection.attributeId],
          },
        });
      }}
    />
  );
};

export interface ProductConnectionsItemInterface {
  productId: string;
  connection: CmsProductConnectionFragment;
}

const ProductConnectionsItem: React.FC<ProductConnectionsItemInterface> = ({
  connection,
  productId,
}) => {
  const { showModal, showLoading, onCompleteCallback, onErrorCallback } = useMutationCallbacks({
    withModal: true,
  });
  const [deleteProductFromConnectionMutation] = useDeleteProductFromConnectionMutation({
    onCompleted: (data) => onCompleteCallback(data.deleteProductFromConnection),
    onError: onErrorCallback,
    awaitRefetchQueries: true,
    refetchQueries: [{ query: PRODUCT_QUERY, variables: { _id: productId } }],
  });

  const { connectionProducts } = connection;

  const columns: TableColumn<CmsProductConnectionItemFragment>[] = [
    {
      accessor: 'product.itemId',
      headTitle: 'Арт.',
      render: ({ cellData }) => cellData,
    },
    {
      accessor: 'product',
      headTitle: 'Фото',
      render: ({ cellData }) => {
        return <TableRowImage src={cellData.mainImage} alt={cellData.name} title={cellData.name} />;
      },
    },
    {
      accessor: 'product.name',
      headTitle: 'Название',
      render: ({ cellData }) => cellData,
    },
    {
      accessor: 'product.active',
      headTitle: 'Активен',
      render: ({ cellData }) => (cellData ? 'Да' : 'Нет'),
    },
    {
      accessor: 'value',
      headTitle: 'Значение',
      render: ({ cellData }) => cellData,
    },
    {
      render: ({ dataItem }) => {
        return (
          <ContentItemControls
            testId={`${dataItem.product.name}`}
            deleteTitle={'Удалить товар из связи'}
            justifyContent={'flex-end'}
            deleteHandler={() => {
              showModal<ConfirmModalInterface>({
                variant: CONFIRM_MODAL,
                props: {
                  message: `Вы уверенны, что хотите удалить ${dataItem.product.name} из связи ${connection.attributeName}?`,
                  testId: 'delete-product-from-connection-modal',
                  confirm: () => {
                    showLoading();
                    deleteProductFromConnectionMutation({
                      variables: {
                        input: {
                          deleteProductId: dataItem.product._id,
                          connectionId: connection._id,
                          productId,
                        },
                      },
                    }).catch((e) => console.log(e));
                  },
                },
              });
            }}
          />
        );
      },
    },
  ];

  return (
    <Accordion
      testId={`${connection.attributeName}-connection`}
      title={connection.attributeName}
      isOpen
      className={classes.listItem}
      titleRight={<ProductConnectionControls connection={connection} productId={productId} />}
    >
      <Table<CmsProductConnectionItemFragment>
        columns={columns}
        data={connectionProducts}
        tableTestId={`${connection.attributeName}-connection-list`}
        testIdKey={'product.name'}
      />
    </Accordion>
  );
};

interface ProductConnectionsInterface {
  product: CmsProductFragment;
}

const ProductConnections: React.FC<ProductConnectionsInterface> = ({ product }) => {
  const { onCompleteCallback, onErrorCallback, showLoading, showModal } = useMutationCallbacks({
    withModal: true,
  });
  const [createProductConnectionMutation] = useCreateProductConnectionMutation({
    onCompleted: (data) => onCompleteCallback(data.createProductConnection),
    onError: onErrorCallback,
    awaitRefetchQueries: true,
    refetchQueries: [{ query: PRODUCT_QUERY, variables: { _id: product._id } }],
  });

  return (
    <Inner wide>
      <div className={classes.list}>
        {product.connections.map((connection) => {
          return (
            <ProductConnectionsItem
              key={connection._id}
              productId={product._id}
              connection={connection}
            />
          );
        })}
      </div>

      <Button
        size={'small'}
        testId={`create-connection`}
        onClick={() =>
          showModal<CreateConnectionModalInterface>({
            variant: CREATE_CONNECTION_MODAL,
            props: {
              product,
              confirm: (input) => {
                showLoading();
                createProductConnectionMutation({
                  variables: {
                    input,
                  },
                }).catch((e) => console.log(e));
              },
            },
          })
        }
      >
        Создать связь
      </Button>
    </Inner>
  );
};

export default ProductConnections;
