import Link from 'components/Link/Link';
import * as React from 'react';
import ContentItemControls, {
  ContentItemControlsInterface,
} from '../components/ContentItemControls/ContentItemControls';
import TableRowImage from 'components/TableRowImage';
import { RubricProductFragment } from 'generated/apolloComponents';
import { TableColumn } from 'components/Table';
import { ROUTE_CMS } from 'config/common';

export type ProductColumnsItemHandler = (product: RubricProductFragment) => void;
export type ProductColumnsHandlerPermission = (product: RubricProductFragment) => boolean;

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
}: ProductColumnsInterface): TableColumn<RubricProductFragment>[] => {
  return React.useMemo(() => {
    return [
      {
        accessor: 'itemId',
        headTitle: 'Арт.',
        render: ({ cellData, dataItem }) => (
          <Link
            target={'_blank'}
            href={`${ROUTE_CMS}/rubrics/${dataItem.rubricId}/products/product/${dataItem._id}`}
          >
            {cellData}
          </Link>
        ),
      },
      {
        accessor: 'mainImage',
        headTitle: 'Фото',
        render: ({ cellData, dataItem }) => {
          return <TableRowImage src={cellData} alt={dataItem.name} title={dataItem.name} />;
        },
      },
      {
        accessor: 'name',
        headTitle: 'Название',
        render: ({ cellData }) => cellData,
      },
      {
        accessor: 'active',
        headTitle: 'Активен',
        render: ({ cellData }) => (cellData ? 'Да' : 'Нет'),
      },
      {
        render: ({ dataItem }) => {
          return (
            <div className='flex justify-end'>
              <ContentItemControls
                testId={dataItem.name}
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
