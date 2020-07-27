import { DEFAULT_LANG, SECONDARY_LANG } from '../common';
import { MessageInterface } from './messagesKeys';

const metricsMessages: MessageInterface[] = [
  {
    key: 'metrics.create.duplicate',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Тип измерения с таким именем уже существует.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Metric with same name is already exists.',
      },
    ],
  },
  {
    key: 'metrics.create.error',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка создания типа измерения.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Metric creation error.',
      },
    ],
  },
  {
    key: 'metrics.create.success',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Тип измерения создан.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Metric created.',
      },
    ],
  },
  {
    key: 'metrics.update.duplicate',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Тип измерения с таким именем уже существует.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Metric with same name is already exists.',
      },
    ],
  },
  {
    key: 'metrics.update.error',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка обновления типа измерения.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Metric update error.',
      },
    ],
  },
  {
    key: 'metrics.update.success',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Тип измерения обновлён.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Metric updated.',
      },
    ],
  },
  {
    key: 'metrics.delete.used',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Тип измерения используется в атрибутах, его нельзя удалить.',
      },
      {
        key: SECONDARY_LANG,
        value: `Metric is used in attributes. You can't delete it.`,
      },
    ],
  },
  {
    key: 'metrics.delete.error',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка удаления типа измерения.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Metric delete error.',
      },
    ],
  },
  {
    key: 'metrics.delete.success',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Тип измерения удалён.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Metric deleted.',
      },
    ],
  },
];

export default metricsMessages;
