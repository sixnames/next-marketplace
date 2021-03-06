import { MessageBaseInterface } from '../../db/uiInterfaces';
import { DEFAULT_LOCALE, SECONDARY_LOCALE } from '../../lib/config/common';

export const metricsMessages: MessageBaseInterface[] = [
  {
    slug: 'metrics.create.duplicate',
    messageI18n: {
      [DEFAULT_LOCALE]: `Тип измерения с таким именем уже существует.`,
      [SECONDARY_LOCALE]: `Metric with same name is already exists.`,
    },
  },
  {
    slug: 'metrics.create.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка создания типа измерения.`,
      [SECONDARY_LOCALE]: `Metric creation error.`,
    },
  },
  {
    slug: 'metrics.create.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Тип измерения создан.`,
      [SECONDARY_LOCALE]: `Metric created.`,
    },
  },
  {
    slug: 'metrics.update.duplicate',
    messageI18n: {
      [DEFAULT_LOCALE]: `Тип измерения с таким именем уже существует.`,
      [SECONDARY_LOCALE]: `Metric with same name is already exists.`,
    },
  },
  {
    slug: 'metrics.update.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка обновления типа измерения.`,
      [SECONDARY_LOCALE]: `Metric update error.`,
    },
  },
  {
    slug: 'metrics.update.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Тип измерения обновлён.`,
      [SECONDARY_LOCALE]: `Metric updated.`,
    },
  },
  {
    slug: 'metrics.delete.used',
    messageI18n: {
      [DEFAULT_LOCALE]: `Тип измерения используется в атрибутах, его нельзя удалить.`,
      [SECONDARY_LOCALE]: `Metric is used in attributes. You can't delete it.`,
    },
  },
  {
    slug: 'metrics.delete.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка удаления типа измерения.`,
      [SECONDARY_LOCALE]: `Metric delete error.`,
    },
  },
  {
    slug: 'metrics.delete.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Тип измерения удалён.`,
      [SECONDARY_LOCALE]: `Metric deleted.`,
    },
  },

  // validation
  {
    slug: 'validation.metrics.id',
    messageI18n: {
      [DEFAULT_LOCALE]: `ID единицы измерения обязателен к заполнению`,
      [SECONDARY_LOCALE]: `Metric ID is required.`,
    },
  },
  {
    slug: 'validation.metrics.name',
    messageI18n: {
      [DEFAULT_LOCALE]: `Название единицы измерения обязателен к заполнению`,
      [SECONDARY_LOCALE]: `Metric name is required.`,
    },
  },
];
