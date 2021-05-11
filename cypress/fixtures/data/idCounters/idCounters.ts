import { COL_USERS } from '../../../../db/collectionNames';
import { IdCounterModel } from '../../../../db/dbModels';

const cities: IdCounterModel[] = [
  {
    collection: COL_USERS,
    counter: 5,
  },
];

export = cities;
