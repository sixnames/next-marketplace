import React, { useState } from 'react';
import Spinner from '../../Spinner/Spinner';
import RequestError from '../../RequestError/RequestError';
import ModalFrame from '../ModalFrame';
import ModalTitle from '../ModalTitle';
import FormikIndividualSearch from '../../FormElements/Search/FormikIndividualSearch';
import { UserInListFragment, useUsersSerchQuery } from '../../../generated/apolloComponents';
import useDataLayoutMethods from '../../../hooks/useDataLayoutMethods';
import Table from '../../Table/Table';
import Pager from '../../Pager/Pager';
import useUsersListColumns, {
  UseUsersListColumnsInterface,
} from '../../../hooks/useUsersListColumns';

export interface UsersSearchModalInterface extends UseUsersListColumnsInterface {
  testId?: string;
}

const UsersSearchModal: React.FC<UsersSearchModalInterface> = ({
  testId = 'users-search-modal',
  controlsColumn = {},
}) => {
  const { setPage, page } = useDataLayoutMethods();
  const [search, setSearch] = useState<string | null>(null);
  const columns = useUsersListColumns({ controlsColumn });
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
