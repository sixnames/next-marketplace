import { MetricModel } from '../../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';

const metrics: MetricModel[] = [
  {
    _id: getObjectId('km/h'),
    nameI18n: {
      ru: 'км/ч',
      en: 'km/h',
    },
  },
  {
    _id: getObjectId('mm'),
    nameI18n: {
      ru: 'мм',
      en: 'mm',
    },
  },
  {
    _id: getObjectId('m2'),
    nameI18n: {
      ru: 'м2',
      en: 'm2',
    },
  },
  {
    _id: getObjectId('places'),
    nameI18n: {
      ru: 'мест',
      en: 'places',
    },
  },
  {
    _id: getObjectId('km'),
    nameI18n: {
      ru: 'км',
      en: 'km',
    },
  },
  {
    _id: getObjectId('kw'),
    nameI18n: {
      ru: 'кВт',
      en: 'kw',
    },
  },
  {
    _id: getObjectId('rub.'),
    nameI18n: {
      ru: 'р.',
      en: 'rub.',
    },
  },
  {
    _id: getObjectId('years'),
    nameI18n: {
      ru: 'лет',
      en: 'years',
    },
  },
  {
    _id: getObjectId('cm'),
    nameI18n: {
      ru: 'см',
      en: 'cm',
    },
  },
  {
    _id: getObjectId('%'),
    nameI18n: {
      ru: '%',
      en: '%',
    },
  },
  {
    _id: getObjectId('m'),
    nameI18n: {
      ru: 'м',
      en: 'm',
    },
  },
  {
    _id: getObjectId('hours'),
    nameI18n: {
      ru: 'часов',
      en: 'hours',
    },
  },
  {
    _id: getObjectId('kg'),
    nameI18n: {
      ru: 'кг',
      en: 'kg',
    },
  },
  {
    _id: getObjectId('people'),
    nameI18n: {
      ru: 'чел.',
      en: 'people',
    },
  },
  {
    _id: getObjectId('m/s'),
    nameI18n: {
      ru: 'м/с',
      en: 'm/s',
    },
  },
  {
    _id: getObjectId('year'),
    nameI18n: {
      ru: 'год',
      en: 'year',
    },
  },
  {
    _id: getObjectId('minutes'),
    nameI18n: {
      ru: 'мин.',
      en: 'minutes',
    },
  },
  {
    _id: getObjectId('units'),
    nameI18n: {
      ru: 'ед.',
      en: 'units',
    },
  },
  {
    _id: getObjectId('ml'),
    nameI18n: {
      ru: 'мл.',
      en: 'ml',
    },
  },
  {
    _id: getObjectId('p/h'),
    nameI18n: {
      ru: 'л/ч.',
      en: 'p/h',
    },
  },
  {
    _id: getObjectId('Hz'),
    nameI18n: {
      ru: 'Hz',
      en: 'Hz',
    },
  },
  {
    _id: getObjectId('Wt'),
    nameI18n: {
      ru: 'Вт',
      en: 'Wt',
    },
  },
  {
    _id: getObjectId('°'),
    nameI18n: {
      ru: '°',
      en: '°',
    },
  },
  {
    _id: getObjectId('°C'),
    nameI18n: {
      ru: '°C',
      en: '°C',
    },
  },
  {
    _id: getObjectId('kd/m2'),
    nameI18n: {
      ru: 'кд/м2',
      en: 'kd/m2',
    },
  },
  {
    _id: getObjectId('m3/h'),
    nameI18n: {
      ru: 'м3/ч',
      en: 'm3/h',
    },
  },
];

export = metrics;
