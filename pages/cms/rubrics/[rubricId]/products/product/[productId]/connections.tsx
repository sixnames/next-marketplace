import Accordion from 'components/Accordion/Accordion';
import Button from 'components/Buttons/Button';
import FixedButtons from 'components/Buttons/FixedButtons';
import ContentItemControls from 'components/ContentItemControls/ContentItemControls';
import Inner from 'components/Inner/Inner';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal/ConfirmModal';
import { CreateConnectionModalInterface } from 'components/Modal/CreateConnectionModal/CreateConnectionModal';
import { ProductSearchModalInterface } from 'components/Modal/ProductSearchModal/ProductSearchModal';
import Table, { TableColumn } from 'components/Table/Table';
import TableRowImage from 'components/Table/TableRowImage';
import { CONFIRM_MODAL, CREATE_CONNECTION_MODAL, PRODUCT_SEARCH_MODAL } from 'config/modals';
import { COL_PRODUCT_ATTRIBUTES, COL_PRODUCT_CONNECTIONS, COL_PRODUCTS } from 'db/collectionNames';
import { ProductConnectionItemModel, ProductModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
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
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import CmsProductLayout from 'layout/CmsLayout/CmsProductLayout';
import { getFieldStringLocale } from 'lib/i18n';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { useRouter } from 'next/router';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';

interface ProductConnectionControlsInterface {
  connection: ProductConnectionInterface;
  product: ProductInterface;
}

const ProductConnectionControls: React.FC<ProductConnectionControlsInterface> = ({
  connection,
  product,
}) => {
  const router = useRouter();
  const {
    showModal,
    showLoading,
    onCompleteCallback,
    onErrorCallback,
    hideLoading,
    showErrorNotification,
  } = useMutationCallbacks({
    withModal: true,
  });
  const [addProductToConnectionMutation] = useAddProductToConnectionMutation({
    onError: onErrorCallback,
    onCompleted: (data) => {
      if (data.addProductToConnection.success) {
        onCompleteCallback(data.addProductToConnection);
        router.reload();
      } else {
        hideLoading();
        showErrorNotification({ title: data.addProductToConnection.message });
      }
    },
  });

  const excludedProductsIds = connection.connectionProducts.map(({ productId }) => `${productId}`);

  return (
    <ContentItemControls
      testId={`${connection.attributeName}-connection`}
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
}

const ProductConnectionsItem: React.FC<ProductConnectionsItemInterface> = ({
  connection,
  product,
}) => {
  const router = useRouter();
  const {
    showModal,
    showLoading,
    onCompleteCallback,
    onErrorCallback,
    hideLoading,
    showErrorNotification,
  } = useMutationCallbacks({
    withModal: true,
  });
  const [deleteProductFromConnectionMutation] = useDeleteProductFromConnectionMutation({
    onError: onErrorCallback,
    onCompleted: (data) => {
      if (data.deleteProductFromConnection.success) {
        onCompleteCallback(data.deleteProductFromConnection);
        router.reload();
      } else {
        hideLoading();
        showErrorNotification({ title: data.deleteProductFromConnection.message });
      }
    },
  });

  const { connectionProducts } = connection;

  const columns: TableColumn<ProductConnectionItemInterface>[] = [
    {
      accessor: 'product.itemId',
      headTitle: 'Арт.',
      render: ({ cellData }) => cellData,
    },
    {
      accessor: 'product',
      headTitle: 'Фото',
      render: ({ cellData }) => {
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
      accessor: 'product.originalName',
      headTitle: 'Название',
      render: ({ cellData }) => cellData,
    },
    {
      accessor: 'product.active',
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
            testId={`${dataItem?.product?.originalName}`}
            deleteTitle={'Удалить товар из связи'}
            justifyContent={'flex-end'}
            deleteHandler={() => {
              showModal<ConfirmModalInterface>({
                variant: CONFIRM_MODAL,
                props: {
                  message: `Вы уверенны, что хотите удалить ${dataItem?.product?.originalName} из связи ${connection.attributeName}?`,
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

  return (
    <Accordion
      testId={`${connection.attributeName}-connection`}
      title={`${connection.attributeName}`}
      isOpen
      className='mb-8'
      titleRight={<ProductConnectionControls connection={connection} product={product} />}
    >
      <Table<ProductConnectionItemModel>
        columns={columns}
        data={connectionProducts}
        tableTestId={`${connection.attributeName}-connection-list`}
        testIdKey={'product.name'}
      />
    </Accordion>
  );
};

interface ProductConnectionsPropsInterface {
  product: ProductInterface;
}

const ProductConnections: React.FC<ProductConnectionsPropsInterface> = ({ product }) => {
  const router = useRouter();
  const {
    onCompleteCallback,
    onErrorCallback,
    showLoading,
    showModal,
    hideLoading,
    showErrorNotification,
  } = useMutationCallbacks({
    withModal: true,
  });
  const [createProductConnectionMutation] = useCreateProductConnectionMutation({
    onError: onErrorCallback,
    onCompleted: (data) => {
      if (data.createProductConnection.success) {
        onCompleteCallback(data.createProductConnection);
        router.reload();
      } else {
        hideLoading();
        showErrorNotification({ title: data.createProductConnection.message });
      }
    },
  });

  return (
    <CmsProductLayout product={product}>
      <Inner>
        <div className='mb-8'>
          {(product.connections || []).map((connection) => {
            return (
              <ProductConnectionsItem
                key={`${connection._id}`}
                product={product}
                connection={connection}
              />
            );
          })}
        </div>

        <FixedButtons>
          <Button
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
        </FixedButtons>
      </Inner>
    </CmsProductLayout>
  );
};

interface ProductPageInterface extends PagePropsInterface, ProductConnectionsPropsInterface {}

const Product: NextPage<ProductPageInterface> = ({ pageUrls, product }) => {
  return (
    <CmsLayout pageUrls={pageUrls}>
      <ProductConnections product={product} />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<ProductPageInterface>> => {
  const { query } = context;
  const { productId } = query;
  const db = await getDatabase();
  const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
  const { props } = await getAppInitialData({ context, isCms: true });
  if (!props || !productId) {
    return {
      notFound: true,
    };
  }

  const productAggregation = await productsCollection
    .aggregate<ProductInterface>([
      {
        $match: {
          _id: new ObjectId(`${productId}`),
        },
      },
      {
        $lookup: {
          from: COL_PRODUCT_CONNECTIONS,
          as: 'connections',
          let: { productId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ['$$productId', '$productsIds'],
                },
              },
            },
            {
              $unwind: '$connectionProducts',
            },
            {
              $lookup: {
                from: COL_PRODUCTS,
                as: 'connectionProducts.product',
                let: { productId: '$connectionProducts.productId' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ['$$productId', '$_id'],
                      },
                    },
                  },
                ],
              },
            },
            {
              $addFields: {
                'connectionProducts.product': {
                  $arrayElemAt: ['$connectionProducts.product', 0],
                },
              },
            },
            {
              $group: {
                _id: '$_id',
                attributeId: { $first: '$attributeId' },
                attributeSlug: { $first: '$attributeSlug' },
                attributeNameI18n: { $first: '$attributeNameI18n' },
                productsIds: { $first: '$productsIds' },
                connectionProducts: {
                  $addToSet: '$connectionProducts',
                },
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: COL_PRODUCT_ATTRIBUTES,
          as: 'attributes',
          let: { productId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$$productId', '$productId'],
                },
              },
            },
          ],
        },
      },
    ])
    .toArray();
  const product = productAggregation[0];
  if (!product) {
    return {
      notFound: true,
    };
  }

  // connections
  const connections: ProductConnectionInterface[] = [];
  for await (const productConnection of product.connections || []) {
    const connectionProducts: ProductConnectionItemInterface[] = [];
    for await (const connectionProduct of productConnection.connectionProducts) {
      connectionProducts.push({
        ...connectionProduct,
        optionName: getFieldStringLocale(connectionProduct.optionNameI18n, props.sessionLocale),
      });
    }

    connections.push({
      ...productConnection,
      attributeName: getFieldStringLocale(productConnection.attributeNameI18n, props.sessionLocale),
      connectionProducts,
    });
  }

  const rawProduct: ProductInterface = {
    ...product,
    connections,
    attributes: (product.attributes || []).map((attribute) => {
      return {
        ...attribute,
        attributeName: getFieldStringLocale(attribute.attributeNameI18n, props.sessionLocale),
      };
    }),
  };

  return {
    props: {
      ...props,
      product: castDbData(rawProduct),
    },
  };
};

export default Product;
