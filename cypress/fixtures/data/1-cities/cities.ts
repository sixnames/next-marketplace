import { CityModel } from '../../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';

const cities: [CityModel] = [
  {
    _id: getObjectId('defaultCity'),
    slug: 'msk',
    nameI18n: {
      ru: 'Москва',
      en: 'Moscow',
    },
  },
];

export = cities;
