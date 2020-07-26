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
  {
    key: 'validation.products.id',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'ID товара обязателен для заполнения.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Product ID is required.',
      },
    ],
  },
  {
    key: 'validation.products.name',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Название товара обязательно для заполнения.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Product Name is required.',
      },
    ],
  },
  {
    key: 'validation.products.cardName',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Название карточки товара обязательно для заполнения.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Product Card name is required.',
      },
    ],
  },
  {
    key: 'validation.products.description',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Описание товара обязательно для заполнения.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Product Description is required.',
      },
    ],
  },
  {
    key: 'validation.products.rubrics',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Рубрики товара обязательны для заполнения.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Product Description is required.',
      },
    ],
  },
  {
    key: 'validation.products.price',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Цена товара обязательна для заполнения.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Product Price is required.',
      },
    ],
  },
  {
    key: 'validation.products.attributesGroupId',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'ID группы атрибутов товара обязательно для заполнения.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Product attributes group ID is required.',
      },
    ],
  },
  {
    key: 'validation.products.attributeId',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'ID атрибута товара обязательно для заполнения.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Product attribute ID is required.',
      },
    ],
  },
  {
    key: 'validation.products.attributeKey',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ключ атрибута товара обязателен для заполнения.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Product attribute key is required.',
      },
    ],
  },
  {
    key: 'validation.products.assets',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Изображения товара обязательны к заполнению.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Product images is required.',
      },
    ],
  },
];

export default productsMessages;
