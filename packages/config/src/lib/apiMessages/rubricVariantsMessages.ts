import { DEFAULT_LANG, SECONDARY_LANG } from '../common';
import { MessageInterface } from './messagesKeys';

export const rubricVariantsMessages: MessageInterface[] = [
  {
    key: 'rubricVariants.create.duplicate',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Тип рубрики с таким именем уже существует.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Rubric variant with same name is already exists.',
      },
    ],
  },
  {
    key: 'rubricVariants.create.error',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка создания типа рубрики.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Rubric variant creation error.',
      },
    ],
  },
  {
    key: 'rubricVariants.create.success',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Тип рубрики создан.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Rubric variant created.',
      },
    ],
  },
  {
    key: 'rubricVariants.update.duplicate',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Тип рубрики с таким именем уже существует.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Rubric variant with same name is already exists.',
      },
    ],
  },
  {
    key: 'rubricVariants.update.error',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка обновления типа рубрики.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Rubric variant update error.',
      },
    ],
  },
  {
    key: 'rubricVariants.update.success',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Тип рубрики обновлён.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Rubric variant updated.',
      },
    ],
  },
  {
    key: 'rubricVariants.delete.used',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Тип рубрики используется в рубриках, его нельзя удалить.',
      },
      {
        key: SECONDARY_LANG,
        value: `Rubric variant is used in rubrics. You can't delete it.`,
      },
    ],
  },
  {
    key: 'rubricVariants.delete.error',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка удаления типа рубрики.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Rubric variant delete error.',
      },
    ],
  },
  {
    key: 'rubricVariants.delete.success',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Тип рубрики удалён.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Rubric variant deleted.',
      },
    ],
  },
  {
    key: 'validation.rubricVariants.id',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'ID типа рубрики обязательно для заполнения.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Rubric variant ID is required.',
      },
    ],
  },
  {
    key: 'validation.rubricVariants.name',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Название типа рубрики обязательно для заполнения.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Rubric variant Name is required.',
      },
    ],
  },
];
