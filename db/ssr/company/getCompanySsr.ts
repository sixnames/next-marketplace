import { ObjectIdModel } from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import { CompanyInterface } from 'db/uiInterfaces';
import { ObjectId } from 'mongodb';

interface GetCompanySsrInterface {
  companyId: ObjectIdModel | string;
}

export async function getCompanySsr({
  companyId,
}: GetCompanySsrInterface): Promise<CompanyInterface | null> {
  const collections = await getDbCollections();
  const companiesCollection = collections.companiesCollection();

  const companyAggregationResult = await companiesCollection
    .aggregate<CompanyInterface>([
      {
        $match: {
          _id: new ObjectId(`${companyId}`),
        },
      },
    ])
    .toArray();
  const company = companyAggregationResult[0];
  if (!company) {
    return null;
  }
  return company;
}
