import * as React from 'react';
import { FILTER_SEPARATOR } from '../../config/common';
import {
  CONFIRM_MODAL,
  CREATE_CONNECTION_MODAL,
  PRODUCT_SEARCH_MODAL,
} from '../../config/modalVariants';
import { useAppContext } from '../../context/appContext';
import { useNotificationsContext } from '../../context/notificationsContext';
import {
  ProductVariantInterface,
  ProductVariantItemInterface,
  ProductSummaryInterface,
} from '../../db/uiInterfaces';
import {
  useAddProductToVariant,
  useCreateProductVariant,
  useDeleteProductFromVariant,
} from '../../hooks/mutations/useProductMutations';
import { getCmsLinks } from '../../lib/linkUtils';
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
  variant: ProductVariantInterface;
  product: ProductSummaryInterface;
}

const ProductConnectionControls: React.FC<ProductConnectionControlsInterface> = ({
  variant,
  product,
}) => {
  const { showModal } = useAppContext();
  const [addProductToConnectionMutation] = useAddProductToVariant();

  const excludedProductsIds: string[] = [];
  const excludedOptionsSlugs = (variant.products || []).map(({ option, productId }) => {
    excludedProductsIds.push(`${productId}`);
    return `${variant.attribute?.slug}${FILTER_SEPARATOR}${option?.slug}`;
  });

  return (
    <ContentItemControls
      testId={`${variant.attribute?.name}-connection-product`}
      createTitle={'Добавить товар к связи'}
      createHandler={() => {
        showModal<ProductSearchModalInterface>({
          variant: PRODUCT_SEARCH_MODAL,
          props: {
            rubricSlug: product.rubricSlug,
            createTitle: 'Добавить товар в связь',
            testId: 'add-product-to-connection-modal',
            excludedProductsIds,
            excludedOptionsSlugs,
            attributesIds: [`${variant.attributeId}`],
            createHandler: (addProduct) => {
              addProductToConnectionMutation({
                addProductId: `${addProduct._id}`,
                variantId: `${variant._id}`,
                productId: `${product._id}`,
              }).catch(console.log);
            },
          },
        });
      }}
    />
  );
};

export interface ProductConnectionsItemInterface {
  product: ProductSummaryInterface;
  variant: ProductVariantInterface;
  connectionIndex: number;
}

const ProductConnectionsItem: React.FC<ProductConnectionsItemInterface> = ({
  variant,
  product,
  connectionIndex,
}) => {
  const { showErrorNotification } = useNotificationsContext();
  const { showModal } = useAppContext();
  const [deleteProductFromConnectionMutation] = useDeleteProductFromVariant();

  const { products } = variant;

  const columns: WpTableColumn<ProductVariantItemInterface>[] = [
    {
      headTitle: 'Арт',
      render: ({ dataItem, rowIndex }) => {
        const links = getCmsLinks({
          rubricSlug: dataItem.summary?.rubricSlug,
          productId: dataItem.summary?._id,
        });
        return (
          <WpLink
            target={'_blank'}
            testId={`product-link-${rowIndex}`}
            href={links.rubrics.product.root}
          >
            {dataItem.summary?.itemId}
          </WpLink>
        );
      },
    },
    {
      accessor: 'summary',
      headTitle: 'Фото',
      render: ({ cellData }) => {
        if (!cellData) {
          return null;
        }
        return (
          <TableRowImage
            src={cellData.mainImage}
            alt={cellData.snippetTitle}
            title={cellData.snippetTitle}
          />
        );
      },
    },
    {
      accessor: 'summary.snippetTitle',
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
              const links = getCmsLinks({
                rubricSlug: dataItem.summary?.rubricSlug,
                productId: dataItem.summary?._id,
              });
              window.open(links.rubrics.product.root, '_blank');
            }}
            deleteTitle={'Удалить товар из связи'}
            deleteHandler={() => {
              showModal<ConfirmModalInterface>({
                variant: CONFIRM_MODAL,
                props: {
                  message: `Вы уверенны, что хотите удалить ${dataItem.summary?.snippetTitle} из связи ${variant.attribute?.name}?`,
                  testId: 'delete-product-from-connection-modal',
                  confirm: () => {
                    if (!dataItem.summary) {
                      showErrorNotification({
                        message: 'Summary not found',
                      });
                      return;
                    }
                    deleteProductFromConnectionMutation({
                      deleteProductId: `${dataItem.summary._id}`,
                      variantId: `${variant._id}`,
                      productId: `${product._id}`,
                    }).catch(console.log);
                  },
                },
              });
            }}
          />
        );
      },
    },
  ];

  if (!variant.attribute) {
    return null;
  }

  return (
    <WpAccordion
      testId={`${variant.attribute.name}-connection`}
      title={`${variant.attribute.name}`}
      isOpen
      className='mb-8'
      titleRight={<ProductConnectionControls variant={variant} product={product} />}
    >
      <div className='mt-4'>
        <WpTable<ProductVariantItemInterface>
          columns={columns}
          data={products}
          tableTestId={`${variant.attribute.name}-connection-list`}
          testIdKey={'product.name'}
          onRowDoubleClick={(dataItem) => {
            const links = getCmsLinks({
              rubricSlug: dataItem.summary?.rubricSlug,
              productId: dataItem.summary?._id,
            });
            window.open(links.rubrics.product.root, '_blank');
          }}
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
  const { showModal } = useAppContext();
  const [createProductConnectionMutation] = useCreateProductVariant();

  return (
    <Inner testId={'product-connections-list'}>
      <div className='mb-8'>
        {product.variants.map((connection, connectionIndex) => {
          return (
            <ProductConnectionsItem
              key={`${connection._id}`}
              product={product}
              variant={connection}
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
                  createProductConnectionMutation(input).catch(console.log);
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
