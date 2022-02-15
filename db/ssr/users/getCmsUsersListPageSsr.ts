import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { DEFAULT_PAGE, SORT_DESC } from 'lib/config/common';
import { alwaysArray } from 'lib/arrayUtils';
import { castUrlFilters } from 'lib/castUrlFilters';
import { getProjectLinks } from 'lib/links/getProjectLinks';
import { getFieldStringLocale } from 'lib/i18n';
import { getFullName } from 'lib/nameUtils';
import { phoneToRaw, phoneToReadable } from 'lib/phoneUtils';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import {
  CmsUsersListConsumerInterface,
  CmsUsersListPageInterface,
} from 'pages/cms/users/[...filters]';
import { COL_ROLES, COL_USER_CATEGORIES, COL_USERS } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { RoleInterface, UserInterface } from 'db/uiInterfaces';

interface UsersAggregationInterface {
  docs: UserInterface[];
  totalDocs: number;
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
}

export const getCmsUsersListPageSsr = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CmsUsersListPageInterface>> => {
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
  const { page, skip, limit, clearSlug } = await castUrlFilters({
    filters: alwaysArray(filters),
    searchFieldName: '_id',
  });
  const links = getProjectLinks();
  const itemPath = links.cms.users.user.url;

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

  const payload: CmsUsersListConsumerInterface = {
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
