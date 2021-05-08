import { DEFAULT_CITY } from '../../../../config/common';
import { CityModel } from '../../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';

const cities: [CityModel] = [
  {
    _id: getObjectId('defaultCity'),
    slug: DEFAULT_CITY,
    nameI18n: {
      ru: 'Москва',
      en: 'Moscow',
    },
  },
];

export = cities;
