import * as React from 'react';
import ContentItemControls, {
  ContentItemControlsInterface,
} from '../components/ContentItemControls/ContentItemControls';
import TableRowImage from '../components/Table/TableRowImage';
import { RubricProductFragment } from 'generated/apolloComponents';
import { TableColumn } from 'components/Table/Table';
import Link from 'next/link';
import { ROUTE_CMS } from 'config/common';

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
  createHandler?: (product: RubricProductFragment) => void;
  updateHandler?: (product: RubricProductFragment) => void;
  deleteHandler?: (product: RubricProductFragment) => void;
  isCreateDisabled?: (product: RubricProductFragment) => boolean;
  isUpdateDisabled?: (product: RubricProductFragment) => boolean;
  isDeleteDisabled?: (product: RubricProductFragment) => boolean;
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
          <Link href={`${ROUTE_CMS}/products/${dataItem._id}`}>
            <a>{cellData}</a>
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
