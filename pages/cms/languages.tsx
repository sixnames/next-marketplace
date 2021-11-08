import Button from 'components/button/Button';
import FixedButtons from 'components/button/FixedButtons';
import ContentItemControls from 'components/button/ContentItemControls';
import Inner from 'components/Inner';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal';
import { LanguageModalInterface, UpdateLanguageModalInput } from 'components/Modal/LanguageModal';
import Table, { TableColumn } from 'components/Table';
import Title from 'components/Title';
import { SORT_DESC } from 'config/common';
import { CONFIRM_MODAL, LANGUAGE_MODAL } from 'config/modalVariants';
import { useLocaleContext } from 'context/localeContext';
import { COL_LANGUAGES } from 'db/collectionNames';
import { LanguageModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import {
  CreateLanguageInput,
  useCreateLanguageMutation,
  useDeleteLanguageMutation,
  useUpdateLanguageMutation,
} from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import AppContentWrapper from 'layout/AppContentWrapper';
import Head from 'next/head';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import CmsLayout from 'layout/cms/CmsLayout';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';

const pageTitle = 'Языки сайта';

interface LanguagesContentInterface {
  languages: LanguageModel[];
}

const LanguagesContent: React.FC<LanguagesContentInterface> = ({ languages }) => {
  const { defaultLocale } = useLocaleContext();
  const { showModal, showLoading, onErrorCallback, onCompleteCallback } = useMutationCallbacks({
    withModal: true,
    reload: true,
  });

  const [createLanguageMutation] = useCreateLanguageMutation({
    onCompleted: (data) => onCompleteCallback(data.createLanguage),
    onError: onErrorCallback,
  });

  const [updateLanguageMutation] = useUpdateLanguageMutation({
    onCompleted: (data) => onCompleteCallback(data.updateLanguage),
    onError: onErrorCallback,
  });

  const [deleteLanguageMutation] = useDeleteLanguageMutation({
    onCompleted: (data) => onCompleteCallback(data.deleteLanguage),
    onError: onErrorCallback,
  });

  const columns: TableColumn<LanguageModel>[] = [
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
            updateHandler={() => {
              showModal<LanguageModalInterface>({
                variant: LANGUAGE_MODAL,
                props: {
                  testId: 'update-language-modal',
                  language: dataItem,
                  confirm: (values: UpdateLanguageModalInput) => {
                    showLoading();
                    return updateLanguageMutation({
                      variables: {
                        input: {
                          languageId: dataItem._id,
                          ...values,
                        },
                      },
                    });
                  },
                },
              });
            }}
            deleteTitle={'Удалить язык'}
            deleteHandler={() => {
              showModal<ConfirmModalInterface>({
                variant: CONFIRM_MODAL,
                props: {
                  testId: 'delete-language-modal',
                  message: `Вы уверены, что хотите удалить язык ${dataItem.name}`,
                  confirm: () => {
                    showLoading();
                    return deleteLanguageMutation({
                      variables: {
                        _id: dataItem._id,
                      },
                    });
                  },
                },
              });
            }}
          />
        );
      },
    },
  ];

  return (
    <AppContentWrapper>
      <Head>
        <title>{pageTitle}</title>
      </Head>

      <Inner data-cy={'languages-list'}>
        <Title>{pageTitle}</Title>
        <div className='overflow-x-auto overflow-y-hidden'>
          <Table<LanguageModel>
            columns={columns}
            data={languages}
            testIdKey={'name'}
            emptyMessage={'Список пуст'}
          />
        </div>
        <FixedButtons>
          <Button
            size={'small'}
            testId={`language-create`}
            onClick={() => {
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
            }}
          >
            Создать язык
          </Button>
        </FixedButtons>
      </Inner>
    </AppContentWrapper>
  );
};

interface LanguagesPageInterface extends PagePropsInterface, LanguagesContentInterface {}

const LanguagesPage: NextPage<LanguagesPageInterface> = ({ pageUrls, languages }) => {
  return (
    <CmsLayout pageUrls={pageUrls}>
      <LanguagesContent languages={languages} />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<LanguagesPageInterface>> => {
  const { props } = await getAppInitialData({ context });
  if (!props) {
    return {
      notFound: true,
    };
  }

  const { db } = await getDatabase();
  const languagesCollection = db.collection<LanguageModel>(COL_LANGUAGES);
  const languages = await languagesCollection
    .aggregate([
      {
        $sort: {
          _id: SORT_DESC,
        },
      },
    ])
    .toArray();

  return {
    props: {
      ...props,
      languages: castDbData(languages),
    },
  };
};

export default LanguagesPage;
