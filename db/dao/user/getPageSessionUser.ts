import { getSession } from 'next-auth/client';
import {
  ROLE_SLUG_ADMIN,
  ROUTE_CMS,
  ROUTE_CMS_NAV_GROUP,
  ROUTE_CONSOLE,
  ROUTE_CONSOLE_NAV_GROUP,
  SORT_ASC,
} from '../../../config/common';
import { getFullName, getShortName } from '../../../lib/nameUtils';
import { NexusContext } from '../../../types/apiContextTypes';
import { COL_COMPANIES, COL_NAV_ITEMS, COL_ROLES, COL_USERS } from '../../collectionNames';
import { getDatabase } from '../../mongodb';
import { UserInterface } from '../../uiInterfaces';

export interface SessionUserPayloadInterface {
  me: UserInterface;
  showAdminUiInCatalogue: boolean;
  editLinkBasePath: string;
}

export interface GetPageSessionUserInterface {
  context: NexusContext;
  locale: string;
}

export async function getPageSessionUser({
  context,
  locale,
}: GetPageSessionUserInterface): Promise<SessionUserPayloadInterface | null | undefined> {
  // get session user
  const session = await getSession(context);
  if (!session?.user?.email) {
    return null;
  }

  const { db } = await getDatabase();
  const usersCollection = db.collection<UserInterface>(COL_USERS);
  const userAggregation = await usersCollection
    .aggregate<UserInterface>([
      {
        $match: {
          email: session.user.email,
        },
      },
      {
        $lookup: {
          from: COL_COMPANIES,
          as: 'companies',
          let: { userId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    {
                      $eq: ['$ownerId', '$$userId'],
                    },
                    {
                      $in: ['$$userId', '$staffIds'],
                    },
                  ],
                },
              },
            },
          ],
        },
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
            {
              $lookup: {
                from: COL_NAV_ITEMS,
                as: 'navItems',
                let: {
                  allowedAppNavigation: '$allowedAppNavigation',
                  slug: '$slug',
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $or: [
                          { $in: ['$path', '$$allowedAppNavigation'] },
                          { $eq: ['$$slug', ROLE_SLUG_ADMIN] },
                        ],
                      },
                      // exclude base paths
                      path: {
                        $nin: [ROUTE_CMS, ROUTE_CONSOLE],
                      },
                    },
                  },
                  {
                    $sort: {
                      index: SORT_ASC,
                    },
                  },
                  {
                    $addFields: {
                      name: `$nameI18n.${locale}`,
                    },
                  },
                ],
              },
            },
            {
              $addFields: {
                name: `$nameI18n.${locale}`,
                appNavigation: {
                  $filter: {
                    input: '$navItems',
                    as: 'navItem',
                    cond: {
                      $and: [
                        {
                          $eq: ['$$navItem.navGroup', ROUTE_CONSOLE_NAV_GROUP],
                        },
                        {
                          $ne: ['$$navItem.path', ''],
                        },
                      ],
                    },
                  },
                },
                cmsNavigation: {
                  $filter: {
                    input: '$navItems',
                    as: 'navItem',
                    cond: {
                      $and: [
                        {
                          $eq: ['$$navItem.navGroup', ROUTE_CMS_NAV_GROUP],
                        },
                        {
                          $ne: ['$$navItem.path', ROUTE_CMS],
                        },
                      ],
                    },
                  },
                },
              },
            },
            {
              $project: {
                nameI18n: false,
                navItems: false,
                createdAt: false,
                updatedAt: false,
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
          createdAt: false,
          updatedAt: false,
          notifications: false,
        },
      },
    ])
    .toArray();
  const user = userAggregation[0];
  if (!user) {
    return null;
  }

  const sessionUser: UserInterface = {
    ...user,
    fullName: getFullName(user),
    shortName: getShortName(user),
  };

  // role configs
  const { role, companies } = sessionUser;

  const showAdminUiInCatalogue = Boolean(role?.showAdminUiInCatalogue);

  const company = (companies || [])[0];
  const isCompanyStaff = Boolean(role?.isCompanyStaff);
  let editLinkBasePath = company ? `${ROUTE_CMS}/companies/${company?._id}` : ROUTE_CMS;
  if (isCompanyStaff) {
    editLinkBasePath = `${ROUTE_CONSOLE}/${company?._id}`;
  }

  return {
    me: sessionUser,
    editLinkBasePath,
    showAdminUiInCatalogue,
  };
}
