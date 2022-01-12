import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as React from 'react';
import FormikRouterSearch from '../../../../components/FormElements/Search/FormikRouterSearch';
import Inner from '../../../../components/Inner';
import LinkPhone from '../../../../components/Link/LinkPhone';
import WpLink from '../../../../components/Link/WpLink';
import Pager from '../../../../components/Pager';
import WpTable, { WpTableColumn } from '../../../../components/WpTable';
import WpTitle from '../../../../components/WpTitle';
import { getConsoleCustomersPageSsr } from '../../../../db/dao/ssr/getConsoleCustomersPageSsr';
import { AppPaginationInterface, UserInterface } from '../../../../db/uiInterfaces';
import AppContentWrapper from '../../../../layout/AppContentWrapper';
import ConsoleLayout from '../../../../layout/cms/ConsoleLayout';
import { GetConsoleInitialDataPropsInterface } from '../../../../lib/ssrUtils';

export interface ConsoleCustomersPageConsumerInterface
  extends AppPaginationInterface<UserInterface> {}

const pageTitle = 'Клиенты';

const ConsoleCustomersPageConsumer: React.FC<ConsoleCustomersPageConsumerInterface> = ({
  docs,
  page,
  totalPages,
  itemPath,
}) => {
  const router = useRouter();

  const columns: WpTableColumn<UserInterface>[] = [
    {
      headTitle: 'ID',
      accessor: 'itemId',
      render: ({ cellData, dataItem }) => {
        return <WpLink href={`${itemPath}/${dataItem._id}`}>{cellData}</WpLink>;
      },
    },
    {
      headTitle: 'Имя',
      accessor: 'fullName',
      render: ({ cellData }) => cellData,
    },
    {
      headTitle: 'Email',
      accessor: 'email',
      render: ({ cellData }) => cellData,
    },
    {
      accessor: 'formattedPhone',
      headTitle: 'Телефон',
      render: ({ cellData }) => <LinkPhone value={cellData} />,
    },
    {
      accessor: 'category.name',
      headTitle: 'Категория',
      render: ({ cellData }) => cellData,
    },
  ];

  return (
    <AppContentWrapper testId={'users-list'}>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <Inner>
        <WpTitle>{pageTitle}</WpTitle>
        <div className='relative'>
          <FormikRouterSearch testId={'users'} />

          <div className='overflew-x-auto overflew-y-hidden'>
            <WpTable<UserInterface>
              columns={columns}
              data={docs}
              testIdKey={'name'}
              onRowDoubleClick={(dataItem) => {
                router.push(`${itemPath}/${dataItem._id}`).catch((e) => console.log(e));
              }}
            />
          </div>

          <Pager page={page} totalPages={totalPages} />
        </div>
      </Inner>
    </AppContentWrapper>
  );
};

export interface ConsoleCustomersPageInterface
  extends GetConsoleInitialDataPropsInterface,
    ConsoleCustomersPageConsumerInterface {}

const ConsoleCustomersPage: NextPage<ConsoleCustomersPageInterface> = ({
  layoutProps,
  ...props
}) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <ConsoleCustomersPageConsumer {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = getConsoleCustomersPageSsr;
export default ConsoleCustomersPage;
