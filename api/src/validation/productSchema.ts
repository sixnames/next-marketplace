import * as Yup from 'yup';
import { id, langStringInputSchema, minPrice } from './schemaTemplates';

export const productAttributeSchema = Yup.object().shape({
  showInCard: Yup.boolean().required(
    'Поле Показывать атрибут в карточке товара обязательно к заполнению',
  ),
  node: Yup.string().required('Поле ID атрибута обязательно к заполнению'),
  key: Yup.string().required('Поле Ключ атрибута обязательно к заполнению'),
  value: Yup.array().of(Yup.string().required('Поле Значение атрибута обязательно к заполнению')),
});

export const productAttributesGroupSchema = Yup.object().shape({
  showInCard: Yup.boolean().required(
    'Поле Показывать группу атрибутов в карточке товара обязательно к заполнению',
  ),
  node: Yup.string().required('Поле ID группы атрибутов обязательно к заполнению'),
  attributes: Yup.array().of(productAttributeSchema),
});

const productCommonFields = (defaultLang: string) => ({
  name: langStringInputSchema({ defaultLang, entityMessage: 'Название товара' }),
  cardName: langStringInputSchema({ defaultLang, entityMessage: 'Название карточки товара' }),
  description: langStringInputSchema({ defaultLang, entityMessage: 'Описание товара' }),
  rubrics: Yup.array().of(Yup.string().required('Рубрики обязательны к заполнению')),
  price: Yup.number()
    .min(minPrice, `Цена должна быть выше ${minPrice}`)
    .required('Цена обязательна к заполнению'),
  attributesGroups: Yup.array()
    .of(productAttributesGroupSchema)
    .required('Поле Группы атрибутов обязательно к заполнению'),
  assets: Yup.array().of(Yup.mixed()).required('Поле Изображения товара обязательно к заполнению'),
});

export const createProductSchema = (defaultLang: string) =>
  Yup.object().shape({
    ...productCommonFields(defaultLang),
  });

export const updateProductSchema = (defaultLang: string) =>
  Yup.object().shape({
    id,
    ...productCommonFields(defaultLang),
  });
