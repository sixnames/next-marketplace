import { useAppContext } from 'components/context/appContext';
import { useNotificationsContext } from 'components/context/notificationsContext';
import {
  ProductSummaryInterface,
  ProductVariantInterface,
  ProductVariantItemInterface,
} from 'db/uiInterfaces';
import {
  useAddProductToVariant,
  useCreateProductVariant,
  useDeleteProductFromVariant,
} from 'hooks/mutations/useProductMutations';
import { useBasePath } from 'hooks/useBasePath';
import { alwaysString } from 'lib/arrayUtils';
import { FILTER_SEPARATOR } from 'lib/config/common';
import {
  CONFIRM_MODAL,
  CREATE_CONNECTION_MODAL,
  PRODUCT_SEARCH_MODAL,
} from 'lib/config/modalVariants';

import { useRouter } from 'next/router';
import * as React from 'react';
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

interface ProductVariantControlsInterface {
  variant: ProductVariantInterface;
  product: ProductSummaryInterface;
}

const ProductVariantControls: React.FC<ProductVariantControlsInterface> = ({
  variant,
  product,
}) => {
  const router = useRouter();
  const { showModal } = useAppContext();
  const [addProductToConnectionMutation] = useAddProductToVariant();

  const excludedProductsIds: string[] = [];
  const excludedOptionsSlugs = (variant.products || []).map(({ option, productId }) => {
    excludedProductsIds.push(`${productId}`);
    return `${variant.attribute?.slug}${FILTER_SEPARATOR}${option?.slug}`;
  });

  return (
    <ContentItemControls
      testId={`${variant.attribute?.name}-variant-product`}
      createTitle={'???????????????? ?????????? ?? ??????????'}
      createHandler={() => {
        showModal<ProductSearchModalInterface>({
          variant: PRODUCT_SEARCH_MODAL,
          props: {
            rubricSlug: product.rubricSlug,
            createTitle: '???????????????? ?????????? ?? ??????????',
            testId: 'add-product-to-variant-modal',
            excludedProductsIds,
            excludedOptionsSlugs,
            attributesIds: [`${variant.attributeId}`],
            createHandler: (addProduct) => {
              addProductToConnectionMutation({
                taskId: alwaysString(router.query.taskId),
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

export interface ProductVariantsItemInterface {
  product: ProductSummaryInterface;
  variant: ProductVariantInterface;
  variantIndex: number;
}

const ProductVariantsItem: React.FC<ProductVariantsItemInterface> = ({
  variant,
  product,
  variantIndex,
}) => {
  const router = useRouter();
  const { showErrorNotification } = useNotificationsContext();
  const { showModal } = useAppContext();
  const [deleteProductFromConnectionMutation] = useDeleteProductFromVariant();
  const basePath = useBasePath('rubricSlug');
  const { products } = variant;

  const columns: WpTableColumn<ProductVariantItemInterface>[] = [
    {
      headTitle: '??????',
      render: ({ dataItem, rowIndex }) => {
        return (
          <WpLink
            target={'_blank'}
            testId={`product-link-${rowIndex}`}
            href={`${basePath}/products/product/${dataItem._id}`}
          >
            {dataItem.summary?.itemId}
          </WpLink>
        );
      },
    },
    {
      accessor: 'summary',
      headTitle: '????????',
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
      headTitle: '????????????????',
      render: ({ cellData }) => {
        return cellData || '?????????? ???? ????????????';
      },
    },
    {
      accessor: 'option.name',
      headTitle: '????????????????',
      render: ({ cellData }) => {
        return <div>{cellData}</div>;
      },
    },
    {
      render: ({ dataItem, rowIndex }) => {
        return (
          <ContentItemControls
            testId={`${variantIndex}-${rowIndex}`}
            justifyContent={'flex-end'}
            updateTitle={'?????????????????????????? ??????????'}
            updateHandler={() => {
              window.open(`${basePath}/products/product/${dataItem._id}`, '_blank');
            }}
            deleteTitle={'?????????????? ?????????? ???? ??????????'}
            deleteHandler={() => {
              showModal<ConfirmModalInterface>({
                variant: CONFIRM_MODAL,
                props: {
                  message: `???? ????????????????, ?????? ???????????? ?????????????? ${dataItem.summary?.snippetTitle} ???? ?????????? ${variant.attribute?.name}?`,
                  testId: 'delete-product-from-variant-modal',
                  confirm: () => {
                    if (!dataItem.summary) {
                      showErrorNotification({
                        message: 'Summary not found',
                      });
                      return;
                    }
                    deleteProductFromConnectionMutation({
                      taskId: alwaysString(router.query.taskId),
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
      testId={`${variant.attribute.name}-variant`}
      title={`${variant.attribute.name}`}
      isOpen
      className='mb-8'
      titleRight={<ProductVariantControls variant={variant} product={product} />}
    >
      <div className='mt-4'>
        <WpTable<ProductVariantItemInterface>
          columns={columns}
          data={products}
          tableTestId={`${variant.attribute.name}-variant-list`}
          testIdKey={'product.name'}
          onRowDoubleClick={(dataItem) => {
            window.open(`${basePath}/products/product/${dataItem._id}`, '_blank');
          }}
        />
      </div>
    </WpAccordion>
  );
};

interface ConsoleRubricProductVariantsInterface {
  product: ProductSummaryInterface;
}

const ConsoleRubricProductVariants: React.FC<ConsoleRubricProductVariantsInterface> = ({
  product,
}) => {
  const router = useRouter();
  const { showModal } = useAppContext();
  const [createProductConnectionMutation] = useCreateProductVariant();

  return (
    <Inner testId={'product-variants-list'}>
      <div className='mb-8'>
        {product.variants.map((variant, variantIndex) => {
          return (
            <ProductVariantsItem
              key={`${variant._id}`}
              product={product}
              variant={variant}
              variantIndex={variantIndex}
            />
          );
        })}
      </div>

      <FixedButtons>
        <WpButton
          size={'small'}
          testId={`create-variant`}
          onClick={() =>
            showModal<CreateConnectionModalInterface>({
              variant: CREATE_CONNECTION_MODAL,
              props: {
                product,
                confirm: (input) => {
                  createProductConnectionMutation({
                    taskId: alwaysString(router.query.taskId),
                    ...input,
                  }).catch(console.log);
                },
              },
            })
          }
        >
          ?????????????? ??????????
        </WpButton>
      </FixedButtons>
    </Inner>
  );
};

export default ConsoleRubricProductVariants;
