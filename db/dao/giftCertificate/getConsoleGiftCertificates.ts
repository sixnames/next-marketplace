import { DEFAULT_PAGE, PAGINATION_DEFAULT_LIMIT, SORT_DESC } from 'config/common';
import { COL_GIFT_CERTIFICATES } from 'db/collectionNames';
import { ObjectIdModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import {
  GetConsoleGiftCertificatesPayloadInterface,
  GiftCertificateInterface,
} from 'db/uiInterfaces';
import { castUrlFilters } from 'lib/catalogueUtils';
import { getFieldStringLocale } from 'lib/i18n';

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
          $facets: {
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
            // totalDocs: '$totalDocsObject.totalDocs',
            totalPagesFloat: {
              $divide: ['$totalDocsObject.totalDocs', limit],
            },
          },
        },
        /*{
          $addFields: {
            totalPagesFloat: {
              $divide: ['$totalDocs', limit],
            },
          },
        },*/
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
        };
      }),
    };
  } catch (e) {
    return fallbackPayload;
  }
}
