import React from 'react';
import DataLayout from '../../components/DataLayout/DataLayout';
import ProductsFilter from './ProductsFilter';
import ProductsContent from './ProductsContent';
import { useAppContext } from '../../context/appContext';
import { CreateNewProductModalInterface } from '../../components/Modal/CreateNewProductModal/CreateNewProductModal';
import useDataLayoutMethods from '../../hooks/useDataLayoutMethods';
import { CREATE_NEW_PRODUCT_MODAL } from '../../config/modals';
import { GET_ALL_PRODUCTS_QUERY } from '../../graphql/complex/rubricsQueries';

const ProductsRoute: React.FC = () => {
  const { showModal } = useAppContext();
  const { contentFilters } = useDataLayoutMethods();

  function createProductModalHandler() {
    showModal<CreateNewProductModalInterface>({
      variant: CREATE_NEW_PRODUCT_MODAL,
      props: {
        refetchQueries: [
          {
            query: GET_ALL_PRODUCTS_QUERY,
            variables: {
              input: contentFilters,
            },
          },
        ],
      },
    });
  }

  return (
    <DataLayout
      title={'Товары'}
      filterContent={<ProductsFilter />}
      filterResult={() => <ProductsContent />}
      contentControlsConfig={{
        createTitle: 'Создать товар',
        createHandler: createProductModalHandler,
        testId: 'product',
      }}
    />
  );
};

export default ProductsRoute;
