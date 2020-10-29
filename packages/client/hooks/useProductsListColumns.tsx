import ContentItemControls, {
  ContentItemControlsInterface,
} from '../components/ContentItemControls/ContentItemControls';
import React from 'react';
import TableRowImage from '../components/Table/TableRowImage';
import { RubricProductFragment } from '../generated/apolloComponents';
import { TableColumn } from '../components/Table/Table';

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
  return [
    {
      accessor: 'itemId',
      headTitle: 'Арт.',
      render: ({ cellData }) => cellData,
    },
    {
      accessor: 'mainImage',
      headTitle: 'Фото',
      render: ({ cellData, dataItem }) => {
        return (
          <TableRowImage url={cellData} alt={dataItem.nameString} title={dataItem.nameString} />
        );
      },
    },
    {
      accessor: 'nameString',
      headTitle: 'Название',
      render: ({ cellData }) => cellData,
    },
    {
      accessor: 'price',
      headTitle: 'Цена',
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
          <ContentItemControls
            justifyContent={'flex-end'}
            testId={dataItem.nameString}
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
        );
      },
    },
  ];
};

export default useProductsListColumns;
