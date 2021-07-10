import Button from 'components/Button';
import ContentItemControls from 'components/ContentItemControls/ContentItemControls';
import FixedButtons from 'components/FixedButtons';
import Inner from 'components/Inner';
import Link from 'components/Link/Link';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal';
import { PagesGroupModalInterface } from 'components/Modal/PagesGroupModal';
import Table, { TableColumn } from 'components/Table';
import Title from 'components/Title';
import { DEFAULT_COMPANY_SLUG, ROUTE_CMS } from 'config/common';
import { CONFIRM_MODAL, PAGES_GROUP_MODAL } from 'config/modalVariants';
import { PagesGroupInterface, PagesGroupTemplateInterface } from 'db/uiInterfaces';
import { useDeletePagesGroupMutation } from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useValidationSchema from 'hooks/useValidationSchema';
import AppContentWrapper from 'layout/AppLayout/AppContentWrapper';
import { useRouter } from 'next/router';
import * as React from 'react';
import { createPagesGroupSchema, updatePagesGroupSchema } from 'validation/pagesSchema';

export interface PageGroupsListInterface {
  pagesGroups: PagesGroupInterface[] | PagesGroupTemplateInterface[];
  pageTitle: string;
  isTemplate?: boolean;
  basePath: string;
}

const PageGroupsList: React.FC<PageGroupsListInterface> = ({
  pagesGroups,
  pageTitle,
  isTemplate,
  basePath,
}) => {
  const router = useRouter();
  const { showLoading, showModal, onCompleteCallback, onErrorCallback } = useMutationCallbacks({
    reload: true,
  });

  const createPagesGroupValidationSchema = useValidationSchema({
    schema: createPagesGroupSchema,
  });

  const updatePagesGroupValidationSchema = useValidationSchema({
    schema: updatePagesGroupSchema,
  });

  const [deletePagesGroupMutation] = useDeletePagesGroupMutation({
    onCompleted: (data) => onCompleteCallback(data.deletePagesGroup),
    onError: onErrorCallback,
  });

  const columns: TableColumn<PagesGroupInterface | PagesGroupTemplateInterface>[] = [
    {
      accessor: 'name',
      headTitle: 'Название',
      render: ({ cellData, dataItem }) => {
        return (
          <Link
            testId={`${cellData}-link`}
            className='text-primary-text hover:no-underline hover:text-link-text'
            href={`${basePath}/${dataItem._id}`}
          >
            {cellData}
          </Link>
        );
      },
    },
    {
      accessor: 'index',
      headTitle: 'Порядковый номер',
      render: ({ cellData }) => cellData,
    },
    {
      render: ({ dataItem }) => {
        return (
          <div className='flex justify-end'>
            <ContentItemControls
              testId={`${dataItem.name}`}
              updateTitle={'Обновить группу страниц'}
              updateHandler={() => {
                showModal<PagesGroupModalInterface>({
                  variant: PAGES_GROUP_MODAL,
                  props: {
                    companySlug: DEFAULT_COMPANY_SLUG,
                    validationSchema: updatePagesGroupValidationSchema,
                    pagesGroup: dataItem,
                    isTemplate,
                  },
                });
              }}
              deleteTitle={'Удалить группу страниц'}
              deleteHandler={() => {
                showModal<ConfirmModalInterface>({
                  variant: CONFIRM_MODAL,
                  props: {
                    testId: 'delete-pages-group-modal',
                    message: `Вы уверенны, что хотите удалить группу страниц ${dataItem.name}. Все страницы данной группы будту так же удалены.`,
                    confirm: () => {
                      showLoading();
                      deletePagesGroupMutation({
                        variables: {
                          input: {
                            _id: dataItem._id,
                            isTemplate,
                          },
                        },
                      }).catch(console.log);
                    },
                  },
                });
              }}
            />
          </div>
        );
      },
    },
  ];

  return (
    <AppContentWrapper testId={'page-groups-list'}>
      <Inner>
        <Title>{pageTitle}</Title>
        <div className='relative'>
          <div className='overflow-x-auto overflow-y-hidden'>
            <Table<PagesGroupInterface | PagesGroupTemplateInterface>
              testIdKey={'name'}
              columns={columns}
              data={pagesGroups}
              onRowDoubleClick={(dataItem) => {
                router.push(`${ROUTE_CMS}/pages/${dataItem._id}`).catch(console.log);
              }}
            />
          </div>

          <FixedButtons>
            <Button
              testId={'create-pages-group'}
              size={'small'}
              onClick={() => {
                showModal<PagesGroupModalInterface>({
                  variant: PAGES_GROUP_MODAL,
                  props: {
                    companySlug: DEFAULT_COMPANY_SLUG,
                    validationSchema: createPagesGroupValidationSchema,
                  },
                });
              }}
            >
              Добавить группу страниц
            </Button>
          </FixedButtons>
        </div>
      </Inner>
    </AppContentWrapper>
  );
};

export default PageGroupsList;
