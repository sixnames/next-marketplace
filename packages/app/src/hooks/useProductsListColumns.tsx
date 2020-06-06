import ContentItemControls from '../components/ContentItemControls/ContentItemControls';
import React from 'react';

export interface ProductsListItemInterface {
  id: string;
  itemId: number;
  name: string;
  price: number;
  slug: string;
}

export interface ProductColumnsInterface {
  createTitle?: string;
  updateTitle?: string;
  deleteTitle?: string;
  createHandler?: (product: ProductsListItemInterface) => void;
  updateHandler?: (product: ProductsListItemInterface) => void;
  deleteHandler?: (product: ProductsListItemInterface) => void;
}

const useProductsListColumns = ({
  createTitle,
  updateTitle,
  deleteTitle,
  createHandler,
  updateHandler,
  deleteHandler,
}: ProductColumnsInterface) => {
  return [
    {
      key: 'itemId',
      title: 'Арт.',
      render: (itemID: number) => itemID,
    },
    /*{
      key: 'images',
      title: 'Изображение',
      render: (images: ProductImagesInterface[]) => {
        const mainImage = images[0].thumbSmall;
        return <TableRowImage path={mainImage} alt={'Выбрать товар'} title={''} />;
      },
    },*/
    {
      key: 'name',
      title: 'Название',
      render: (name: string) => name,
    },
    {
      key: 'price',
      title: 'Цена',
      render: (price: number) => price,
    },
    {
      key: '',
      title: '',
      render: (_: any, product: ProductsListItemInterface) => {
        return (
          <ContentItemControls
            justifyContent={'flex-end'}
            testId={product.name}
            createTitle={createTitle}
            updateTitle={updateTitle}
            deleteTitle={deleteTitle}
            createHandler={createHandler ? () => createHandler(product) : undefined}
            updateHandler={updateHandler ? () => updateHandler(product) : undefined}
            deleteHandler={deleteHandler ? () => deleteHandler(product) : undefined}
          />
        );
      },
    },
  ];
};

export default useProductsListColumns;
