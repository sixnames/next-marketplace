import { phoneToRaw, phoneToReadable } from '../../../lib/phoneUtils';
import { COL_COMPANIES, COL_SHOPS } from '../../collectionNames';
import { getDatabase } from '../../mongodb';
import { CompanyInterface } from '../../uiInterfaces';

export async function getSsrDomainCompany(
  match: Record<any, any>,
): Promise<CompanyInterface | null> {
  const { db } = await getDatabase();
  const companiesCollection = db.collection<CompanyInterface>(COL_COMPANIES);
  const domainCompanyAggregation = await companiesCollection
    .aggregate<CompanyInterface>([
      {
        $match: match,
      },

      // get main shop
      {
        $lookup: {
          from: COL_SHOPS,
          as: 'mainShop',
          let: { companyId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$$companyId', '$companyId'],
                },
              },
            },
            {
              $project: {
                assets: false,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          mainShop: {
            $arrayElemAt: ['$mainShop', 0],
          },
        },
      },
    ])
    .toArray();
  const domainCompany = domainCompanyAggregation[0]
    ? {
        ...domainCompanyAggregation[0],
        mainShop: domainCompanyAggregation[0].mainShop
          ? {
              ...domainCompanyAggregation[0].mainShop,
              contacts: {
                ...domainCompanyAggregation[0].mainShop.contacts,
                formattedPhones: domainCompanyAggregation[0].mainShop.contacts.phones.map(
                  (phone) => {
                    return {
                      raw: phoneToRaw(phone),
                      readable: phoneToReadable(phone),
                    };
                  },
                ),
              },
            }
          : null,
      }
    : null;

  if (!domainCompany?.domain) {
    return null;
  }

  return domainCompany;
}
