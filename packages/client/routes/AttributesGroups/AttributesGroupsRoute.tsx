import React from 'react';
import DataLayout from '../../components/DataLayout/DataLayout';
import AttributesGroupsFilter from './AttributesGroupsFilter';
import AttributesGroupsContent from './AttributesGroupsContent';

const AttributesGroupsRoute: React.FC = () => {
  return (
    <DataLayout
      title={'Группы атрибутов'}
      filterContent={<AttributesGroupsFilter />}
      filterResult={({ query }) => <AttributesGroupsContent query={query} />}
    />
  );
};

export default AttributesGroupsRoute;
