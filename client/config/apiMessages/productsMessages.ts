import { DEFAULT_LANG, SECONDARY_LANG } from '../common';
import { MessageInterface } from './messagesKeys';

const productsMessages: MessageInterface[] = [
  {
    key: 'products.create.duplicate',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Товар с указанным именем уже существует.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Product with same name is already exists.',
      },
    ],
  },
  {
    key: 'products.create.error',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка создания товара.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Product creation error.',
      },
    ],
  },
  {
    key: 'products.create.success',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Товар создан.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Product created.',
      },
    ],
  },
  {
    key: 'products.update.duplicate',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Товар с указанным именем уже существует.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Product with same name is already exists.',
      },
    ],
  },
  {
    key: 'products.update.notFound',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Товар не найден.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Product not found.',
      },
    ],
  },
  {
    key: 'products.update.error',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка обновления товара.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Product update error.',
      },
    ],
  },
  {
    key: 'products.update.success',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Товар обновлён.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Product updated.',
      },
    ],
  },
  {
    key: 'products.delete.notFound',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Товар не найден.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Product not found.',
      },
    ],
  },
  {
    key: 'products.delete.error',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка удаления товара.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Product delete error.',
      },
    ],
  },
  {
    key: 'products.delete.success',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Товар удалён.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Product removed.',
      },
    ],
  },
];

export default productsMessages;
