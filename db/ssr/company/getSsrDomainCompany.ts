import { COL_SHOPS } from 'db/collectionNames';
import { getDbCollections } from 'db/mongodb';
import { CompanyInterface } from 'db/uiInterfaces';
import { phoneToRaw, phoneToReadable } from 'lib/phoneUtils';

export async function getSsrDomainCompany(
  match: Record<any, any>,
): Promise<CompanyInterface | null> {
  const collections = await getDbCollections();
  const companiesCollection = collections.companiesCollection();
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
