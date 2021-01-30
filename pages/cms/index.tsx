import * as React from 'react';
import Inner from 'components/Inner/Inner';
import Title from 'components/Title/Title';
import AppLayout from 'layout/AppLayout/AppLayout';
import { PagePropsInterface } from 'pages/_app';
import { NextPage } from 'next';
import { getCmsSsrProps } from 'lib/ssrUtils';

const Cms: NextPage<PagePropsInterface> = ({ initialTheme }) => {
  return (
    <AppLayout initialTheme={initialTheme} title={'CMS'}>
      <Inner>
        <Title>Cms</Title>
      </Inner>
    </AppLayout>
  );
};

export const getServerSideProps = getCmsSsrProps;

export default Cms;
