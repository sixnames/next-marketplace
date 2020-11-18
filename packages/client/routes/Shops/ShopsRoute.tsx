import React from 'react';
import DataLayout from '../../components/DataLayout/DataLayout';
import ShopsFilter from './ShopsFilter';
import ShopsContent from './ShopsContent';

const ShopsRoute: React.FC = () => {
  return (
    <DataLayout
      title={'Магазины'}
      filterContent={<ShopsFilter />}
      filterResult={() => <ShopsContent />}
    />
  );
};

export default ShopsRoute;
