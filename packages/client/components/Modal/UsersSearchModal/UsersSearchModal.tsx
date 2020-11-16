import React, { useState } from 'react';
import Spinner from '../../Spinner/Spinner';
import RequestError from '../../RequestError/RequestError';
import ModalFrame from '../ModalFrame';
import ModalTitle from '../ModalTitle';
import FormikIndividualSearch from '../../FormElements/Search/FormikIndividualSearch';
import { UserInListFragment, useUsersSerchQuery } from '../../../generated/apolloComponents';
import useDataLayoutMethods from '../../../hooks/useDataLayoutMethods';
import Table, { TableColumn } from '../../Table/Table';
import Pager from '../../Pager/Pager';
import Link from 'next/link';
import { ROUTE_CMS } from '../../../config';
import LinkPhone from '../../Link/LinkPhone';
import LinkEmail from '../../Link/LinkEmail';

export interface UsersSearchModalInterface {
  testId?: string;
  controlsColumn?: TableColumn<UserInListFragment>;
}

const UsersSearchModal: React.FC<UsersSearchModalInterface> = ({
  testId = 'users-search-modal',
  controlsColumn = {},
}) => {
  const { setPage, page } = useDataLayoutMethods();
  const [search, setSearch] = useState<string | null>(null);
  const { data, error, loading } = useUsersSerchQuery({
    fetchPolicy: 'network-only',
    variables: {
      input: {
        search,
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

  const { docs, totalPages } = data.getAllUsers;

  const controls = controlsColumn ? [controlsColumn] : [];

  const columns: TableColumn<UserInListFragment>[] = [
    {
      accessor: 'itemId',
      headTitle: 'ID',
      render: ({ cellData, dataItem }) => (
        <Link href={`${ROUTE_CMS}/users/${dataItem.id}`}>
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
    ...controls,
  ];

  return (
    <ModalFrame testId={testId} wide>
      <ModalTitle>Выберите пользователя</ModalTitle>

      <FormikIndividualSearch
        onSubmit={setSearch}
        testId={'user'}
        withReset
        onReset={() => setSearch(null)}
      />

      <Table<UserInListFragment> columns={columns} data={docs} testIdKey={'itemId'} />
      <Pager page={page} setPage={setPage} totalPages={totalPages} />
    </ModalFrame>
  );
};

export default UsersSearchModal;
