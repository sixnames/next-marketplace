import { OptionsGroupModel, OptionsGroupVariantModel } from 'db/dbModels';
import {
  OPTIONS_GROUP_VARIANT_COLOR,
  OPTIONS_GROUP_VARIANT_ICON,
  OPTIONS_GROUP_VARIANT_TEXT,
} from 'lib/config/common';
import { getObjectId } from 'mongo-seeding';

const optionsGroups: OptionsGroupModel[] = [
  {
    _id: getObjectId('optionsGroup Состав'),
    nameI18n: {
      ru: 'Состав',
    },
    variant: OPTIONS_GROUP_VARIANT_TEXT as OptionsGroupVariantModel,
  },
  {
    _id: getObjectId('optionsGroup Регион'),
    nameI18n: {
      ru: 'Регион',
    },
    variant: OPTIONS_GROUP_VARIANT_TEXT as OptionsGroupVariantModel,
  },
  {
    _id: getObjectId('optionsGroup Объем'),
    nameI18n: {
      ru: 'Объем',
    },
    variant: OPTIONS_GROUP_VARIANT_TEXT as OptionsGroupVariantModel,
  },
  {
    _id: getObjectId('optionsGroup Тип ёмкости'),
    nameI18n: {
      ru: 'Тип ёмкости',
    },
    variant: OPTIONS_GROUP_VARIANT_TEXT as OptionsGroupVariantModel,
  },
  {
    _id: getObjectId('optionsGroup Год'),
    nameI18n: {
      ru: 'Год',
    },
    variant: OPTIONS_GROUP_VARIANT_TEXT as OptionsGroupVariantModel,
  },
  {
    _id: getObjectId('optionsGroup Виноград'),
    nameI18n: {
      ru: 'Виноград',
    },
    variant: OPTIONS_GROUP_VARIANT_TEXT as OptionsGroupVariantModel,
  },
  {
    _id: getObjectId('optionsGroup Сахар'),
    nameI18n: {
      ru: 'Сахар',
    },
    variant: OPTIONS_GROUP_VARIANT_ICON as OptionsGroupVariantModel,
  },
  {
    _id: getObjectId('optionsGroup Тип вина'),
    nameI18n: {
      ru: 'Тип вина',
    },
    variant: OPTIONS_GROUP_VARIANT_COLOR as OptionsGroupVariantModel,
  },
  {
    _id: getObjectId('optionsGroup Сочетание'),
    nameI18n: {
      ru: 'Сочетание',
    },
    variant: OPTIONS_GROUP_VARIANT_ICON as OptionsGroupVariantModel,
  },
  {
    _id: getObjectId('optionsGroup Теги'),
    nameI18n: {
      ru: 'Теги',
    },
    variant: OPTIONS_GROUP_VARIANT_TEXT as OptionsGroupVariantModel,
  },
  {
    _id: getObjectId('optionsGroup Газ'),
    nameI18n: {
      ru: 'Газ',
    },
    variant: OPTIONS_GROUP_VARIANT_TEXT as OptionsGroupVariantModel,
  },
];

// @ts-ignore
export = optionsGroups;
