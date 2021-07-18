import FormikRouterSearch from 'components/FormElements/Search/FormikRouterSearch';
import Inner from 'components/Inner';
import LinkPhone from 'components/Link/LinkPhone';
import Pager, { useNavigateToPageHandler } from 'components/Pager/Pager';
import Table, { TableColumn } from 'components/Table';
import Title from 'components/Title';
import { PAGE_DEFAULT, ROUTE_CONSOLE, SORT_DESC } from 'config/common';
import { COL_ORDERS, COL_ROLES, COL_USERS } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import {
  AppPaginationInterface,
  OrderInterface,
  RoleInterface,
  UserInterface,
} from 'db/uiInterfaces';
import AppContentWrapper from 'layout/AppLayout/AppContentWrapper';
import AppLayout from 'layout/AppLayout/AppLayout';
import { alwaysArray } from 'lib/arrayUtils';
import { castCatalogueFilters } from 'lib/catalogueUtils';
import { getFieldStringLocale } from 'lib/i18n';
import { getFullName } from 'lib/nameUtils';
import { phoneToRaw, phoneToReadable } from 'lib/phoneUtils';
import { ObjectId } from 'mongodb';
import Head from 'next/head';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getConsoleInitialData } from 'lib/ssrUtils';

interface UsersConsumerFiltersInterface {
  roles: RoleInterface[];
}

interface UsersConsumerInterface extends AppPaginationInterface<UserInterface> {
  filters: UsersConsumerFiltersInterface;
}

const pageTitle = 'Клиенты';

const UsersConsumer: React.FC<UsersConsumerInterface> = ({
  docs,
  page,
  totalPages,
  // itemPath
}) => {
  // const router = useRouter();
  const setPageHandler = useNavigateToPageHandler();

  const columns: TableColumn<UserInterface>[] = [
    {
      headTitle: 'ID',
      accessor: 'itemId',
      render: ({ cellData }) => {
        return cellData;
      },
      /*render: ({ cellData, dataItem }) => {
        return <Link href={`${itemPath}/${dataItem._id}`}>{cellData}</Link>;
      },*/
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
              /*onRowDoubleClick={(dataItem) => {
                router.push(`${itemPath}/${dataItem._id}`).catch((e) => console.log(e));
              }}*/
            />
          </div>

          <Pager
            page={page}
            totalPages={totalPages}
            setPage={(newPage) => {
              setPageHandler(newPage);
            }}
          />
        </div>
      </Inner>
    </AppContentWrapper>
  );
};

interface UsersPageInterface extends PagePropsInterface, UsersConsumerInterface {}

const UsersPage: NextPage<UsersPageInterface> = ({ pageUrls, currentCompany, ...props }) => {
  return (
    <AppLayout pageUrls={pageUrls} company={currentCompany}>
      <UsersConsumer {...props} />
    </AppLayout>
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
  const { query } = context;
  const { search, filter, companyId } = query;
  const { props } = await getConsoleInitialData({ context });
  if (!props) {
    return {
      notFound: true,
    };
  }

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
    filters: alwaysArray(filter),
  });
  const itemPath = `${ROUTE_CONSOLE}/${companyId}/customers/customer`;

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
  const ordersCollection = db.collection<OrderInterface>(COL_ORDERS);

  const usersAggregationResult = await ordersCollection
    .aggregate<UsersAggregationInterface>(
      [
        {
          $match: {
            companyId: new ObjectId(`${companyId}`),
          },
        },
        {
          $lookup: {
            from: COL_USERS,
            as: 'user',
            let: {
              customerId: '$customerId',
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$_id', '$$customerId'],
                  },
                },
              },
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
                    $gt: [page, PAGE_DEFAULT],
                  },
                  hasNextPage: {
                    $lt: [page, '$totalPages'],
                  },
                },
              },
            ],
          },
        },
        {
          $replaceRoot: {
            newRoot: {
              $arrayElemAt: ['$user', 0],
            },
          },
        },
      ],
      { allowDiskUse: true },
    )
    .toArray();

  const usersResult = usersAggregationResult[0];
  if (!usersResult) {
    const payload: UsersConsumerInterface = {
      clearSlug,
      totalDocs: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPrevPage: false,
      itemPath,
      page,
      docs: [],
      filters: {
        roles: [],
      },
    };

    const castedPayload = castDbData(payload);
    return {
      props: {
        ...props,
        ...castedPayload,
      },
    };
  }

  const docs: UserInterface[] = [];
  for await (const user of usersResult.docs) {
    docs.push({
      ...user,
      fullName: getFullName(user),
      formattedPhone: {
        raw: phoneToRaw(user.phone),
        readable: phoneToReadable(user.phone),
      },
      role: user.role
        ? {
            ...user.role,
            name: getFieldStringLocale(user.role.nameI18n, locale),
          }
        : null,
    });
  }

  const payload: UsersConsumerInterface = {
    clearSlug,
    totalDocs: usersResult.totalDocs,
    totalPages: usersResult.totalPages,
    hasNextPage: usersResult.hasNextPage,
    hasPrevPage: usersResult.hasPrevPage,
    itemPath,
    page,
    docs,
    filters: {
      roles: [],
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
