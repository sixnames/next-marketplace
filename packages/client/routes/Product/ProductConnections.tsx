import React from 'react';
import {
  CmsProductConnectionFragment,
  CmsProductConnectionItemFragment,
  CmsProductFragment,
  useAddProductToConnectionMutation,
  useCreateProductConnectionMutation,
  useDeleteProductFromConnectionMutation,
} from '../../generated/apolloComponents';
import Inner from '../../components/Inner/Inner';
import Button from '../../components/Buttons/Button';
import { CreateConnectionModalInterface } from '../../components/Modal/CreateConnectionModal/CreateConnectionModal';
import { CONFIRM_MODAL, CREATE_CONNECTION_MODAL, PRODUCT_SEARCH_MODAL } from '../../config/modals';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import { PRODUCT_QUERY } from '../../graphql/complex/productsQueries';
import classes from './ProductConnections.module.css';
import Accordion from '../../components/Accordion/Accordion';
import Table, { TableColumn } from '../../components/Table/Table';
import TableRowImage from '../../components/Table/TableRowImage';
import ContentItemControls from '../../components/ContentItemControls/ContentItemControls';
import { ProductSearchModalInterface } from '../../components/Modal/ProductSearchModal/ProductSearchModal';
import { ConfirmModalInterface } from '../../components/Modal/ConfirmModal/ConfirmModal';

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
    refetchQueries: [{ query: PRODUCT_QUERY, variables: { id: productId } }],
  });

  return (
    <ContentItemControls
      testId={`${connection.attribute.nameString}-connection`}
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
                    addProductId: product.id,
                    connectionId: connection.id,
                    productId,
                  },
                },
              }).catch((e) => console.log(e));
            },
            createTitle: 'Добавить товар в связь',
            testId: 'add-product-to-connection-modal',
            excludedProductsIds: [productId],
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
    refetchQueries: [{ query: PRODUCT_QUERY, variables: { id: productId } }],
  });

  const { attribute, products } = connection;

  const connectionName = attribute.nameString;

  const columns: TableColumn<CmsProductConnectionItemFragment>[] = [
    {
      accessor: 'node.itemId',
      headTitle: 'Арт.',
      render: ({ cellData }) => cellData,
    },
    {
      accessor: 'node',
      headTitle: 'Фото',
      render: ({ cellData }) => {
        return (
          <TableRowImage
            url={cellData.mainImage}
            alt={cellData.nameString}
            title={cellData.nameString}
          />
        );
      },
    },
    {
      accessor: 'node.nameString',
      headTitle: 'Название',
      render: ({ cellData }) => cellData,
    },
    {
      accessor: 'node.price',
      headTitle: 'Цена',
      render: ({ cellData }) => cellData,
    },
    {
      accessor: 'node.active',
      headTitle: 'Активен',
      render: ({ cellData }) => (cellData ? 'Да' : 'Нет'),
    },
    {
      accessor: 'optionName',
      headTitle: 'Значение',
      render: ({ cellData }) => cellData,
    },
    {
      render: ({ dataItem }) => {
        return (
          <ContentItemControls
            testId={dataItem.node.nameString}
            deleteTitle={'Удалить товар из связи'}
            justifyContent={'flex-end'}
            deleteHandler={() => {
              showModal<ConfirmModalInterface>({
                variant: CONFIRM_MODAL,
                props: {
                  message: `Вы уверенны, что хотите удалить ${dataItem.node.nameString} из связи ${connection.attribute.nameString}?`,
                  testId: 'delete-product-from-connection-modal',
                  confirm: () => {
                    showLoading();
                    deleteProductFromConnectionMutation({
                      variables: {
                        input: {
                          deleteProductId: dataItem.node.id,
                          connectionId: connection.id,
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
      testId={`${connectionName}-connection`}
      title={connectionName}
      isOpen
      className={classes.listItem}
      titleRight={<ProductConnectionControls connection={connection} productId={productId} />}
    >
      <Table<CmsProductConnectionItemFragment>
        columns={columns}
        data={products}
        tableTestId={`${connectionName}-connection-list`}
        testIdKey={'node.nameString'}
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
    refetchQueries: [{ query: PRODUCT_QUERY, variables: { id: product.id } }],
  });

  return (
    <Inner wide>
      <div className={classes.list}>
        {product.connections.map((connection) => {
          return (
            <ProductConnectionsItem
              key={connection.id}
              productId={product.id}
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
