import { DEFAULT_LOCALE, SECONDARY_LOCALE } from '../../../config/common';
import { MessageBaseInterface } from '../../../db/uiInterfaces';

export const rubricVariantsMessages: MessageBaseInterface[] = [
  {
    slug: 'rubricVariants.create.duplicate',
    messageI18n: {
      [DEFAULT_LOCALE]: `Тип рубрики с таким именем уже существует.`,
      [SECONDARY_LOCALE]: `Rubric variant with same name is already exists.`,
    },
  },
  {
    slug: 'rubricVariants.create.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка создания типа рубрики.`,
      [SECONDARY_LOCALE]: `Rubric variant creation error.`,
    },
  },
  {
    slug: 'rubricVariants.create.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Тип рубрики создан.`,
      [SECONDARY_LOCALE]: `Rubric variant created.`,
    },
  },
  {
    slug: 'rubricVariants.update.duplicate',
    messageI18n: {
      [DEFAULT_LOCALE]: `Тип рубрики с таким именем уже существует.`,
      [SECONDARY_LOCALE]: `Rubric variant with same name is already exists.`,
    },
  },
  {
    slug: 'rubricVariants.update.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка обновления типа рубрики.`,
      [SECONDARY_LOCALE]: `Rubric variant update error.`,
    },
  },
  {
    slug: 'rubricVariants.update.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Тип рубрики обновлён.`,
      [SECONDARY_LOCALE]: `Rubric variant updated.`,
    },
  },
  {
    slug: 'rubricVariants.delete.used',
    messageI18n: {
      [DEFAULT_LOCALE]: `Тип рубрики используется в рубриках, его нельзя удалить.`,
      [SECONDARY_LOCALE]: `Rubric variant is used in rubrics. You can't delete it.`,
    },
  },
  {
    slug: 'rubricVariants.delete.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка удаления типа рубрики.`,
      [SECONDARY_LOCALE]: `Rubric variant delete error.`,
    },
  },
  {
    slug: 'rubricVariants.delete.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Тип рубрики удалён.`,
      [SECONDARY_LOCALE]: `Rubric variant deleted.`,
    },
  },
  {
    slug: 'validation.rubricVariants.id',
    messageI18n: {
      [DEFAULT_LOCALE]: `ID типа рубрики обязательно для заполнения.`,
      [SECONDARY_LOCALE]: `Rubric variant ID is required.`,
    },
  },
  {
    slug: 'validation.rubricVariants.name',
    messageI18n: {
      [DEFAULT_LOCALE]: `Название типа рубрики обязательно для заполнения.`,
      [SECONDARY_LOCALE]: `Rubric variant Name is required.`,
    },
  },
];
