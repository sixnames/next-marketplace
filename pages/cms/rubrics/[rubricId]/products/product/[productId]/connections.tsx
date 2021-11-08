import Accordion from 'components/Accordion';
import Button from 'components/button/Button';
import FixedButtons from 'components/button/FixedButtons';
import ContentItemControls from 'components/button/ContentItemControls';
import Inner from 'components/Inner';
import Link from 'components/Link/Link';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal';
import { CreateConnectionModalInterface } from 'components/Modal/CreateConnectionModal';
import { ProductSearchModalInterface } from 'components/Modal/ProductSearchModal';
import Table, { TableColumn } from 'components/Table';
import TableRowImage from 'components/TableRowImage';
import { DEFAULT_COMPANY_SLUG, FILTER_SEPARATOR, ROUTE_CMS } from 'config/common';
import { CONFIRM_MODAL, CREATE_CONNECTION_MODAL, PRODUCT_SEARCH_MODAL } from 'config/modalVariants';
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
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import CmsLayout from 'layout/cms/CmsLayout';
import CmsProductLayout from 'layout/cms/CmsProductLayout';
import { getCmsProduct } from 'lib/productUtils';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
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

  const columns: TableColumn<ProductConnectionItemInterface>[] = [
    {
      headTitle: 'Арт',
      render: ({ dataItem, rowIndex }) => {
        return (
          <Link
            target={'_blank'}
            testId={`product-link-${rowIndex}`}
            href={`${ROUTE_CMS}/rubrics/${dataItem.product?.rubricId}/products/product/${dataItem.product?._id}`}
          >
            {dataItem.product?.itemId}
          </Link>
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
        <Table<ProductConnectionItemInterface>
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
        name: `${product.cardTitle}`,
        href: `${ROUTE_CMS}/rubrics/${rubric._id}/products/product/${product._id}`,
      },
    ],
  };

  return (
    <CmsProductLayout product={product} breadcrumbs={breadcrumbs}>
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
  const { props } = await getAppInitialData({ context });
  if (!props || !productId || !rubricId) {
    return {
      notFound: true,
    };
  }

  const payload = await getCmsProduct({
    locale: props.sessionLocale,
    productId: `${productId}`,
    companySlug: DEFAULT_COMPANY_SLUG,
  });

  if (!payload) {
    return {
      notFound: true,
    };
  }

  const { product, rubric } = payload;

  return {
    props: {
      ...props,
      product: castDbData(product),
      rubric: castDbData(rubric),
    },
  };
};

export default Product;
