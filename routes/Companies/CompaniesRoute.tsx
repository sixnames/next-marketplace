import * as React from 'react';
import DataLayout from '../../components/DataLayout/DataLayout';
import CompaniesFilter from './CompaniesFilter';
import CompaniesContent from './CompaniesContent';
import { useRouter } from 'next/router';
import { ROUTE_CMS } from 'config/common';

const CompaniesRoute: React.FC = () => {
  const router = useRouter();

  return (
    <DataLayout
      isFilterVisible
      title={'Копании'}
      filterContent={<CompaniesFilter />}
      filterResult={() => <CompaniesContent />}
      contentControlsConfig={{
        createTitle: 'Создать компанию',
        createHandler: () => router.push(`/${router.query.city}${ROUTE_CMS}/companies/create`),
        testId: 'company',
      }}
    />
  );
};

export default CompaniesRoute;
