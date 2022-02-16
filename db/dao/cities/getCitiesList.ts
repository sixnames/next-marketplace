import { CityModel } from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import { SORT_ASC } from 'lib/config/common';

export async function getCitiesList(): Promise<CityModel[]> {
  const collections = await getDbCollections();
  return collections
    .citiesCollection()
    .find(
      {},
      {
        sort: {
          _id: SORT_ASC,
        },
      },
    )
    .toArray();
}
