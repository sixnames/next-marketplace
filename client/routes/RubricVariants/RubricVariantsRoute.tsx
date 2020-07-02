import React from 'react';
import DataLayout from '../../components/DataLayout/DataLayout';
import RubricVariantsContent from './RubricVariantsContent';

const RubricVariantsRoute: React.FC = () => {
  return <DataLayout title={'Типы рубрик'} filterResult={() => <RubricVariantsContent />} />;
};

export default RubricVariantsRoute;
