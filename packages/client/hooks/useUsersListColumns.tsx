import { TableColumn } from '../components/Table/Table';
import { UserInListFragment } from '../generated/apolloComponents';
import Link from 'next/link';
import { ROUTE_CMS } from '../config';
import LinkPhone from '../components/Link/LinkPhone';
import LinkEmail from '../components/Link/LinkEmail';
import React from 'react';

export interface UseUsersListColumnsInterface {
  controlsColumn?: TableColumn<UserInListFragment>;
}

const useUsersListColumns = (
  props?: UseUsersListColumnsInterface,
): TableColumn<UserInListFragment>[] => {
  const { controlsColumn } = props || {};
  const controls = controlsColumn ? [controlsColumn] : [];

  return [
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
    {
      accessor: 'role',
      headTitle: 'Роль',
      render: ({ cellData }) => cellData.nameString,
    },
    ...controls,
  ];
};

export default useUsersListColumns;
