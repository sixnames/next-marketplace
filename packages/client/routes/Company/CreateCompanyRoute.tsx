import React from 'react';
import DataLayout from '../../components/DataLayout/DataLayout';
import CreateCompanyContent from './CreateCompanyContent';

const CreateCompanyRoute: React.FC = () => {
  return <DataLayout title={'Создание компании'} filterResult={() => <CreateCompanyContent />} />;
};

export default CreateCompanyRoute;
