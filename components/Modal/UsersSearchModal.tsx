import * as React from 'react';
import Spinner from 'components/Spinner';
import RequestError from 'components/RequestError';
import ModalFrame from 'components/Modal/ModalFrame';
import ModalTitle from 'components/Modal/ModalTitle';
import FormikIndividualSearch from 'components/FormElements/Search/FormikIndividualSearch';
import { UserInListFragment, useUsersSerchQuery } from 'generated/apolloComponents';
import useDataLayoutMethods from 'hooks/useDataLayoutMethods';
import Table from 'components/Table';
import Pager from 'components/Pager/Pager';
import useUsersListColumns, { UseUsersListColumnsInterface } from 'hooks/useUsersListColumns';

export interface UsersSearchModalInterface extends UseUsersListColumnsInterface {
  testId?: string;
}

const UsersSearchModal: React.FC<UsersSearchModalInterface> = ({
  testId = 'users-search-modal',
  controlsColumn = {},
}) => {
  const { setPage, page } = useDataLayoutMethods();
  const [search, setSearch] = React.useState<string | null>(null);
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
    <ModalFrame testId={testId} size={'wide'}>
      <ModalTitle>Выберите пользователя</ModalTitle>

      <FormikIndividualSearch
        onSubmit={setSearch}
        testId={'user'}
        onReset={() => setSearch(null)}
      />

      <Table<UserInListFragment> columns={columns} data={docs} testIdKey={'itemId'} />
      <Pager page={page} setPage={setPage} totalPages={totalPages} />
    </ModalFrame>
  );
};

export default UsersSearchModal;
