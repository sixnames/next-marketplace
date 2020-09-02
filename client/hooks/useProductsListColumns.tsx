import ContentItemControls from '../components/ContentItemControls/ContentItemControls';
import React from 'react';
import TableRowImage from '../components/Table/TableRowImage';
import { LanguageType } from '../generated/apolloComponents';

export interface ProductsListItemInterface {
  id: string;
  itemId: number;
  name: LanguageType[];
  nameString: string;
  price: number;
  slug: string;
  mainImage: string;
  active: boolean;
  rubrics: string[];
}

export interface ProductColumnsInterface {
  createTitle?: string;
  updateTitle?: string;
  deleteTitle?: string;
  createHandler?: (product: ProductsListItemInterface) => void;
  updateHandler?: (product: ProductsListItemInterface) => void;
  deleteHandler?: (product: ProductsListItemInterface) => void;
  disabled?: boolean;
  isCreateDisabled?: (product: ProductsListItemInterface) => boolean;
  isUpdateDisabled?: (product: ProductsListItemInterface) => boolean;
  isDeleteDisabled?: (product: ProductsListItemInterface) => boolean;
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
}: ProductColumnsInterface) => {
  return [
    {
      key: 'itemId',
      title: 'Арт.',
      render: (itemID: string) => itemID,
    },
    {
      key: 'mainImage',
      title: 'Фото',
      render: (mainImage: string, product: ProductsListItemInterface) => {
        return (
          <TableRowImage url={mainImage} alt={product.nameString} title={product.nameString} />
        );
      },
    },
    {
      key: 'nameString',
      title: 'Название',
      render: (nameString: string) => nameString,
    },
    {
      key: 'price',
      title: 'Цена',
      render: (price: number) => price,
    },
    {
      key: 'active',
      title: 'Активен',
      render: (active: boolean) => (active ? 'Да' : 'Нет'),
    },
    {
      key: '',
      title: '',
      render: (_: any, product: ProductsListItemInterface) => {
        return (
          <ContentItemControls
            justifyContent={'flex-end'}
            testId={product.nameString}
            createTitle={createTitle}
            updateTitle={updateTitle}
            deleteTitle={deleteTitle}
            createHandler={createHandler ? () => createHandler(product) : undefined}
            updateHandler={updateHandler ? () => updateHandler(product) : undefined}
            deleteHandler={deleteHandler ? () => deleteHandler(product) : undefined}
            disabled={disabled}
            isDeleteDisabled={isDeleteDisabled ? isDeleteDisabled(product) : undefined}
            isCreateDisabled={isCreateDisabled ? isCreateDisabled(product) : undefined}
            isUpdateDisabled={isUpdateDisabled ? isUpdateDisabled(product) : undefined}
          />
        );
      },
    },
  ];
};

export default useProductsListColumns;
