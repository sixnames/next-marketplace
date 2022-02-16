import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import Head from 'next/head';
import * as React from 'react';
import ContentItemControls from '../../components/button/ContentItemControls';
import FixedButtons from '../../components/button/FixedButtons';
import WpButton from '../../components/button/WpButton';
import { useLocaleContext } from '../../components/context/localeContext';
import Inner from '../../components/Inner';
import AppContentWrapper from '../../components/layout/AppContentWrapper';
import ConsoleLayout from '../../components/layout/cms/ConsoleLayout';
import { ConfirmModalInterface } from '../../components/Modal/ConfirmModal';
import {
  LanguageModalInterface,
  UpdateLanguageModalInput,
} from '../../components/Modal/LanguageModal';
import WpTable, { WpTableColumn } from '../../components/WpTable';
import WpTitle from '../../components/WpTitle';
import { LanguageModel } from '../../db/dbModels';
import { getDbCollections } from '../../db/mongodb';
import {
  CreateLanguageInput,
  useCreateLanguageMutation,
  useDeleteLanguageMutation,
  useUpdateLanguageMutation,
} from '../../generated/apolloComponents';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import { SORT_DESC } from '../../lib/config/common';
import { CONFIRM_MODAL, LANGUAGE_MODAL } from '../../lib/config/modalVariants';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from '../../lib/ssrUtils';

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

  const columns: WpTableColumn<LanguageModel>[] = [
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
        <WpTitle>{pageTitle}</WpTitle>
        <div className='overflow-x-auto overflow-y-hidden'>
          <WpTable<LanguageModel>
            columns={columns}
            data={languages}
            testIdKey={'name'}
            emptyMessage={'Список пуст'}
          />
        </div>
        <FixedButtons>
          <WpButton
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
          </WpButton>
        </FixedButtons>
      </Inner>
    </AppContentWrapper>
  );
};

interface LanguagesPageInterface
  extends GetAppInitialDataPropsInterface,
    LanguagesContentInterface {}

const LanguagesPage: NextPage<LanguagesPageInterface> = ({ layoutProps, languages }) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <LanguagesContent languages={languages} />
    </ConsoleLayout>
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

  const collections = await getDbCollections();
  const languagesCollection = collections.languagesCollection();
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
