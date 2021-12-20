import { SORT_ASC } from '../../../config/common';
import { COL_CITIES } from '../../collectionNames';
import { CityModel } from '../../dbModels';
import { getDatabase } from '../../mongodb';

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
