import * as React from 'react';
import DataLayout from '../../components/DataLayout/DataLayout';
import CmsOrdersContent from './CmsOrdersContent';
import CmsOrdersFilter from './CmsOrdersFilter';

const CmsOrdersRoute: React.FC = () => {
  return (
    <DataLayout
      isFilterVisible
      title={'Заказы'}
      filterContent={<CmsOrdersFilter />}
      filterResult={() => <CmsOrdersContent />}
    />
  );
};

export default CmsOrdersRoute;
