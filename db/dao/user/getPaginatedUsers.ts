import { DEFAULT_PAGE, SORT_BY_ID_DIRECTION } from 'config/common';
import { COL_ROLES, COL_USERS } from 'db/collectionNames';
import { castPaginationInput } from 'db/dao/aggregatePagination';
import {
  PaginationInputModel,
  PaginationPayloadType,
  UsersPaginationPayloadModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { DaoPropsInterface, UserInterface } from 'db/uiInterfaces';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getFieldStringLocale } from 'lib/i18n';
import { getFullName, getShortName } from 'lib/nameUtils';
import { phoneToRaw, phoneToReadable } from 'lib/phoneUtils';
import { getRequestParams } from 'lib/sessionHelpers';

export async function getPaginatedUsers({
  context,
  input,
}: DaoPropsInterface<PaginationInputModel>): Promise<UsersPaginationPayloadModel> {
  try {
    const { locale } = await getRequestParams(context);
    const { db } = await getDatabase();
    const usersCollection = db.collection<UserInterface>(COL_USERS);
    const { search, limit, page, skip, sortBy, sortDir } = castPaginationInput(input);

    // search
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

    const aggregated = await usersCollection
      .aggregate<PaginationPayloadType<UserInterface>>(
        [
          ...searchStage,
          {
            $sort: {
              [`${sortBy}`]: sortDir,
              _id: SORT_BY_ID_DIRECTION,
            },
          },
          {
            $facet: {
              // docs facet
              docs: [
                {
                  $skip: skip,
                },
                {
                  $limit: limit,
                },

                // get role
                {
                  $lookup: {
                    from: COL_ROLES,
                    as: 'role',
                    localField: 'roleId',
                    foreignField: '_id',
                  },
                },
                {
                  $addFields: {
                    role: {
                      $arrayElemAt: ['$role', 0],
                    },
                  },
                },
              ],

              // countAllDocs facet
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
        {
          allowDiskUse: true,
        },
      )
      .toArray();
    const aggregationResult = aggregated[0];
    if (!aggregationResult) {
      return {
        success: false,
        message: 'aggregation error',
      };
    }

    const docs: UserInterface[] = [];
    aggregationResult.docs.forEach((user) => {
      const castedUser: UserInterface = {
        ...user,
        fullName: getFullName(user),
        shortName: getShortName(user),
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
      };

      docs.push(castedUser);
    });

    return {
      success: true,
      message: 'success',
      payload: {
        ...aggregationResult,
        docs,
        totalDocs: aggregationResult.totalDocs || 0,
        totalPages: aggregationResult.totalPages || DEFAULT_PAGE,
        sortBy,
        sortDir,
        page,
        limit,
      },
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  }
}
