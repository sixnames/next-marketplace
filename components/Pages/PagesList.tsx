import Button from 'components/Button';
import ContentItemControls from 'components/ContentItemControls/ContentItemControls';
import FixedButtons from 'components/FixedButtons';
import Inner from 'components/Inner';
import Link from 'components/Link/Link';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal';
import { CreatePageModalInterface } from 'components/Modal/CreatePageModal';
import Table, { TableColumn } from 'components/Table';
import Title from 'components/Title';
import { PAGE_STATE_DRAFT } from 'config/common';
import { CONFIRM_MODAL, CREATE_PAGE_MODAL } from 'config/modalVariants';
import {
  PageInterface,
  PagesGroupInterface,
  PagesGroupTemplateInterface,
  PagesTemplateInterface,
} from 'db/uiInterfaces';
import { useDeletePageMutation } from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import AppContentWrapper, {
  AppContentWrapperBreadCrumbs,
} from 'layout/AppLayout/AppContentWrapper';
import { useRouter } from 'next/router';
import * as React from 'react';

export interface PagesListInterface {
  pagesGroup: PagesGroupInterface | PagesGroupTemplateInterface;
  isTemplate?: boolean;
  basePath: string;
  breadcrumbs: AppContentWrapperBreadCrumbs;
}

const PagesList: React.FC<PagesListInterface> = ({
  pagesGroup,
  isTemplate,
  breadcrumbs,
  basePath,
}) => {
  const router = useRouter();
  const { showModal, onErrorCallback, onCompleteCallback, showLoading } = useMutationCallbacks({
    reload: true,
  });

  const [deletePageMutation] = useDeletePageMutation({
    onError: onErrorCallback,
    onCompleted: (data) => onCompleteCallback(data.deletePage),
  });

  const columns: TableColumn<PageInterface | PagesTemplateInterface>[] = [
    {
      accessor: 'name',
      headTitle: 'Название',
      render: ({ cellData, dataItem }) => {
        return (
          <Link
            testId={`${cellData}-link`}
            className='text-primary-text hover:no-underline hover:text-link-text'
            href={`${basePath}/${pagesGroup._id}/${dataItem._id}`}
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
      accessor: 'state',
      headTitle: 'Опубликована',
      render: ({ cellData }) => (cellData === PAGE_STATE_DRAFT ? 'Нет' : 'Да'),
    },
    {
      accessor: 'city.name',
      headTitle: 'Город',
      render: ({ cellData }) => cellData,
    },
    {
      render: ({ dataItem }) => {
        return (
          <div className='flex justify-end'>
            <ContentItemControls
              testId={`${dataItem.name}`}
              deleteTitle={'Удалить страницу'}
              deleteHandler={() => {
                showModal<ConfirmModalInterface>({
                  variant: CONFIRM_MODAL,
                  props: {
                    testId: 'delete-page-modal',
                    message: `Вы уверены, что хотите удалить страницу ${dataItem.name}`,
                    confirm: () => {
                      showLoading();
                      deletePageMutation({
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
              updateTitle={'Редактировать страницу'}
              updateHandler={() => {
                router.push(`${basePath}/${pagesGroup._id}/${dataItem._id}`).catch(console.log);
              }}
            />
          </div>
        );
      },
    },
  ];

  /*const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${pagesGroup.name}`,
    config: [
      {
        name: isTemplate ? 'Группы шаблонов страниц' : 'Группы страниц',
        href: basePath,
      },
    ],
  };*/

  return (
    <AppContentWrapper testId={'pages-list'} breadcrumbs={breadcrumbs}>
      <Inner>
        <Title>{pagesGroup.name}</Title>
        <div className='relative'>
          <div className='overflow-x-auto overflow-y-hidden'>
            <Table<PageInterface | PagesTemplateInterface>
              testIdKey={'name'}
              columns={columns}
              data={pagesGroup.pages || []}
              onRowDoubleClick={(dataItem) => {
                router.push(`${basePath}/${pagesGroup._id}/${dataItem._id}`).catch(console.log);
              }}
            />
          </div>

          <FixedButtons>
            <Button
              testId={'create-page'}
              size={'small'}
              onClick={() => {
                showModal<CreatePageModalInterface>({
                  variant: CREATE_PAGE_MODAL,
                  props: {
                    pagesGroupId: `${pagesGroup._id}`,
                  },
                });
              }}
            >
              Добавить страницу
            </Button>
          </FixedButtons>
        </div>
      </Inner>
    </AppContentWrapper>
  );
};

export default PagesList;
