import React from 'react';
import DataLayout from '../../components/DataLayout/DataLayout';
import CompaniesFilter from './CompaniesFilter';
import CompaniesContent from './CompaniesContent';
import { ROUTE_CMS } from '../../config';
import { useRouter } from 'next/router';

const CompaniesRoute: React.FC = () => {
  const router = useRouter();

  return (
    <DataLayout
      title={'Копании'}
      filterContent={<CompaniesFilter />}
      filterResult={() => <CompaniesContent />}
      contentControlsConfig={{
        createTitle: 'Создать компанию',
        createHandler: () => router.push(`${ROUTE_CMS}/companies/create`),
        testId: 'company',
      }}
    />
  );
};

export default CompaniesRoute;
