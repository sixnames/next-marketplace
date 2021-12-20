import { CountryModel } from '../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';

const countries: CountryModel[] = [
  {
    _id: getObjectId('defaultCountry'),
    name: 'Россия',
    currency: 'р.',
  },
];

// @ts-ignore
export = countries;
