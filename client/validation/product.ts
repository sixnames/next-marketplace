import * as Yup from 'yup';
import { id, langInput, minPrice, notNullableName } from './templates';

export const productAttributeSchema = Yup.object().shape({
  showInCard: Yup.boolean().required(
    'Поле Показывать атрибут в карточке товара обязательно к заполнению',
  ),
  node: Yup.string().required('Поле ID атрибута обязательно к заполнению'),
  key: Yup.number().required('Поле Ключ атрибута обязательно к заполнению'),
  value: Yup.array().of(Yup.string().required('Поле Значение атрибута обязательно к заполнению')),
});

export const productAttributesGroupSchema = Yup.object().shape({
  showInCard: Yup.boolean().required(
    'Поле Показывать группу атрибутов в карточке товара обязательно к заполнению',
  ),
  node: Yup.string().required('Поле ID группы атрибутов обязательно к заполнению'),
  attributes: Yup.array()
    .of(productAttributeSchema)
    .required('Поле Атрибуты в группе обязательно к заполнению'),
});

const productCommonFields = {
  name: langInput(notNullableName('Название товара')),
  cardName: langInput(notNullableName('Название карточки товара')),
  description: langInput(notNullableName('Описание товара')),
  rubrics: Yup.array().of(Yup.string().required('Рубрики обязательны к заполнению')),
  attributesSource: Yup.string().required('Источник аттрибутов обязателен к заполнению'),
  price: Yup.number()
    .min(minPrice, `Цена должна быть выше ${minPrice}`)
    .required('Цена обязательна к заполнению'),
  attributesGroups: Yup.array()
    .of(productAttributesGroupSchema)
    .required('Поле Группы атрибутов обязательно к заполнению'),
  assets: Yup.array().of(Yup.mixed()).required('Поле Изображения товара обязательно к заполнению'),
};

export const createProductSchema = Yup.object().shape({
  ...productCommonFields,
});

export const updateProductSchema = Yup.object().shape({
  id,
  ...productCommonFields,
});
