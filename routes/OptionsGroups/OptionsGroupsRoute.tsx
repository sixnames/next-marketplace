import * as React from 'react';
import OptionsGroupsFilter from './OptionsGroupsFilter';
import OptionsGroupsContent from './OptionsGroupsContent';
import DataLayout, { FilterResultArgsInterface } from '../../components/DataLayout/DataLayout';

const OptionsGroupsRoute = () => (
  <DataLayout
    isFilterVisible
    title={'Группы опций'}
    filterContent={<OptionsGroupsFilter />}
    filterResult={({ query }: FilterResultArgsInterface) => <OptionsGroupsContent query={query} />}
  />
);

export default OptionsGroupsRoute;
