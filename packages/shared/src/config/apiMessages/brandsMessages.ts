import { DEFAULT_LANG, SECONDARY_LANG } from '../common';
import { MessageInterface } from './messagesKeys';

export const brandsMessages: MessageInterface[] = [
  {
    key: 'brands.create.duplicate',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Бренд с указанным именем уже существует.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Brand with same name is already exists.',
      },
    ],
  },
  {
    key: 'brands.create.error',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка создания бренда.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Brand creation error.',
      },
    ],
  },
  {
    key: 'brands.create.success',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Бренд создан.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Brand created.',
      },
    ],
  },
  {
    key: 'brands.update.duplicate',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Бренд с указанным именем уже существует.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Brand with same name is already exists.',
      },
    ],
  },
  {
    key: 'brands.update.notFound',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Бренд не найден.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Brand not found.',
      },
    ],
  },
  {
    key: 'brands.update.error',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка обновления бренда.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Brand update error.',
      },
    ],
  },
  {
    key: 'brands.update.success',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Бренд обновлён.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Brand updated.',
      },
    ],
  },
  {
    key: 'brands.delete.notFound',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Бренд не найден.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Brand not found.',
      },
    ],
  },
  {
    key: 'brands.delete.used',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Бренд используется в товарах.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Brand is used in products.',
      },
    ],
  },
  {
    key: 'brands.delete.error',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка удаления бренда.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Brand delete error.',
      },
    ],
  },
  {
    key: 'brands.delete.success',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Бренд удалён.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Brand removed.',
      },
    ],
  },
  {
    key: 'validation.brands.id',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'ID бренда обязательно.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Brand ID is required.',
      },
    ],
  },
  {
    key: 'validation.brands.name',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Название бренда обязательно.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Brand name is required.',
      },
    ],
  },
  {
    key: 'validation.brands.url',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ссылка на сайт бренда обязательна.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Brand url is required.',
      },
    ],
  },
  {
    key: 'validation.brands.description',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Описание бренда обязательно.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Brand description is required.',
      },
    ],
  },
];
