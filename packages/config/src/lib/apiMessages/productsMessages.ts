import { DEFAULT_LANG, SECONDARY_LANG } from '../common';
import { MessageInterface } from './messagesKeys';

export const productsMessages: MessageInterface[] = [
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
    key: 'products.update.attributeVariantError',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Атрибут должен иметь тип Селект.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Attribute has to be Select variant.',
      },
    ],
  },
  {
    key: 'products.update.attributesGroupNotFound',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Группа атрибутов не найдена.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Attributes group not found.',
      },
    ],
  },
  {
    key: 'products.update.attributeNotFound',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Атрибут не найден.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Attribute not found.',
      },
    ],
  },
  {
    key: 'products.update.attributeValueNotFound',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Значение атрибута не найдено.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Attribute value not found.',
      },
    ],
  },
  {
    key: 'products.update.allOptionsAreUsed',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'В связи использованы все опции.',
      },
      {
        key: SECONDARY_LANG,
        value: 'All options are used in this connection.',
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
        value: 'ID товара обязательно.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Product ID is required.',
      },
    ],
  },
  {
    key: 'validation.productConnections.id',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'ID связи товара обязательно.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Product connection ID is required.',
      },
    ],
  },
  {
    key: 'validation.products.name',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Название товара обязательно.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Product name is required.',
      },
    ],
  },
  {
    key: 'validation.products.cardName',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Название карточки товара обязательно.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Product card name is required.',
      },
    ],
  },
  {
    key: 'validation.products.description',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Описание товара обязательно.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Product description is required.',
      },
    ],
  },
  {
    key: 'validation.products.rubrics',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Рубрики товара обязательны.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Product rubrics is required.',
      },
    ],
  },
  {
    key: 'validation.products.price',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Цена товара обязательна.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Product price is required.',
      },
    ],
  },
  {
    key: 'validation.products.attributesGroupId',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'ID группы атрибутов обязательно.',
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
        value: 'ID атрибута обязательно.',
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
        value: 'Ключ атрибута обязателен.',
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
        value: 'Фото товара обязательно.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Product assets is required.',
      },
    ],
  },
];
