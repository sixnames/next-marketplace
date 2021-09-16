import LinkEmail from 'components/Link/LinkEmail';
import LinkPhone from 'components/Link/LinkPhone';
import { ROUTE_CMS } from 'config/common';
import Link from 'next/link';
import * as React from 'react';
import Spinner from 'components/Spinner';
import RequestError from 'components/RequestError';
import ModalFrame from 'components/Modal/ModalFrame';
import ModalTitle from 'components/Modal/ModalTitle';
import FormikIndividualSearch from 'components/FormElements/Search/FormikIndividualSearch';
import { UserInListFragment, useUsersSerchQuery } from 'generated/apolloComponents';
import Table, { TableColumn } from 'components/Table';

export interface UsersSearchModalInterface {
  testId?: string;
  controlsColumn?: TableColumn<UserInListFragment>;
}

const UsersSearchModal: React.FC<UsersSearchModalInterface> = ({
  testId = 'users-search-modal',
  controlsColumn = {},
}) => {
  // const { setPage, page } = useDataLayoutMethods();
  const [search, setSearch] = React.useState<string | null>(null);
  const { data, error, loading } = useUsersSerchQuery({
    fetchPolicy: 'network-only',
    variables: {
      input: {
        search,
        limit: 1000,
      },
    },
  });

  if (loading) {
    return <Spinner isNested />;
  }

  if (error || !data || !data.getAllUsers) {
    return (
      <ModalFrame>
        <RequestError />
      </ModalFrame>
    );
  }

  const { docs } = data.getAllUsers;

  const columns: TableColumn<UserInListFragment>[] = [
    {
      accessor: 'itemId',
      headTitle: 'ID',
      render: ({ cellData, dataItem }) => (
        <Link href={`${ROUTE_CMS}/users/user/${dataItem._id}`}>
          <a>{cellData}</a>
        </Link>
      ),
    },
    {
      accessor: 'fullName',
      headTitle: 'Имя',
      render: ({ cellData }) => cellData,
    },
    {
      accessor: 'formattedPhone',
      headTitle: 'Телефон',
      render: ({ cellData }) => <LinkPhone value={cellData} />,
    },
    {
      accessor: 'email',
      headTitle: 'Email',
      render: ({ cellData }) => <LinkEmail value={cellData} />,
    },
    {
      accessor: 'role',
      headTitle: 'Роль',
      render: ({ cellData }) => cellData.name,
    },
    ...(controlsColumn ? [controlsColumn] : []),
  ];

  return (
    <ModalFrame testId={testId} size={'wide'}>
      <ModalTitle>Выберите пользователя</ModalTitle>

      <FormikIndividualSearch
        onSubmit={setSearch}
        testId={'user'}
        onReset={() => setSearch(null)}
      />

      <Table<UserInListFragment> columns={columns} data={docs} testIdKey={'itemId'} />
      {/*<Pager page={page} setPage={setPage} totalPages={totalPages} />*/}
    </ModalFrame>
  );
};

export default UsersSearchModal;
