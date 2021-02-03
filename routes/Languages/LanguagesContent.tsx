import * as React from 'react';
import DataLayoutTitle from '../../components/DataLayout/DataLayoutTitle';
import DataLayoutContentFrame from '../../components/DataLayout/DataLayoutContentFrame';
import Table, { TableColumn } from '../../components/Table/Table';
import {
  CreateLanguageInput,
  LanguageFragment,
  useCreateLanguageMutation,
  useDeleteLanguageMutation,
  useGetAllLanguagesQuery,
  useUpdateLanguageMutation,
} from 'generated/apolloComponents';
import Spinner from '../../components/Spinner/Spinner';
import RequestError from '../../components/RequestError/RequestError';
import ContentItemControls from '../../components/ContentItemControls/ContentItemControls';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import { GET_ALL_LANGUAGES_QUERY } from 'graphql/query/languagesQueries';
import { CONFIRM_MODAL, LANGUAGE_MODAL } from 'config/modals';
import {
  LanguageModalInterface,
  UpdateLanguageModalInput,
} from 'components/Modal/LanguageModal/LanguageModal';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal/ConfirmModal';
import { useLocaleContext } from 'context/localeContext';

const LanguagesContent: React.FC = () => {
  const { defaultLocale } = useLocaleContext();
  const { data, loading, error } = useGetAllLanguagesQuery();
  const { showModal, showLoading, onErrorCallback, onCompleteCallback } = useMutationCallbacks({
    withModal: true,
  });

  const [createLanguageMutation] = useCreateLanguageMutation({
    refetchQueries: [{ query: GET_ALL_LANGUAGES_QUERY }],
    awaitRefetchQueries: true,
    onCompleted: (data) => onCompleteCallback(data.createLanguage),
    onError: onErrorCallback,
  });

  const [updateLanguageMutation] = useUpdateLanguageMutation({
    refetchQueries: [{ query: GET_ALL_LANGUAGES_QUERY }],
    awaitRefetchQueries: true,
    onCompleted: (data) => onCompleteCallback(data.updateLanguage),
    onError: onErrorCallback,
  });

  const [deleteLanguageMutation] = useDeleteLanguageMutation({
    refetchQueries: [{ query: GET_ALL_LANGUAGES_QUERY }],
    awaitRefetchQueries: true,
    onCompleted: (data) => onCompleteCallback(data.deleteLanguage),
    onError: onErrorCallback,
  });

  function deleteLanguageHandler(language: LanguageFragment) {
    showModal<ConfirmModalInterface>({
      variant: CONFIRM_MODAL,
      props: {
        testId: 'delete-language-modal',
        message: `Вы уверены, что хотите удалить язык ${language.name}`,
        confirm: () => {
          showLoading();
          return deleteLanguageMutation({
            variables: {
              _id: language._id,
            },
          });
        },
      },
    });
  }

  function createLanguageHandler() {
    showModal<LanguageModalInterface>({
      variant: LANGUAGE_MODAL,
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

  function updateLanguageHandler(language: LanguageFragment) {
    const { _id } = language;
    showModal<LanguageModalInterface>({
      variant: LANGUAGE_MODAL,
      props: {
        testId: 'update-language-modal',
        language,
        confirm: (values: UpdateLanguageModalInput) => {
          showLoading();
          return updateLanguageMutation({
            variables: {
              input: {
                languageId: _id,
                ...values,
              },
            },
          });
        },
      },
    });
  }

  if (loading) return <Spinner isNested />;
  if (error || !data) return <RequestError />;

  const columns: TableColumn<LanguageFragment>[] = [
    {
      accessor: 'name',
      headTitle: 'Название',
      render: ({ cellData }) => cellData,
    },
    {
      accessor: 'slug',
      headTitle: 'Ключ',
      render: ({ cellData }) => cellData,
    },
    {
      accessor: 'nativeName',
      headTitle: 'Нативное название',
      render: ({ cellData }) => cellData,
    },
    {
      render: ({ dataItem }) => {
        return (
          <ContentItemControls
            isDeleteDisabled={dataItem.slug === defaultLocale}
            testId={dataItem.name}
            justifyContent={'flex-end'}
            updateTitle={'Обновить язык'}
            updateHandler={() => updateLanguageHandler(dataItem)}
            deleteTitle={'Удалить язык'}
            deleteHandler={() => deleteLanguageHandler(dataItem)}
          />
        );
      },
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
        <Table<LanguageFragment>
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