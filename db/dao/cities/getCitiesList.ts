import { SORT_ASC } from 'config/common';
import { COL_CITIES } from 'db/collectionNames';
import { CityModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';

export async function getCitiesList(): Promise<CityModel[]> {
  const { db } = await getDatabase();
  return db
    .collection<CityModel>(COL_CITIES)
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
