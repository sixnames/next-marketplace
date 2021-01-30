import AppLayout from 'layout/AppLayout/AppLayout';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { NextPage } from 'next';
import { getCmsSsrProps } from 'lib/ssrUtils';
import AttributesGroupsRoute from 'routes/AttributesGroups/AttributesGroupsRoute';

const AttributesGroups: NextPage<PagePropsInterface> = ({ initialTheme }) => {
  return (
    <AppLayout initialTheme={initialTheme}>
      <AttributesGroupsRoute />
    </AppLayout>
  );
};

export const getServerSideProps = getCmsSsrProps;

export default AttributesGroups;
