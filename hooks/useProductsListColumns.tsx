import * as React from 'react';
import ContentItemControls, {
  ContentItemControlsInterface,
} from '../components/button/ContentItemControls';
import WpLink from '../components/Link/WpLink';
import TableRowImage from '../components/TableRowImage';
import { WpTableColumn } from '../components/WpTable';
import { ROUTE_CMS } from '../config/common';
import { ProductFacetInterface } from '../db/uiInterfaces';

export type ProductColumnsItemHandler = (product: ProductFacetInterface) => void;
export type ProductColumnsHandlerPermission = (product: ProductFacetInterface) => boolean;

export interface ProductColumnsInterface
  extends Omit<
    ContentItemControlsInterface,
    | 'isCreateDisabled'
    | 'isUpdateDisabled'
    | 'isDeleteDisabled'
    | 'createHandler'
    | 'updateHandler'
    | 'deleteHandler'
  > {
  createHandler?: ProductColumnsItemHandler;
  updateHandler?: ProductColumnsItemHandler;
  deleteHandler?: ProductColumnsItemHandler;
  isCreateDisabled?: ProductColumnsHandlerPermission;
  isUpdateDisabled?: ProductColumnsHandlerPermission;
  isDeleteDisabled?: ProductColumnsHandlerPermission;
}

const useProductsListColumns = ({
  createTitle,
  updateTitle,
  deleteTitle,
  createHandler,
  updateHandler,
  deleteHandler,
  disabled,
  isCreateDisabled,
  isUpdateDisabled,
  isDeleteDisabled,
}: ProductColumnsInterface): WpTableColumn<ProductFacetInterface>[] => {
  return React.useMemo(() => {
    return [
      {
        accessor: 'itemId',
        headTitle: 'Арт.',
        render: ({ cellData, dataItem }) => (
          <WpLink
            target={'_blank'}
            href={`${ROUTE_CMS}/rubrics/${dataItem.rubricId}/products/product/${dataItem._id}`}
          >
            {cellData}
          </WpLink>
        ),
      },
      {
        accessor: 'mainImage',
        headTitle: 'Фото',
        render: ({ cellData, dataItem }) => {
          return (
            <TableRowImage
              src={cellData}
              alt={dataItem.originalName}
              title={dataItem.originalName}
            />
          );
        },
      },
      {
        accessor: 'snippetTitle',
        headTitle: 'Название',
        render: ({ cellData }) => cellData,
      },
      {
        render: ({ dataItem }) => {
          return (
            <div className='flex justify-end'>
              <ContentItemControls
                testId={dataItem.originalName}
                createTitle={createTitle}
                updateTitle={updateTitle}
                deleteTitle={deleteTitle}
                createHandler={createHandler ? () => createHandler(dataItem) : undefined}
                updateHandler={updateHandler ? () => updateHandler(dataItem) : undefined}
                deleteHandler={deleteHandler ? () => deleteHandler(dataItem) : undefined}
                disabled={disabled}
                isDeleteDisabled={isDeleteDisabled ? isDeleteDisabled(dataItem) : undefined}
                isCreateDisabled={isCreateDisabled ? isCreateDisabled(dataItem) : undefined}
                isUpdateDisabled={isUpdateDisabled ? isUpdateDisabled(dataItem) : undefined}
              />
            </div>
          );
        },
      },
    ];
  }, [
    createHandler,
    createTitle,
    deleteHandler,
    deleteTitle,
    disabled,
    isCreateDisabled,
    isDeleteDisabled,
    isUpdateDisabled,
    updateHandler,
    updateTitle,
  ]);
};

export default useProductsListColumns;
