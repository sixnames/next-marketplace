import { AttributesGroupModel } from '../../../../db/dbModels';
import { getObjectId, getObjectIds } from 'mongo-seeding';

const attributesGroups: AttributesGroupModel[] = [
  {
    _id: getObjectId('Общие характеристики'),
    nameI18n: {
      ru: 'Общие характеристики',
    },
    attributesIds: [],
  },
  {
    _id: getObjectId('Характеристики пива'),
    nameI18n: {
      ru: 'Характеристики пива',
    },
    attributesIds: [],
  },
  {
    _id: getObjectId('Характеристики шампанского'),
    nameI18n: {
      ru: 'Характеристики шампанского',
    },
    attributesIds: [],
  },
  {
    _id: getObjectId('Характеристики коньяка'),
    nameI18n: {
      ru: 'Характеристики коньяка',
    },
    attributesIds: [],
  },
  {
    _id: getObjectId('Характеристики ликёра'),
    nameI18n: {
      ru: 'Характеристики ликёра',
    },
    attributesIds: [],
  },
  {
    _id: getObjectId('Характеристики водки'),
    nameI18n: {
      ru: 'Характеристики водки',
    },
    attributesIds: [],
  },
  {
    _id: getObjectId('Характеристики виски'),
    nameI18n: {
      ru: 'Характеристики виски',
    },
    attributesIds: [],
  },
  {
    _id: getObjectId('Характеристики вина'),
    nameI18n: {
      ru: 'Характеристики вина',
    },
    attributesIds: [],
  },
];

export = attributesGroups;
