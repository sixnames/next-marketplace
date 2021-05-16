import { CountryModel } from '../../../../db/dbModels';
import { getObjectId, getObjectIds } from 'mongo-seeding';

const countries: CountryModel[] = [
  {
    _id: getObjectId('defaultCountry'),
    citiesIds: getObjectIds(['defaultCity']),
    name: 'Россия',
    currency: 'р.',
  },
];

// @ts-ignore
export = countries;
