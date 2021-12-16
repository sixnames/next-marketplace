import { DEFAULT_PAGE, PAGINATION_DEFAULT_LIMIT, SORT_DESC } from 'config/common';
import { COL_GIFT_CERTIFICATES, COL_USERS } from 'db/collectionNames';
import { ObjectIdModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import {
  GetConsoleGiftCertificatesPayloadInterface,
  GiftCertificateInterface,
} from 'db/uiInterfaces';
import { castUrlFilters } from 'lib/catalogueUtils';
import { getFieldStringLocale } from 'lib/i18n';
import { getFullName } from 'lib/nameUtils';
import { phoneToRaw, phoneToReadable } from 'lib/phoneUtils';

export interface GetConsoleGiftCertificatesInterface {
  companyId: ObjectIdModel;
  filters: string[];
  locale: string;
}

export async function getConsoleGiftCertificates({
  companyId,
  filters,
  locale,
}: GetConsoleGiftCertificatesInterface): Promise<GetConsoleGiftCertificatesPayloadInterface> {
  let fallbackPayload: GetConsoleGiftCertificatesPayloadInterface = {
    docs: [],
    page: DEFAULT_PAGE,
    totalDocs: 0,
    totalPages: 0,
  };
  try {
    const { db } = await getDatabase();
    const giftCertificatesCollection =
      db.collection<GiftCertificateInterface>(COL_GIFT_CERTIFICATES);

    // get pagination configs
    const { skip, limit, page } = await castUrlFilters({
      filters,
      initialPage: DEFAULT_PAGE,
      initialLimit: PAGINATION_DEFAULT_LIMIT,
      searchFieldName: '',
    });

    const giftCertificatesAggregationResult = await giftCertificatesCollection
      .aggregate<GetConsoleGiftCertificatesPayloadInterface>([
        {
          $match: {
            companyId,
          },
        },

        // facets
        {
          $facet: {
            // docs facet
            docs: [
              {
                $sort: {
                  createdAt: SORT_DESC,
                },
              },
              {
                $skip: skip,
              },
              {
                $limit: limit,
              },

              // get user
              {
                $lookup: {
                  as: 'user',
                  from: COL_USERS,
                  let: {
                    userId: '$userId',
                  },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $eq: ['$_id', '$$userId'],
                        },
                      },
                    },
                  ],
                },
              },
              {
                $addFields: {
                  user: {
                    $arrayElemAt: ['$user', 0],
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

        // cast facets
        {
          $addFields: {
            totalDocsObject: { $arrayElemAt: ['$countAllDocs', 0] },
          },
        },
        {
          $addFields: {
            countAllDocs: null,
            totalDocsObject: null,
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
      ])
      .toArray();
    const giftCertificatesAggregation = giftCertificatesAggregationResult[0];
    if (!giftCertificatesAggregation) {
      return fallbackPayload;
    }

    const { totalDocs, totalPages, docs } = giftCertificatesAggregation;

    return {
      totalDocs,
      totalPages,
      page,
      docs: docs.map((giftCertificate) => {
        return {
          ...giftCertificate,
          name: getFieldStringLocale(giftCertificate.nameI18n, locale),
          description: getFieldStringLocale(giftCertificate.descriptionI18n, locale),
          user: giftCertificate.user
            ? {
                ...giftCertificate.user,
                fullName: getFullName(giftCertificate.user),
                formattedPhone: {
                  raw: phoneToRaw(giftCertificate.user.phone),
                  readable: phoneToReadable(giftCertificate.user.phone),
                },
              }
            : null,
        };
      }),
    };
  } catch (e) {
    console.log('getConsoleGiftCertificates error ', e);
    return fallbackPayload;
  }
}
