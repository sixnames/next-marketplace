import React, { useState } from 'react';
import Spinner from '../../Spinner/Spinner';
import RequestError from '../../RequestError/RequestError';
import ModalFrame from '../ModalFrame';
import ModalTitle from '../ModalTitle';
import FormikIndividualSearch from '../../FormElements/Search/FormikIndividualSearch';
import { useUsersSerchQuery } from '../../../generated/apolloComponents';

export interface UsersSearchModalInterface {
  testId?: string;
}

const UsersSearchModal: React.FC<UsersSearchModalInterface> = ({
  testId = 'users-search-modal',
}) => {
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

  if (error) {
    return (
      <ModalFrame>
        <RequestError />
      </ModalFrame>
    );
  }

  // const { docs } = data?.getAllUsers;
  console.log(data?.getAllUsers?.docs);
  return (
    <ModalFrame testId={testId} wide>
      <ModalTitle>Выберите пользователя</ModalTitle>

      <FormikIndividualSearch
        onSubmit={setSearch}
        testId={'user'}
        withReset
        onReset={() => setSearch(null)}
      />
    </ModalFrame>
  );
};

export default UsersSearchModal;
