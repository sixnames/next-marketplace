import * as Yup from 'yup';
import { id, langInput, notNullableName } from './templates';

export const createOptionsGroupSchema = Yup.object().shape({
  name: langInput(notNullableName('Название группы опций')),
});

export const updateOptionsGroupSchema = Yup.object().shape({
  id,
  name: langInput(notNullableName('Название группы опций')),
});
