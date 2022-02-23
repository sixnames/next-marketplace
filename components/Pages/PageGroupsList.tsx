import {
  CompanyInterface,
  PagesGroupInterface,
  PagesGroupTemplateInterface,
} from 'db/uiInterfaces';
import { useDeletePagesGroup } from 'hooks/mutations/usePageMutations';
import { useBasePath } from 'hooks/useBasePath';
import { DEFAULT_COMPANY_SLUG } from 'lib/config/common';
import { CONFIRM_MODAL, PAGES_GROUP_MODAL } from 'lib/config/modalVariants';
import { useRouter } from 'next/router';
import * as React from 'react';
import { createPagesGroupSchema, updatePagesGroupSchema } from 'validation/pagesSchema';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import useValidationSchema from '../../hooks/useValidationSchema';
import ContentItemControls from '../button/ContentItemControls';
import FixedButtons from '../button/FixedButtons';
import WpButton from '../button/WpButton';
import WpLink from '../Link/WpLink';
import { ConfirmModalInterface } from '../Modal/ConfirmModal';
import { PagesGroupModalInterface } from '../Modal/PagesGroupModal';
import WpTable, { WpTableColumn } from '../WpTable';

export interface PageGroupsListInterface {
  pagesGroups: PagesGroupInterface[] | PagesGroupTemplateInterface[];
  isTemplate?: boolean;
  companySlug?: string;
  currentCompany?: CompanyInterface | null;
}

const PageGroupsList: React.FC<PageGroupsListInterface> = ({
  pagesGroups,
  isTemplate,
  companySlug,
}) => {
  const basePath = useBasePath('pages');
  const router = useRouter();
  const { showLoading, showModal } = useMutationCallbacks({
    reload: true,
  });

  const createPagesGroupValidationSchema = useValidationSchema({
    schema: createPagesGroupSchema,
  });

  const updatePagesGroupValidationSchema = useValidationSchema({
    schema: updatePagesGroupSchema,
  });

  const [deletePagesGroupMutation] = useDeletePagesGroup();

  const columns: WpTableColumn<PagesGroupInterface | PagesGroupTemplateInterface>[] = [
    {
      accessor: 'name',
      headTitle: 'Название',
      render: ({ cellData, dataItem }) => {
        return (
          <WpLink
            testId={`${cellData}-link`}
            className='hover:text-link-text text-primary-text hover:no-underline'
            href={`${basePath}/${dataItem._id}`}
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
                    companySlug: companySlug || DEFAULT_COMPANY_SLUG,
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
                        _id: `${dataItem._id}`,
                        isTemplate,
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
    <div className='relative' data-cy={'page-groups-list'}>
      <div className='overflow-x-auto overflow-y-hidden'>
        <WpTable<PagesGroupInterface | PagesGroupTemplateInterface>
          testIdKey={'name'}
          columns={columns}
          data={pagesGroups}
          onRowDoubleClick={(dataItem) => {
            router.push(`${basePath}/${dataItem._id}`).catch(console.log);
          }}
        />
      </div>

      <FixedButtons>
        <WpButton
          testId={'create-pages-group'}
          size={'small'}
          onClick={() => {
            showModal<PagesGroupModalInterface>({
              variant: PAGES_GROUP_MODAL,
              props: {
                companySlug: companySlug || DEFAULT_COMPANY_SLUG,
                validationSchema: createPagesGroupValidationSchema,
                isTemplate,
              },
            });
          }}
        >
          Добавить группу страниц
        </WpButton>
      </FixedButtons>
    </div>
  );
};

export default PageGroupsList;
