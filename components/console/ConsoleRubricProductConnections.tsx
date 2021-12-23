import * as React from 'react';
import { FILTER_SEPARATOR, ROUTE_CMS } from '../../config/common';
import {
  CONFIRM_MODAL,
  CREATE_CONNECTION_MODAL,
  PRODUCT_SEARCH_MODAL,
} from '../../config/modalVariants';
import {
  ProductVariantInterface,
  ProductVariantItemInterface,
  ProductSummaryInterface,
} from '../../db/uiInterfaces';
import {
  useAddProductToConnectionMutation,
  useCreateProductConnectionMutation,
  useDeleteProductFromConnectionMutation,
} from '../../generated/apolloComponents';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import ContentItemControls from '../button/ContentItemControls';
import FixedButtons from '../button/FixedButtons';
import WpButton from '../button/WpButton';
import Inner from '../Inner';
import WpLink from '../Link/WpLink';
import { ConfirmModalInterface } from '../Modal/ConfirmModal';
import { CreateConnectionModalInterface } from '../Modal/CreateConnectionModal';
import { ProductSearchModalInterface } from '../Modal/ProductSearchModal';
import TableRowImage from '../TableRowImage';
import WpAccordion from '../WpAccordion';
import WpTable, { WpTableColumn } from '../WpTable';

interface ProductConnectionControlsInterface {
  connection: ProductVariantInterface;
  product: ProductSummaryInterface;
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

  const excludedProductsIds: string[] = [];
  const excludedOptionsSlugs = (connection.products || []).map(({ option, productId }) => {
    excludedProductsIds.push(`${productId}`);
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
  product: ProductSummaryInterface;
  connection: ProductVariantInterface;
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

  const { products } = connection;

  const columns: WpTableColumn<ProductVariantItemInterface>[] = [
    {
      headTitle: 'Арт',
      render: ({ dataItem, rowIndex }) => {
        return (
          <WpLink
            target={'_blank'}
            testId={`product-link-${rowIndex}`}
            href={`${ROUTE_CMS}/rubrics/${dataItem.summary?.rubricId}/products/product/${dataItem.summary?._id}`}
          >
            {dataItem.summary?.itemId}
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
                `${ROUTE_CMS}/rubrics/${dataItem.summary?.rubricId}/products/product/${dataItem.summary?._id}`,
                '_blank',
              );
            }}
            deleteTitle={'Удалить товар из связи'}
            deleteHandler={() => {
              showModal<ConfirmModalInterface>({
                variant: CONFIRM_MODAL,
                props: {
                  message: `Вы уверенны, что хотите удалить ${dataItem?.summary?.snippetTitle} из связи ${connection.attribute?.name}?`,
                  testId: 'delete-product-from-connection-modal',
                  confirm: () => {
                    showLoading();
                    deleteProductFromConnectionMutation({
                      variables: {
                        input: {
                          deleteProductId: dataItem?.summary?._id,
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
    <WpAccordion
      testId={`${connection.attribute.name}-connection`}
      title={`${connection.attribute.name}`}
      isOpen
      className='mb-8'
      titleRight={<ProductConnectionControls connection={connection} product={product} />}
    >
      <div className='mt-4'>
        <WpTable<ProductVariantItemInterface>
          columns={columns}
          data={products}
          tableTestId={`${connection.attribute.name}-connection-list`}
          onRowDoubleClick={(dataItem) => {
            window.open(
              `${ROUTE_CMS}/rubrics/${dataItem.summary?.rubricId}/products/product/${dataItem.summary?._id}`,
              '_blank',
            );
          }}
          testIdKey={'product.name'}
        />
      </div>
    </WpAccordion>
  );
};

interface ConsoleRubricProductConnectionsInterface {
  product: ProductSummaryInterface;
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
        {product.variants.map((connection, connectionIndex) => {
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
