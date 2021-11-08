import Button from 'components/button/Button';
import ContentItemControls from 'components/button/ContentItemControls';
import FixedButtons from 'components/button/FixedButtons';
import Link from 'components/Link/Link';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal';
import { CreatePageModalInterface } from 'components/Modal/CreatePageModal';
import Table, { TableColumn } from 'components/Table';
import { PAGE_STATE_DRAFT } from 'config/common';
import { CONFIRM_MODAL, CREATE_PAGE_MODAL } from 'config/modalVariants';
import {
  PageInterface,
  PagesGroupInterface,
  PagesGroupTemplateInterface,
  PagesTemplateInterface,
} from 'db/uiInterfaces';
import { useDeletePage } from 'hooks/mutations/usePageMutations';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import { useRouter } from 'next/router';
import * as React from 'react';

export interface PagesListInterface {
  pagesGroup: PagesGroupInterface | PagesGroupTemplateInterface;
  isTemplate?: boolean;
  basePath: string;
}

const PagesList: React.FC<PagesListInterface> = ({ pagesGroup, isTemplate, basePath }) => {
  const router = useRouter();
  const { showModal, showLoading } = useMutationCallbacks({
    reload: true,
  });

  const [deletePageMutation] = useDeletePage();

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
                        _id: `${dataItem._id}`,
                        isTemplate,
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

  return (
    <div className='relative' data-cy={'pages-list'}>
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
                isTemplate,
              },
            });
          }}
        >
          Добавить страницу
        </Button>
      </FixedButtons>
    </div>
  );
};

export default PagesList;
