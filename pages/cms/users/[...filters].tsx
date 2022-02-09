import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as React from 'react';
import ContentItemControls from '../../../components/button/ContentItemControls';
import FixedButtons from '../../../components/button/FixedButtons';
import WpButton from '../../../components/button/WpButton';
import FormikRouterSearch from '../../../components/FormElements/Search/FormikRouterSearch';
import Inner from '../../../components/Inner';
import LinkPhone from '../../../components/Link/LinkPhone';
import WpLink from '../../../components/Link/WpLink';
import { ConfirmModalInterface } from '../../../components/Modal/ConfirmModal';
import { CreateUserModalInterface } from '../../../components/Modal/CreateUserModal';
import Pager from '../../../components/Pager';
import WpTable, { WpTableColumn } from '../../../components/WpTable';
import WpTitle from '../../../components/WpTitle';
import { CONFIRM_MODAL, CREATE_USER_MODAL } from '../../../config/modalVariants';
import { getCmsUsersListPageSsr } from 'db/dao/ssr/getCmsUsersListPageSsr';
import {
  AppPaginationInterface,
  RoleInterface,
  UserCategoryInterface,
  UserInterface,
} from '../../../db/uiInterfaces';
import { useDeleteUserMutation } from '../../../hooks/mutations/useUserMutations';
import useMutationCallbacks from '../../../hooks/useMutationCallbacks';
import AppContentWrapper from '../../../layout/AppContentWrapper';
import ConsoleLayout from '../../../layout/cms/ConsoleLayout';
import { GetAppInitialDataPropsInterface } from '../../../lib/ssrUtils';

interface UsersConsumerFiltersInterface {
  roles: RoleInterface[];
}

export interface CmsUsersListConsumerInterface extends AppPaginationInterface<UserInterface> {
  filters: UsersConsumerFiltersInterface;
}

const pageTitle = 'Пользователи';

const CmsUsersListConsumer: React.FC<CmsUsersListConsumerInterface> = ({
  docs,
  page,
  totalPages,
  itemPath,
  filters: { roles },
}) => {
  const router = useRouter();

  const { showModal, showLoading } = useMutationCallbacks({
    reload: true,
  });

  const [deleteUserMutation] = useDeleteUserMutation();

  const columns: WpTableColumn<UserInterface>[] = [
    {
      headTitle: 'ID',
      accessor: 'itemId',
      render: ({ cellData, dataItem }) => {
        return <WpLink href={`${itemPath}/${dataItem._id}`}>{cellData}</WpLink>;
      },
    },
    {
      headTitle: 'Имя',
      accessor: 'fullName',
      render: ({ cellData }) => cellData,
    },
    {
      headTitle: 'Email',
      accessor: 'email',
      render: ({ cellData }) => cellData,
    },
    {
      accessor: 'formattedPhone',
      headTitle: 'Телефон',
      render: ({ cellData }) => <LinkPhone value={cellData} />,
    },
    {
      headTitle: 'Роль',
      accessor: 'role.name',
      render: ({ cellData }) => cellData,
    },
    {
      headTitle: 'Сотрудник сайта',
      accessor: 'role.isStaff',
      render: ({ cellData }) => (cellData ? 'Да' : 'Нет'),
    },
    {
      headTitle: 'Категории',
      accessor: 'categories',
      render: ({ cellData }) => {
        const categories = (cellData || []) as UserCategoryInterface[];
        return (
          <React.Fragment>
            {categories.map((category) => {
              return <div key={`${category._id}`}>{category.name}</div>;
            })}
          </React.Fragment>
        );
      },
    },
    {
      render: ({ dataItem }) => {
        return (
          <div className='flex justify-end'>
            <ContentItemControls
              testId={`${dataItem.name}`}
              updateTitle={'Редактировать пользователя'}
              updateHandler={() => {
                router.push(`${itemPath}/${dataItem._id}`).catch((e) => console.log(e));
              }}
              deleteTitle={'Удалить пользователя'}
              deleteHandler={() => {
                showModal<ConfirmModalInterface>({
                  variant: CONFIRM_MODAL,
                  props: {
                    testId: 'delete-user-modal',
                    message: `Вы уверены, что хотите удалить пользователя ${dataItem.fullName}?`,
                    confirm: () => {
                      showLoading();
                      deleteUserMutation({
                        _id: `${dataItem._id}`,
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
    <AppContentWrapper testId={'users-list'}>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <Inner>
        <WpTitle>{pageTitle}</WpTitle>
        <div className='relative'>
          <FormikRouterSearch testId={'users'} />

          <div className='overflew-x-auto overflew-y-hidden'>
            <WpTable<UserInterface>
              columns={columns}
              data={docs}
              testIdKey={'name'}
              onRowDoubleClick={(dataItem) => {
                router.push(`${itemPath}/${dataItem._id}`).catch((e) => console.log(e));
              }}
            />
          </div>

          <Pager page={page} totalPages={totalPages} />

          <FixedButtons>
            <WpButton
              testId={'create-user'}
              size={'small'}
              onClick={() => {
                showModal<CreateUserModalInterface>({
                  variant: CREATE_USER_MODAL,
                  props: {
                    roles,
                  },
                });
              }}
            >
              Добавить пользователя
            </WpButton>
          </FixedButtons>
        </div>
      </Inner>
    </AppContentWrapper>
  );
};

export interface CmsUsersListPageInterface
  extends GetAppInitialDataPropsInterface,
    CmsUsersListConsumerInterface {}

const CmsUsersListPage: NextPage<CmsUsersListPageInterface> = ({ layoutProps, ...props }) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <CmsUsersListConsumer {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = getCmsUsersListPageSsr;
export default CmsUsersListPage;
