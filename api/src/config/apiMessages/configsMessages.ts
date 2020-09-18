import { DEFAULT_LANG, SECONDARY_LANG } from '../common';
import { MessageInterface } from './messagesKeys';

const configsMessages: MessageInterface[] = [
  {
    key: 'configs.update.success',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Настройки обновлены',
      },
      {
        key: SECONDARY_LANG,
        value: 'Config is updated',
      },
    ],
  },
  {
    key: 'configs.update.error',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка обновления настройки',
      },
      {
        key: SECONDARY_LANG,
        value: 'Config update error',
      },
    ],
  },
  {
    key: 'configs.updateAsset.notFound',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Настройка не найдена',
      },
      {
        key: SECONDARY_LANG,
        value: 'Config item not found',
      },
    ],
  },
  {
    key: 'configs.updateAsset.error',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка обновления настройки',
      },
      {
        key: SECONDARY_LANG,
        value: 'Config update error',
      },
    ],
  },
  {
    key: 'configs.updateAsset.success',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Настройка обновлена',
      },
      {
        key: SECONDARY_LANG,
        value: 'Config is updated',
      },
    ],
  },
  {
    key: 'validation.configs.id',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'ID настройки обязательно к заполнению',
      },
      {
        key: SECONDARY_LANG,
        value: 'Config ID is required',
      },
    ],
  },
  {
    key: 'validation.configs.value',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Значение настройки обязательно к заполнению',
      },
      {
        key: SECONDARY_LANG,
        value: 'Config value is required',
      },
    ],
  },
  {
    key: 'validation.configs.translation',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Значение мультиязычной настройки обязательно к заполнению',
      },
      {
        key: SECONDARY_LANG,
        value: 'Config multi lang value is required',
      },
    ],
  },
  {
    key: 'validation.configs.cityKey',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ключ города обязателен к заполнению',
      },
      {
        key: SECONDARY_LANG,
        value: 'City key is required',
      },
    ],
  },
];

export default configsMessages;
