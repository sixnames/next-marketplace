import React from 'react';
import DataLayout from '../../components/DataLayout/DataLayout';
import CompaniesFilter from './CompaniesFilter';
import CompaniesContent from './CompaniesContent';
import { useAppContext } from '../../context/appContext';
import { CreateNewProductModalInterface } from '../../components/Modal/CreateNewProductModal/CreateNewProductModal';
import useDataLayoutMethods from '../../hooks/useDataLayoutMethods';
import { CREATE_NEW_PRODUCT_MODAL } from '../../config/modals';
import { GET_ALL_PRODUCTS_QUERY } from '../../graphql/complex/rubricsQueries';

const CompaniesRoute: React.FC = () => {
  const { showModal } = useAppContext();
  const { contentFilters } = useDataLayoutMethods();

  function createCompanyModalHandler() {
    showModal<CreateNewProductModalInterface>({
      type: CREATE_NEW_PRODUCT_MODAL,
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
      title={'Копании'}
      filterContent={<CompaniesFilter />}
      filterResult={() => <CompaniesContent />}
      contentControlsConfig={{
        createTitle: 'Создать компанию',
        createHandler: createCompanyModalHandler,
        testId: 'company',
      }}
    />
  );
};

export default CompaniesRoute;
