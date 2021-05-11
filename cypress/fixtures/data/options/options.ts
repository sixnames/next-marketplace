import { DEFAULT_COUNTERS_OBJECT } from '../../../../config/common';
import { OptionModel } from '../../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';

const options: OptionModel[] = [
  // Состав
  {
    _id: getObjectId('option Хмель'),
    slug: '000001',
    optionsGroupId: getObjectId('optionsGroup Состав'),
    variants: {},
    nameI18n: {
      ru: 'Хмель',
    },
    ...DEFAULT_COUNTERS_OBJECT,
  },
  {
    _id: getObjectId('option Вода'),
    slug: '000002',
    optionsGroupId: getObjectId('optionsGroup Состав'),
    variants: {},
    nameI18n: {
      ru: 'Вода',
    },
    ...DEFAULT_COUNTERS_OBJECT,
  },
  {
    _id: getObjectId('option Солод'),
    slug: '000003',
    optionsGroupId: getObjectId('optionsGroup Состав'),
    variants: {},
    nameI18n: {
      ru: 'Солод',
    },
    ...DEFAULT_COUNTERS_OBJECT,
  },
];

export = options;
