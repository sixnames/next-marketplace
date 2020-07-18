import React from 'react';
import DataLayoutTitle from '../../components/DataLayout/DataLayoutTitle';
import DataLayoutContentFrame from '../../components/DataLayout/DataLayoutContentFrame';
import Table from '../../components/Table/Table';
import {
  CreateLanguageInput,
  Language,
  useCreateLanguageMutation,
  useGetAllLanguagesQueryQuery,
  useSetLanguageAsDefaultMutation,
} from '../../generated/apolloComponents';
import Spinner from '../../components/Spinner/Spinner';
import RequestError from '../../components/RequestError/RequestError';
import ContentItemControls from '../../components/ContentItemControls/ContentItemControls';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import { GET_ALL_LANGUAGES_QUERY } from '../../graphql/query/getAllLanguages';
import { LANGUAGE_MODAL } from '../../config/modals';
import { LanguageModalInterface } from '../../components/Modal/LanguageModal/LanguageModal';
import Checkbox from '../../components/FormElements/Checkbox/Checkbox';

const LanguagesContent: React.FC = () => {
  const { data, loading, error } = useGetAllLanguagesQueryQuery();
  const { showModal, showLoading, onErrorCallback, onCompleteCallback } = useMutationCallbacks({
    withModal: true,
  });

  const [createLanguageMutation] = useCreateLanguageMutation({
    refetchQueries: [{ query: GET_ALL_LANGUAGES_QUERY }],
    awaitRefetchQueries: true,
    onCompleted: (data) => onCompleteCallback(data.createLanguage),
    onError: onErrorCallback,
  });

  const [setLanguageAsDefaultMutation] = useSetLanguageAsDefaultMutation({
    refetchQueries: [{ query: GET_ALL_LANGUAGES_QUERY }],
    awaitRefetchQueries: true,
    onCompleted: (data) => onCompleteCallback(data.setLanguageAsDefault),
    onError: onErrorCallback,
  });

  function createLanguageHandler() {
    showModal<LanguageModalInterface>({
      type: LANGUAGE_MODAL,
      props: {
        testId: 'create-language-modal',
        confirm: (values: CreateLanguageInput) => {
          showLoading();
          return createLanguageMutation({
            variables: {
              input: values,
            },
          });
        },
      },
    });
  }

  if (loading) return <Spinner isNested />;
  if (error || !data) return <RequestError />;

  const columns = [
    {
      key: 'name',
      title: 'Название',
      render: (name: string) => name,
    },
    {
      key: 'key',
      title: 'Ключ',
      render: (key: string) => key,
    },
    {
      key: 'isDefault',
      title: 'Основной',
      render: (isDefault: boolean, { id, name }: Language) => (
        <Checkbox
          testId={name}
          disabled={isDefault}
          name={'isDefault'}
          checked={isDefault}
          onChange={() => {
            showLoading();
            setLanguageAsDefaultMutation({
              variables: {
                id,
              },
            });
          }}
        />
      ),
    },
  ];

  return (
    <div data-cy={'languages-list'}>
      <DataLayoutTitle
        titleRight={
          <ContentItemControls
            justifyContent={'flex-end'}
            createTitle={'Создать язык'}
            createHandler={createLanguageHandler}
            testId={'language'}
          />
        }
      />
      <DataLayoutContentFrame>
        <Table
          columns={columns}
          data={data.getAllLanguages}
          testIdKey={'name'}
          emptyMessage={'Список пуст'}
        />
      </DataLayoutContentFrame>
    </div>
  );
};

export default LanguagesContent;
