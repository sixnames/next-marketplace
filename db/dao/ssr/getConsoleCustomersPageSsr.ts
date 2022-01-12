import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { DEFAULT_PAGE, SORT_DESC } from '../../../config/common';
import { alwaysArray } from '../../../lib/arrayUtils';
import { castUrlFilters } from '../../../lib/castUrlFilters';
import { getFieldStringLocale } from '../../../lib/i18n';
import { getConsoleCompanyLinks } from '../../../lib/linkUtils';
import { getFullName } from '../../../lib/nameUtils';
import { phoneToRaw, phoneToReadable } from '../../../lib/phoneUtils';
import { castDbData, getConsoleInitialData } from '../../../lib/ssrUtils';
import {
  ConsoleCustomersPageConsumerInterface,
  ConsoleCustomersPageInterface,
} from '../../../pages/console/[companyId]/users/[...filters]';
import { COL_ORDERS, COL_USER_CATEGORIES, COL_USERS } from '../../collectionNames';
import { getDatabase } from '../../mongodb';
import { AppPaginationInterface, OrderInterface, UserInterface } from '../../uiInterfaces';

export const getConsoleCustomersPageSsr = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<ConsoleCustomersPageInterface>> => {
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
  const links = getConsoleCompanyLinks({
    companyId: `${query.companyId}`,
  });

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
    .aggregate<AppPaginationInterface<UserInterface>>(
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
    const payload: ConsoleCustomersPageConsumerInterface = {
      clearSlug,
      totalDocs: 0,
      totalPages: 0,
      itemPath: links.user.itemPath,
      page,
      docs: [],
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

  const payload: ConsoleCustomersPageConsumerInterface = {
    clearSlug,
    totalDocs: usersResult.totalDocs,
    totalPages: usersResult.totalPages,
    itemPath: links.user.itemPath,
    page,
    docs,
  };
  const castedPayload = castDbData(payload);
  return {
    props: {
      ...props,
      ...castedPayload,
    },
  };
};
