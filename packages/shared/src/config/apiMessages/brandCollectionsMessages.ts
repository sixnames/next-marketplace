import { DEFAULT_LANG, SECONDARY_LANG } from '../common';
import { MessageInterface } from './messagesKeys';

export const brandCollectionsMessages: MessageInterface[] = [
  {
    key: 'brandCollections.create.duplicate',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Коллекция бренда с указанным именем уже существует.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Brand collection with same name is already exists.',
      },
    ],
  },
  {
    key: 'brandCollections.create.error',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка создания коллекции бренда.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Brand collection creation error.',
      },
    ],
  },
  {
    key: 'brandCollections.create.success',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Коллекция бренда создана.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Brand collection created.',
      },
    ],
  },
  {
    key: 'brandCollections.update.duplicate',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Коллекция бренда с указанным именем уже существует.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Brand collection with same name is already exists.',
      },
    ],
  },
  {
    key: 'brandCollections.update.notFound',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Коллекция бренда не найдена.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Brand collection not found.',
      },
    ],
  },
  {
    key: 'brandCollections.update.error',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка обновления коллекции бренда.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Brand collection update error.',
      },
    ],
  },
  {
    key: 'brandCollections.update.success',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Коллекция бренда обновлена.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Brand collection updated.',
      },
    ],
  },
  {
    key: 'brandCollections.delete.notFound',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Коллекция бренда не найдена.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Brand collection not found.',
      },
    ],
  },
  {
    key: 'brandCollections.delete.used',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Коллекция бренда используется в товарах.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Brand collection is used in products.',
      },
    ],
  },
  {
    key: 'brandCollections.delete.error',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка удаления коллекции бренда.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Brand collection delete error.',
      },
    ],
  },
  {
    key: 'brandCollections.delete.success',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Коллекция бренда удалена.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Brand collection removed.',
      },
    ],
  },
  {
    key: 'validation.brandCollections.id',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'ID коллекции бренда обязательно.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Brand collection ID is required.',
      },
    ],
  },
  {
    key: 'validation.brandCollections.name',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Название коллекции бренда обязательно.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Brand collection name is required.',
      },
    ],
  },
  {
    key: 'validation.brandCollections.description',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Описание коллекции бренда обязательно.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Brand collection description is required.',
      },
    ],
  },
];
