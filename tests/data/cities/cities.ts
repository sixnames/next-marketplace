import { DEFAULT_CITY, DEFAULT_CURRENCY } from '../../../config/common';
import { CityModel } from '../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';

const cities: CityModel[] = [
  {
    _id: getObjectId('defaultCity'),
    slug: DEFAULT_CITY,
    currency: DEFAULT_CURRENCY,
    countryId: getObjectId('defaultCountry'),
    nameI18n: {
      ru: 'Москва',
      en: 'Moscow',
    },
  },
  {
    _id: getObjectId('spbCity'),
    slug: 'spb',
    currency: DEFAULT_CURRENCY,
    countryId: getObjectId('defaultCountry'),
    nameI18n: {
      ru: 'СПБ',
      en: 'SPB',
    },
  },
];

// @ts-ignore
export = cities;
