import React from 'react';
import RolesFilter from './RolesFilter';
import RolesContent from './RolesContent';
import DataLayout, { FilterResultArgsInterface } from '../../components/DataLayout/DataLayout';

const RolesRoute: React.FC = () => {
  return (
    <DataLayout
      title={'Роли'}
      filterContent={<RolesFilter />}
      filterResult={({ query }: FilterResultArgsInterface) => <RolesContent query={query} />}
    />
  );
};

export default RolesRoute;
