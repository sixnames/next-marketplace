import React from 'react';
import OptionsGroupsFilter from './OptionsGroupsFilter';
import OptionsGroupsContent from './OptionsGroupsContent';
import DataLayout, { FilterResultArgsInterface } from '../../components/DataLayout/DataLayout';

function OptionsGroupsRoute() {
  return (
    <DataLayout
      title={'Группы опций'}
      filterContent={<OptionsGroupsFilter />}
      filterResult={({ query }: FilterResultArgsInterface) => (
        <OptionsGroupsContent query={query} />
      )}
    />
  );
}

export default OptionsGroupsRoute;
