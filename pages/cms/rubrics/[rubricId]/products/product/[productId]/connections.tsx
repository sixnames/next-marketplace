import Accordion from 'components/Accordion';
import Button from 'components/Button';
import FixedButtons from 'components/FixedButtons';
import ContentItemControls from 'components/ContentItemControls/ContentItemControls';
import Inner from 'components/Inner';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal';
import { CreateConnectionModalInterface } from 'components/Modal/CreateConnectionModal';
import { ProductSearchModalInterface } from 'components/Modal/ProductSearchModal';
import Table, { TableColumn } from 'components/Table';
import TableRowImage from 'components/TableRowImage';
import { CATALOGUE_OPTION_SEPARATOR, ROUTE_CMS, SORT_DESC } from 'config/common';
import { CONFIRM_MODAL, CREATE_CONNECTION_MODAL, PRODUCT_SEARCH_MODAL } from 'config/modalVariants';
import {
  COL_ATTRIBUTES,
  COL_OPTIONS,
  COL_PRODUCT_ATTRIBUTES,
  COL_PRODUCT_CONNECTION_ITEMS,
  COL_PRODUCT_CONNECTIONS,
  COL_PRODUCTS,
  COL_RUBRICS,
} from 'db/collectionNames';
import { ProductConnectionItemModel, ProductModel, RubricModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import {
  ProductConnectionInterface,
  ProductConnectionItemInterface,
  ProductInterface,
  RubricInterface,
} from 'db/uiInterfaces';
import {
  useAddProductToConnectionMutation,
  useCreateProductConnectionMutation,
  useDeleteProductFromConnectionMutation,
} from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import { AppContentWrapperBreadCrumbs } from 'layout/AppLayout/AppContentWrapper';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import CmsProductLayout from 'layout/CmsLayout/CmsProductLayout';
import { getFieldStringLocale } from 'lib/i18n';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
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
    return `${connection.attribute?.slug}${CATALOGUE_OPTION_SEPARATOR}${option?.slug}`;
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
}

const ProductConnectionsItem: React.FC<ProductConnectionsItemInterface> = ({
  connection,
  product,
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
      accessor: 'option.name',
      headTitle: 'Значение',
      render: ({ cellData }) => {
        return <div>{cellData}</div>;
      },
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

  return (
    <Accordion
      testId={`${connection.attribute?.name}-connection`}
      title={`${connection.attribute?.name}`}
      isOpen
      className='mb-8'
      titleRight={<ProductConnectionControls connection={connection} product={product} />}
    >
      <div className='mt-4'>
        <Table<ProductConnectionItemModel>
          columns={columns}
          data={connectionProducts}
          tableTestId={`${connection.attribute?.name}-connection-list`}
          testIdKey={'product.name'}
        />
      </div>
    </Accordion>
  );
};

interface ProductConnectionsPropsInterface {
  product: ProductInterface;
  rubric: RubricInterface;
}

const ProductConnections: React.FC<ProductConnectionsPropsInterface> = ({ product, rubric }) => {
  const { onCompleteCallback, onErrorCallback, showLoading, showModal } = useMutationCallbacks({
    withModal: true,
    reload: true,
  });
  const [createProductConnectionMutation] = useCreateProductConnectionMutation({
    onError: onErrorCallback,
    onCompleted: (data) => onCompleteCallback(data.createProductConnection),
  });

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Связи',
    config: [
      {
        name: 'Рубрикатор',
        href: `${ROUTE_CMS}/rubrics`,
      },
      {
        name: `${rubric.name}`,
        href: `${ROUTE_CMS}/rubrics/${rubric._id}`,
      },
      {
        name: `Товары`,
        href: `${ROUTE_CMS}/rubrics/${rubric._id}/products/${rubric._id}`,
      },
      {
        name: product.originalName,
        href: `${ROUTE_CMS}/rubrics/${rubric._id}/products/product/${product._id}`,
      },
    ],
  };

  return (
    <CmsProductLayout product={product} breadcrumbs={breadcrumbs}>
      <Inner testId={'product-connections-list'}>
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
        </FixedButtons>
      </Inner>
    </CmsProductLayout>
  );
};

interface ProductPageInterface extends PagePropsInterface, ProductConnectionsPropsInterface {}

const Product: NextPage<ProductPageInterface> = ({ pageUrls, product, rubric }) => {
  return (
    <CmsLayout pageUrls={pageUrls}>
      <ProductConnections product={product} rubric={rubric} />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<ProductPageInterface>> => {
  const { query } = context;
  const { productId, rubricId } = query;
  const { db } = await getDatabase();
  const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
  const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
  const { props } = await getAppInitialData({ context });
  if (!props || !productId || !rubricId) {
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
              $lookup: {
                from: COL_ATTRIBUTES,
                as: 'attribute',
                let: { attributeId: '$attributeId' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ['$$attributeId', '$_id'],
                      },
                    },
                  },
                ],
              },
            },
            {
              $addFields: {
                attribute: {
                  $arrayElemAt: ['$attribute', 0],
                },
              },
            },
            {
              $lookup: {
                from: COL_PRODUCT_CONNECTION_ITEMS,
                as: 'connectionProducts',
                let: { connectionId: '$_id' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ['$$connectionId', '$connectionId'],
                      },
                    },
                  },
                  {
                    $sort: {
                      _id: SORT_DESC,
                    },
                  },
                  {
                    $lookup: {
                      from: COL_OPTIONS,
                      as: 'option',
                      let: { optionId: '$optionId' },
                      pipeline: [
                        {
                          $match: {
                            $expr: {
                              $eq: ['$$optionId', '$_id'],
                            },
                          },
                        },
                      ],
                    },
                  },
                  {
                    $lookup: {
                      from: COL_PRODUCTS,
                      as: 'product',
                      let: { productId: '$productId' },
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
                      product: {
                        $arrayElemAt: ['$product', 0],
                      },
                      option: {
                        $arrayElemAt: ['$option', 0],
                      },
                    },
                  },
                ],
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

  const initialRubric = await rubricsCollection.findOne({
    _id: new ObjectId(`${rubricId}`),
  });

  if (!product || !initialRubric) {
    return {
      notFound: true,
    };
  }

  // connections
  const connections: ProductConnectionInterface[] = [];
  for await (const productConnection of product.connections || []) {
    const connectionProducts: ProductConnectionItemInterface[] = [];
    for await (const connectionProduct of productConnection.connectionProducts || []) {
      connectionProducts.push({
        ...connectionProduct,
        option: connectionProduct.option
          ? {
              ...connectionProduct.option,
              name: getFieldStringLocale(connectionProduct.option?.nameI18n, props.sessionLocale),
            }
          : null,
      });
    }

    connections.push({
      ...productConnection,
      attribute: productConnection.attribute
        ? {
            ...productConnection.attribute,
            name: getFieldStringLocale(productConnection.attribute?.nameI18n, props.sessionLocale),
          }
        : null,
      connectionProducts,
    });
  }

  const rawProduct: ProductInterface = {
    ...product,
    connections,
    attributes: (product.attributes || []).map((productAttribute) => {
      return {
        ...productAttribute,
        name: getFieldStringLocale(productAttribute.nameI18n, props.sessionLocale),
      };
    }),
  };

  const rubric: RubricInterface = {
    ...initialRubric,
    name: getFieldStringLocale(initialRubric.nameI18n, props.sessionLocale),
  };

  return {
    props: {
      ...props,
      product: castDbData(rawProduct),
      rubric: castDbData(rubric),
    },
  };
};

export default Product;
