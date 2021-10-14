import Button from 'components/Button';
import FixedButtons from 'components/FixedButtons';
import ContentItemControls from 'components/ContentItemControls';
import FormikRouterSearch from 'components/FormElements/Search/FormikRouterSearch';
import Inner from 'components/Inner';
import Link from 'components/Link/Link';
import LinkPhone from 'components/Link/LinkPhone';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal';
import { CreateUserModalInterface } from 'components/Modal/CreateUserModal';
import Pager, { useNavigateToPageHandler } from 'components/Pager';
import Table, { TableColumn } from 'components/Table';
import Title from 'components/Title';
import { DEFAULT_PAGE, ROUTE_CMS, SORT_DESC } from 'config/common';
import { CONFIRM_MODAL, CREATE_USER_MODAL } from 'config/modalVariants';
import { COL_ROLES, COL_USER_CATEGORIES, COL_USERS } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import {
  AppPaginationInterface,
  RoleInterface,
  UserCategoryInterface,
  UserInterface,
} from 'db/uiInterfaces';
import { useDeleteUserMutation } from 'hooks/mutations/useUserMutations';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import AppContentWrapper from 'layout/AppContentWrapper';
import { alwaysArray } from 'lib/arrayUtils';
import { castCatalogueFilters } from 'lib/catalogueUtils';
import { getFieldStringLocale } from 'lib/i18n';
import { getFullName } from 'lib/nameUtils';
import { phoneToRaw, phoneToReadable } from 'lib/phoneUtils';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';

interface UsersConsumerFiltersInterface {
  roles: RoleInterface[];
}

interface UsersConsumerInterface extends AppPaginationInterface<UserInterface> {
  filters: UsersConsumerFiltersInterface;
}

const pageTitle = 'Пользователи';

const UsersConsumer: React.FC<UsersConsumerInterface> = ({
  docs,
  page,
  totalPages,
  itemPath,
  filters: { roles },
}) => {
  const router = useRouter();
  const setPageHandler = useNavigateToPageHandler();
  const { showModal, showLoading } = useMutationCallbacks({
    reload: true,
  });

  const [deleteUserMutation] = useDeleteUserMutation();

  const columns: TableColumn<UserInterface>[] = [
    {
      headTitle: 'ID',
      accessor: 'itemId',
      render: ({ cellData, dataItem }) => {
        return <Link href={`${itemPath}/${dataItem._id}`}>{cellData}</Link>;
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
        <Title>{pageTitle}</Title>
        <div className='relative'>
          <FormikRouterSearch testId={'users'} />

          <div className='overflew-x-auto overflew-y-hidden'>
            <Table<UserInterface>
              columns={columns}
              data={docs}
              testIdKey={'name'}
              onRowDoubleClick={(dataItem) => {
                router.push(`${itemPath}/${dataItem._id}`).catch((e) => console.log(e));
              }}
            />
          </div>

          <Pager
            page={page}
            totalPages={totalPages}
            setPage={(newPage) => {
              setPageHandler(newPage);
            }}
          />

          <FixedButtons>
            <Button
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
            </Button>
          </FixedButtons>
        </div>
      </Inner>
    </AppContentWrapper>
  );
};

interface UsersPageInterface extends PagePropsInterface, UsersConsumerInterface {}

const UsersPage: NextPage<UsersPageInterface> = ({ pageUrls, ...props }) => {
  return (
    <CmsLayout pageUrls={pageUrls}>
      <UsersConsumer {...props} />
    </CmsLayout>
  );
};

interface UsersAggregationInterface {
  docs: UserInterface[];
  totalDocs: number;
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<UsersPageInterface>> => {
  const { props } = await getAppInitialData({ context });
  if (!props) {
    return {
      notFound: true,
    };
  }

  const { query } = context;
  const { filters, search } = query;
  const locale = props.sessionLocale;

  // Cast filters
  const {
    // realFilterOptions,
    // noFiltersSelected,
    page,
    skip,
    limit,
    clearSlug,
  } = castCatalogueFilters({
    filters: alwaysArray(filters),
  });
  const itemPath = `${ROUTE_CMS}/users/user`;

  const regexSearch = {
    $regex: search,
    $options: 'i',
  };

  const searchStage = search
    ? [
        {
          $match: {
            $or: [
              {
                email: regexSearch,
              },
              {
                name: regexSearch,
              },
              {
                lastName: regexSearch,
              },
              {
                secondName: regexSearch,
              },
              {
                phone: regexSearch,
              },
              {
                itemId: regexSearch,
              },
            ],
          },
        },
      ]
    : [];

  const { db } = await getDatabase();
  const usersCollection = db.collection<UserInterface>(COL_USERS);
  const rolesCollection = db.collection<RoleInterface>(COL_ROLES);

  const usersAggregationResult = await usersCollection
    .aggregate<UsersAggregationInterface>(
      [
        ...searchStage,
        {
          $facet: {
            docs: [
              {
                $sort: {
                  _id: SORT_DESC,
                },
              },
              {
                $skip: skip,
              },
              {
                $limit: limit,
              },

              // get categories
              {
                $lookup: {
                  from: COL_USER_CATEGORIES,
                  as: 'categories',
                  let: {
                    categoryIds: '$categoryIds',
                  },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $in: ['$_id', '$$categoryIds'],
                        },
                      },
                    },
                  ],
                },
              },

              // get role
              {
                $lookup: {
                  from: COL_ROLES,
                  as: 'role',
                  let: { roleId: '$roleId' },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $eq: ['$_id', '$$roleId'],
                        },
                      },
                    },
                  ],
                },
              },
              {
                $addFields: {
                  role: { $arrayElemAt: ['$role', 0] },
                },
              },
              {
                $project: {
                  password: false,
                },
              },
            ],
            countAllDocs: [
              {
                $count: 'totalDocs',
              },
            ],
          },
        },
        {
          $addFields: {
            totalDocsObject: { $arrayElemAt: ['$countAllDocs', 0] },
          },
        },
        {
          $addFields: {
            totalDocs: '$totalDocsObject.totalDocs',
          },
        },
        {
          $addFields: {
            totalPagesFloat: {
              $divide: ['$totalDocs', limit],
            },
          },
        },
        {
          $addFields: {
            totalPages: {
              $ceil: '$totalPagesFloat',
            },
          },
        },
        {
          $project: {
            docs: 1,
            totalDocs: 1,
            totalPages: 1,
            hasPrevPage: {
              $gt: [page, DEFAULT_PAGE],
            },
            hasNextPage: {
              $lt: [page, '$totalPages'],
            },
          },
        },
      ],
      { allowDiskUse: true },
    )
    .toArray();
  const usersResult = usersAggregationResult[0];
  if (!usersResult) {
    return {
      notFound: true,
    };
  }

  const docs: UserInterface[] = [];
  for await (const user of usersResult.docs) {
    console.log(user);
    docs.push({
      ...user,
      fullName: getFullName(user),
      formattedPhone: {
        raw: phoneToRaw(user.phone),
        readable: phoneToReadable(user.phone),
      },
      categories: user.categories
        ? user.categories.map((category) => {
            return {
              ...category,
              name: getFieldStringLocale(category.nameI18n, locale),
            };
          })
        : null,
      role: user.role
        ? {
            ...user.role,
            name: getFieldStringLocale(user.role.nameI18n, locale),
          }
        : null,
    });
  }

  const rolesQueryResult = await rolesCollection
    .find(
      {},
      {
        projection: {
          slug: false,
        },
        sort: {
          _id: SORT_DESC,
        },
      },
    )
    .toArray();

  const roles = rolesQueryResult.map((role) => {
    return {
      ...role,
      name: getFieldStringLocale(role.nameI18n, locale),
    };
  });

  const payload: UsersConsumerInterface = {
    clearSlug,
    totalDocs: usersResult.totalDocs,
    totalPages: usersResult.totalPages,
    itemPath,
    page,
    docs,
    filters: {
      roles,
    },
  };
  const castedPayload = castDbData(payload);
  return {
    props: {
      ...props,
      ...castedPayload,
    },
  };
};

export default UsersPage;
