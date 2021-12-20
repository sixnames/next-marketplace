import { AttributesGroupModel } from '../../../db/dbModels';
import { getObjectId, getObjectIds } from 'mongo-seeding';

const attributesGroups: AttributesGroupModel[] = [
  {
    _id: getObjectId('attributesGroup Общие характеристики'),
    nameI18n: {
      ru: 'Общие характеристики',
    },
    attributesIds: getObjectIds([
      `attribute Текстовый`,
      `attribute Количество в упаковке`,
      `attribute Крепость`,
      `attribute Состав`,
      `attribute Регион`,
      `attribute Объем`,
      `attribute Тип ёмкости`,
      `attribute Год`,
      `attribute Виноград`,
      `attribute Винтаж`,
      `attribute Сахар`,
    ]),
  },
  {
    _id: getObjectId('attributesGroup Характеристики пива'),
    nameI18n: {
      ru: 'Характеристики пива',
    },
    attributesIds: getObjectIds([]),
  },
  {
    _id: getObjectId('attributesGroup Характеристики шампанского'),
    nameI18n: {
      ru: 'Характеристики шампанского',
    },
    attributesIds: getObjectIds([`attribute Тип шампанского`]),
  },
  {
    _id: getObjectId('attributesGroup Характеристики коньяка'),
    nameI18n: {
      ru: 'Характеристики коньяка',
    },
    attributesIds: [],
  },
  {
    _id: getObjectId('attributesGroup Характеристики ликёра'),
    nameI18n: {
      ru: 'Характеристики ликёра',
    },
    attributesIds: [],
  },
  {
    _id: getObjectId('attributesGroup Характеристики водки'),
    nameI18n: {
      ru: 'Характеристики водки',
    },
    attributesIds: [],
  },
  {
    _id: getObjectId('attributesGroup Характеристики виски'),
    nameI18n: {
      ru: 'Характеристики виски',
    },
    attributesIds: getObjectIds([`attribute Тип виски`]),
  },
  {
    _id: getObjectId('attributesGroup Характеристики вина'),
    nameI18n: {
      ru: 'Характеристики вина',
    },
    attributesIds: getObjectIds([`attribute Тип вина`]),
  },
  {
    _id: getObjectId('attributesGroup Характеристики воды'),
    nameI18n: {
      ru: 'Характеристики воды',
    },
    attributesIds: getObjectIds([`attribute Газ`]),
  },
];

// @ts-ignore
export = attributesGroups;
