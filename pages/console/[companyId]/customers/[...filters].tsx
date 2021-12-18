import FormikRouterSearch from 'components/FormElements/Search/FormikRouterSearch';
import Inner from 'components/Inner';
import WpLink from 'components/Link/WpLink';
import LinkPhone from 'components/Link/LinkPhone';
import Pager from 'components/Pager';
import WpTable, { WpTableColumn } from 'components/WpTable';
import Title from 'components/Title';
import { DEFAULT_PAGE, ROUTE_CONSOLE, SORT_DESC } from 'config/common';
import { COL_ORDERS, COL_USER_CATEGORIES, COL_USERS } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import {
  AppPaginationInterface,
  OrderInterface,
  RoleInterface,
  UserInterface,
} from 'db/uiInterfaces';
import AppContentWrapper from 'layout/AppContentWrapper';
import ConsoleLayout from 'layout/cms/ConsoleLayout';
import { alwaysArray } from 'lib/arrayUtils';
import { castUrlFilters } from 'lib/catalogueUtils';
import { getFieldStringLocale } from 'lib/i18n';
import { getFullName } from 'lib/nameUtils';
import { phoneToRaw, phoneToReadable } from 'lib/phoneUtils';
import { ObjectId } from 'mongodb';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import {
  castDbData,
  getConsoleInitialData,
  GetConsoleInitialDataPropsInterface,
} from 'lib/ssrUtils';

interface UsersConsumerFiltersInterface {
  roles: RoleInterface[];
}

interface UsersConsumerInterface extends AppPaginationInterface<UserInterface> {
  filters: UsersConsumerFiltersInterface;
}

const pageTitle = 'Клиенты';

const UsersConsumer: React.FC<UsersConsumerInterface> = ({ docs, page, totalPages, itemPath }) => {
  const router = useRouter();

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
      accessor: 'category.name',
      headTitle: 'Категория',
      render: ({ cellData }) => cellData,
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
        </div>
      </Inner>
    </AppContentWrapper>
  );
};

interface UsersPageInterface extends GetConsoleInitialDataPropsInterface, UsersConsumerInterface {}

const UsersPage: NextPage<UsersPageInterface> = ({ layoutProps, ...props }) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <UsersConsumer {...props} />
    </ConsoleLayout>
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
  const { search, filters } = query;
  const { props } = await getConsoleInitialData({ context });
  if (!props) {
    return {
      notFound: true,
    };
  }

  const locale = props.sessionLocale;
  const companyId = new ObjectId(`${query.companyId}`);

  // Cast filters
  const { page, skip, limit, clearSlug } = await castUrlFilters({
    filters: alwaysArray(filters),
    searchFieldName: '_id',
  });
  const itemPath = `${ROUTE_CONSOLE}/${companyId}/customers/user`;

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
            companyId,
          },
        },
        ...searchStage,
        {
          $group: {
            _id: '$customerId',
          },
        },
        {
          $lookup: {
            from: COL_USERS,
            as: 'user',
            let: {
              customerId: '$_id',
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$_id', '$$customerId'],
                  },
                },
              },
              {
                $project: {
                  password: false,
                  notifications: false,
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
        {
          $facet: {
            // docs facet
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

              // get category
              {
                $lookup: {
                  from: COL_USER_CATEGORIES,
                  as: 'category',
                  let: {
                    categoryIds: '$categoryIds',
                  },
                  pipeline: [
                    {
                      $match: {
                        companyId,
                        $expr: {
                          $in: ['$_id', '$$categoryIds'],
                        },
                      },
                    },
                  ],
                },
              },
              {
                $addFields: {
                  category: {
                    $arrayElemAt: ['$category', 0],
                  },
                },
              },
            ],

            // counter facet
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
    const payload: UsersConsumerInterface = {
      clearSlug,
      totalDocs: 0,
      totalPages: 0,
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
      category: user.category
        ? {
            ...user.category,
            name: getFieldStringLocale(user.category.nameI18n, locale),
          }
        : null,
    });
  }

  const payload: UsersConsumerInterface = {
    clearSlug,
    totalDocs: usersResult.totalDocs,
    totalPages: usersResult.totalPages,
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
