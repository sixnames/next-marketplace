import AppLayout from 'layout/AppLayout/AppLayout';
import * as React from 'react';
import { NextPage } from 'next';
import { getAppInitialData } from 'lib/ssrUtils';
import AttributesGroupsRoute from 'routes/AttributesGroups/AttributesGroupsRoute';

const AttributesGroups: NextPage = () => {
  return (
    <AppLayout>
      <AttributesGroupsRoute />
    </AppLayout>
  );
};

export const getServerSideProps = getAppInitialData;

export default AttributesGroups;
