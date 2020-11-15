import React from 'react';
import DataLayout from '../../components/DataLayout/DataLayout';
import CompaniesFilter from './CompaniesFilter';
import CompaniesContent from './CompaniesContent';
import { useAppContext } from '../../context/appContext';
import useDataLayoutMethods from '../../hooks/useDataLayoutMethods';
import { CREATE_NEW_COMPANY_MODAL } from '../../config/modals';
import { CreateNewCompanyModalInterface } from '../../components/Modal/CreateNewCompanyModal/CreateNewCompanyModal';
import { COMPANIES_LIST_QUERY } from '../../graphql/query/companiesQueries';

const CompaniesRoute: React.FC = () => {
  const { showModal } = useAppContext();
  const { contentFilters } = useDataLayoutMethods();

  function createCompanyModalHandler() {
    showModal<CreateNewCompanyModalInterface>({
      type: CREATE_NEW_COMPANY_MODAL,
      props: {
        refetchQueries: [
          {
            query: COMPANIES_LIST_QUERY,
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
