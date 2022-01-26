import { useRouter } from 'next/router';
import * as React from 'react';
import { PAGE_STATE_DRAFT } from '../../config/common';
import { CONFIRM_MODAL, CREATE_PAGE_MODAL } from '../../config/modalVariants';
import {
  CityInterface,
  PageInterface,
  PagesGroupInterface,
  PagesGroupTemplateInterface,
  PagesTemplateInterface,
} from '../../db/uiInterfaces';
import { useDeletePage } from '../../hooks/mutations/usePageMutations';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import ContentItemControls from '../button/ContentItemControls';
import FixedButtons from '../button/FixedButtons';
import WpButton from '../button/WpButton';
import WpLink from '../Link/WpLink';
import { ConfirmModalInterface } from '../Modal/ConfirmModal';
import { CreatePageModalInterface } from '../Modal/CreatePageModal';
import WpTable, { WpTableColumn } from '../WpTable';

export interface PagesListInterface {
  pagesGroup: PagesGroupInterface | PagesGroupTemplateInterface;
  isTemplate?: boolean;
  basePath: string;
  cities: CityInterface[];
}

const PagesList: React.FC<PagesListInterface> = ({ pagesGroup, cities, isTemplate, basePath }) => {
  const router = useRouter();
  const { showModal, showLoading } = useMutationCallbacks({
    reload: true,
  });

  const [deletePageMutation] = useDeletePage();

  const columns: WpTableColumn<PageInterface | PagesTemplateInterface>[] = [
    {
      accessor: 'name',
      headTitle: 'Название',
      render: ({ cellData, dataItem }) => {
        return (
          <WpLink
            testId={`${cellData}-link`}
            className='hover:text-link-text text-primary-text hover:no-underline'
            href={`${basePath}/${pagesGroup._id}/${dataItem._id}`}
          >
            {cellData}
          </WpLink>
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
        <WpTable<PageInterface | PagesTemplateInterface>
          testIdKey={'name'}
          columns={columns}
          data={pagesGroup.pages || []}
          onRowDoubleClick={(dataItem) => {
            router.push(`${basePath}/${pagesGroup._id}/${dataItem._id}`).catch(console.log);
          }}
        />
      </div>

      <FixedButtons>
        <WpButton
          testId={'create-page'}
          size={'small'}
          onClick={() => {
            showModal<CreatePageModalInterface>({
              variant: CREATE_PAGE_MODAL,
              props: {
                pagesGroupId: `${pagesGroup._id}`,
                isTemplate,
                cities,
              },
            });
          }}
        >
          Добавить страницу
        </WpButton>
      </FixedButtons>
    </div>
  );
};

export default PagesList;
