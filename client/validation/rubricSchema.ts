import * as Yup from 'yup';
import { id, langStringInputSchema } from './schemaTemplates';
import { GENDER_ENUMS } from '../config';

const parent = Yup.string().nullable();
const variant = Yup.string()
  .nullable()
  .when('parent', {
    is: (val) => val,
    then: Yup.string().nullable(),
    otherwise: Yup.string().required('Типа рубрики обязателен к заполнению.'),
  });

const rubricId = Yup.string().nullable().required('ID рубрики обязательно к заполнению.');
const attributesGroupId = Yup.string()
  .nullable()
  .required('ID группы атрибутов обязательно к заполнению.');
const attributeId = Yup.string().nullable().required('ID атрибута обязательно к заполнению.');
const productId = Yup.string().nullable().required('ID товара обязательно к заполнению.');

const rubricCatalogueTitleSchema = (defaultLang: string) =>
  Yup.object().shape({
    defaultTitle: langStringInputSchema({ defaultLang, entityMessage: 'Название каталога' }),
    keyword: langStringInputSchema({ defaultLang, entityMessage: 'Ключевое слово каталога' }),
    prefix: langStringInputSchema({ defaultLang, required: false }),
    gender: Yup.mixed().oneOf(GENDER_ENUMS).required('Род рубрики обязателен к заполнению.'),
  });

export const createRubricInputSchema = (defaultLang: string) =>
  Yup.object().shape({
    name: langStringInputSchema({ defaultLang, entityMessage: 'Название рубрики' }),
    catalogueTitle: rubricCatalogueTitleSchema(defaultLang),
    parent,
    variant,
  });

export const updateRubricInputSchema = (defaultLang: string) =>
  Yup.object().shape({
    id,
    name: langStringInputSchema({ defaultLang, entityMessage: 'Название рубрики' }),
    catalogueTitle: rubricCatalogueTitleSchema(defaultLang),
    parent,
    variant,
  });

export const addAttributesGroupToRubricInputSchema = Yup.object().shape({
  rubricId,
  attributesGroupId,
});

export const deleteAttributesGroupFromRubricInputSchema = Yup.object().shape({
  rubricId,
  attributesGroupId,
});

export const updateAttributesGroupInRubricInputSchema = Yup.object().shape({
  rubricId,
  attributesGroupId,
  attributeId,
});

export const addProductToRubricInputSchema = Yup.object().shape({
  rubricId,
  productId,
});

export const deleteProductFromRubricInputSchema = Yup.object().shape({
  rubricId,
  productId,
});

export const addAttributesGroupToRubricSchema = Yup.object().shape({
  attributesGroupId,
});
