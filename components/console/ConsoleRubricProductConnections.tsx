import Accordion from 'components/Accordion';
import WpButton from 'components/button/WpButton';
import ContentItemControls from 'components/button/ContentItemControls';
import FixedButtons from 'components/button/FixedButtons';
import Inner from 'components/Inner';
import WpLink from 'components/Link/WpLink';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal';
import { CreateConnectionModalInterface } from 'components/Modal/CreateConnectionModal';
import { ProductSearchModalInterface } from 'components/Modal/ProductSearchModal';
import WpTable, { WpTableColumn } from 'components/WpTable';
import TableRowImage from 'components/TableRowImage';
import { FILTER_SEPARATOR, ROUTE_CMS } from 'config/common';
import { CONFIRM_MODAL, CREATE_CONNECTION_MODAL, PRODUCT_SEARCH_MODAL } from 'config/modalVariants';
import {
  ProductConnectionInterface,
  ProductConnectionItemInterface,
  ProductInterface,
} from 'db/uiInterfaces';
import {
  useAddProductToConnectionMutation,
  useCreateProductConnectionMutation,
  useDeleteProductFromConnectionMutation,
} from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import * as React from 'react';

interface ProductConnectionControlsInterface {
  connection: ProductConnectionInterface;
  product: ProductInterface;
}

const ProductConnectionControls: React.FC<ProductConnectionControlsInterface> = ({
  connection,
  product,
}) => {
  const { showModal, showLoading, onCompleteCallback, onErrorCallback } = useMutationCallbacks({
    withModal: true,
    reload: true,
  });
  const [addProductToConnectionMutation] = useAddProductToConnectionMutation({
    onError: onErrorCallback,
    onCompleted: (data) => onCompleteCallback(data.addProductToConnection),
  });

  const excludedProductsIds = connection.productsIds.map((productId) => `${productId}`);
  const excludedOptionsSlugs = (connection.connectionProducts || []).map(({ option }) => {
    return `${connection.attribute?.slug}${FILTER_SEPARATOR}${option?.slug}`;
  });

  return (
    <ContentItemControls
      testId={`${connection.attribute?.name}-connection-product`}
      createTitle={'Добавить товар к связи'}
      createHandler={() => {
        showModal<ProductSearchModalInterface>({
          variant: PRODUCT_SEARCH_MODAL,
          props: {
            rubricSlug: product.rubricSlug,
            createHandler: (addProduct) => {
              showLoading();
              addProductToConnectionMutation({
                variables: {
                  input: {
                    addProductId: addProduct._id,
                    connectionId: connection._id,
                    productId: product._id,
                  },
                },
              }).catch((e) => console.log(e));
            },
            createTitle: 'Добавить товар в связь',
            testId: 'add-product-to-connection-modal',
            excludedProductsIds,
            excludedOptionsSlugs,
            attributesIds: [`${connection.attributeId}`],
          },
        });
      }}
    />
  );
};

export interface ProductConnectionsItemInterface {
  product: ProductInterface;
  connection: ProductConnectionInterface;
  connectionIndex: number;
}

const ProductConnectionsItem: React.FC<ProductConnectionsItemInterface> = ({
  connection,
  product,
  connectionIndex,
}) => {
  const { showModal, showLoading, onCompleteCallback, onErrorCallback } = useMutationCallbacks({
    withModal: true,
    reload: true,
  });
  const [deleteProductFromConnectionMutation] = useDeleteProductFromConnectionMutation({
    onError: onErrorCallback,
    onCompleted: (data) => onCompleteCallback(data.deleteProductFromConnection),
  });

  const { connectionProducts } = connection;

  const columns: WpTableColumn<ProductConnectionItemInterface>[] = [
    {
      headTitle: 'Арт',
      render: ({ dataItem, rowIndex }) => {
        return (
          <WpLink
            target={'_blank'}
            testId={`product-link-${rowIndex}`}
            href={`${ROUTE_CMS}/rubrics/${dataItem.product?.rubricId}/products/product/${dataItem.product?._id}`}
          >
            {dataItem.product?.itemId}
          </WpLink>
        );
      },
    },
    {
      accessor: 'product',
      headTitle: 'Фото',
      render: ({ cellData }) => {
        if (!cellData) {
          return null;
        }
        return (
          <TableRowImage
            src={cellData.mainImage}
            alt={cellData.originalName}
            title={cellData.originalName}
          />
        );
      },
    },
    {
      accessor: 'product.snippetTitle',
      headTitle: 'Название',
      render: ({ cellData }) => {
        return cellData || 'Товар не найден';
      },
    },
    {
      accessor: 'option.name',
      headTitle: 'Значение',
      render: ({ cellData }) => {
        return <div>{cellData}</div>;
      },
    },
    {
      render: ({ dataItem, rowIndex }) => {
        return (
          <ContentItemControls
            testId={`${connectionIndex}-${rowIndex}`}
            justifyContent={'flex-end'}
            updateTitle={'Редактировать товар'}
            updateHandler={() => {
              window.open(
                `${ROUTE_CMS}/rubrics/${dataItem.product?.rubricId}/products/product/${dataItem.product?._id}`,
                '_blank',
              );
            }}
            deleteTitle={'Удалить товар из связи'}
            deleteHandler={() => {
              showModal<ConfirmModalInterface>({
                variant: CONFIRM_MODAL,
                props: {
                  message: `Вы уверенны, что хотите удалить ${dataItem?.product?.originalName} из связи ${connection.attribute?.name}?`,
                  testId: 'delete-product-from-connection-modal',
                  confirm: () => {
                    showLoading();
                    deleteProductFromConnectionMutation({
                      variables: {
                        input: {
                          deleteProductId: dataItem?.product?._id,
                          connectionId: connection._id,
                          productId: product._id,
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

  if (!connection.attribute) {
    return null;
  }

  return (
    <Accordion
      testId={`${connection.attribute.name}-connection`}
      title={`${connection.attribute.name}`}
      isOpen
      className='mb-8'
      titleRight={<ProductConnectionControls connection={connection} product={product} />}
    >
      <div className='mt-4'>
        <WpTable<ProductConnectionItemInterface>
          columns={columns}
          data={connectionProducts}
          tableTestId={`${connection.attribute.name}-connection-list`}
          onRowDoubleClick={(dataItem) => {
            window.open(
              `${ROUTE_CMS}/rubrics/${dataItem.product?.rubricId}/products/product/${dataItem.product?._id}`,
              '_blank',
            );
          }}
          testIdKey={'product.name'}
        />
      </div>
    </Accordion>
  );
};

interface ConsoleRubricProductConnectionsInterface {
  product: ProductInterface;
}

const ConsoleRubricProductConnections: React.FC<ConsoleRubricProductConnectionsInterface> = ({
  product,
}) => {
  const { onCompleteCallback, onErrorCallback, showLoading, showModal } = useMutationCallbacks({
    withModal: true,
    reload: true,
  });
  const [createProductConnectionMutation] = useCreateProductConnectionMutation({
    onError: onErrorCallback,
    onCompleted: (data) => onCompleteCallback(data.createProductConnection),
  });

  return (
    <Inner testId={'product-connections-list'}>
      <div className='mb-8'>
        {(product.connections || []).map((connection, connectionIndex) => {
          return (
            <ProductConnectionsItem
              key={`${connection._id}`}
              product={product}
              connection={connection}
              connectionIndex={connectionIndex}
            />
          );
        })}
      </div>

      <FixedButtons>
        <WpButton
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
        </WpButton>
      </FixedButtons>
    </Inner>
  );
};

export default ConsoleRubricProductConnections;
