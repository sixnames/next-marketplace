import { DEFAULT_LOCALE, SECONDARY_LOCALE } from '../../config/common';
import { MessageBaseInterface } from '../../db/uiInterfaces';

export const shopsMessages: MessageBaseInterface[] = [
  {
    slug: 'shops.create.duplicate',
    messageI18n: {
      [DEFAULT_LOCALE]: `Магазин с таким названием уже существует.`,
      [SECONDARY_LOCALE]: `Shop already exist.`,
    },
  },
  {
    slug: 'shops.create.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка создания магазина.`,
      [SECONDARY_LOCALE]: `Shop creation error.`,
    },
  },
  {
    slug: 'shops.create.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Магазин создан.`,
      [SECONDARY_LOCALE]: `Shop created.`,
    },
  },
  {
    slug: 'shops.update.notFound',
    messageI18n: {
      [DEFAULT_LOCALE]: `Магазин не найден.`,
      [SECONDARY_LOCALE]: `Shop not found.`,
    },
  },
  {
    slug: 'shops.update.duplicate',
    messageI18n: {
      [DEFAULT_LOCALE]: `Магазин с таким названием уже существует.`,
      [SECONDARY_LOCALE]: `Shop already exist.`,
    },
  },
  {
    slug: 'shops.update.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка обновления магазина.`,
      [SECONDARY_LOCALE]: `Shop update error.`,
    },
  },
  {
    slug: 'shops.update.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Магазин обновлен.`,
      [SECONDARY_LOCALE]: `Shop updated.`,
    },
  },
  {
    slug: 'shops.delete.notFound',
    messageI18n: {
      [DEFAULT_LOCALE]: `Магазин не найден.`,
      [SECONDARY_LOCALE]: `Shop not found.`,
    },
  },
  {
    slug: 'shops.delete.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка удаления магазина.`,
      [SECONDARY_LOCALE]: `Shop delete error.`,
    },
  },
  {
    slug: 'shops.delete.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Магазин удален.`,
      [SECONDARY_LOCALE]: `Shop removed.`,
    },
  },
  {
    slug: 'shops.addProduct.duplicate',
    messageI18n: {
      [DEFAULT_LOCALE]: `Товар уже присутствует в магазине.`,
      [SECONDARY_LOCALE]: `Product already exist.`,
    },
  },
  {
    slug: 'shops.addProduct.notFound',
    messageI18n: {
      [DEFAULT_LOCALE]: `Товар или магазин не найден.`,
      [SECONDARY_LOCALE]: `Product or shop not found.`,
    },
  },
  {
    slug: 'shops.addProduct.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка добавления товара в магазин.`,
      [SECONDARY_LOCALE]: `Add product to the shop error.`,
    },
  },
  {
    slug: 'shops.addProduct.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Товар добавлен в магазин.`,
      [SECONDARY_LOCALE]: `Product added to the shop.`,
    },
  },
  {
    slug: 'shops.deleteProduct.notFound',
    messageI18n: {
      [DEFAULT_LOCALE]: `Товар или магазин не найдены.`,
      [SECONDARY_LOCALE]: `Product or shop not found.`,
    },
  },
  {
    slug: 'shops.deleteProduct.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка удаления товара из магазина.`,
      [SECONDARY_LOCALE]: `Delete product from shop error.`,
    },
  },
  {
    slug: 'shops.deleteProduct.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Товар удалён из магазина.`,
      [SECONDARY_LOCALE]: `Product removed from the shop.`,
    },
  },
  {
    slug: 'validation.shops.id',
    messageI18n: {
      [DEFAULT_LOCALE]: `ID магазина обязательно к заполнению.`,
      [SECONDARY_LOCALE]: `Shop ID is required.`,
    },
  },
  {
    slug: 'validation.shops.nameString',
    messageI18n: {
      [DEFAULT_LOCALE]: `Название обязательно к заполнению.`,
      [SECONDARY_LOCALE]: `Shop name is required.`,
    },
  },
  {
    slug: 'validation.shops.city',
    messageI18n: {
      [DEFAULT_LOCALE]: `Город обязателен к заполнению.`,
      [SECONDARY_LOCALE]: `Shop city is required.`,
    },
  },
  {
    slug: 'validation.shops.assets',
    messageI18n: {
      [DEFAULT_LOCALE]: `Фото магазина обязательны к заполнению.`,
      [SECONDARY_LOCALE]: `Shop assets is required.`,
    },
  },
  {
    slug: 'validation.shops.address',
    messageI18n: {
      [DEFAULT_LOCALE]: `Адрес магазина обязателен к заполнению.`,
      [SECONDARY_LOCALE]: `Shop address is required.`,
    },
  },
  {
    slug: 'validation.shops.logo',
    messageI18n: {
      [DEFAULT_LOCALE]: `Логотип магазина обязателен к заполнению.`,
      [SECONDARY_LOCALE]: `Shop logo is required.`,
    },
  },
  {
    slug: 'validation.shops.products',
    messageI18n: {
      [DEFAULT_LOCALE]: `Товары магазина обязательны к заполнению.`,
      [SECONDARY_LOCALE]: `Shop products is required.`,
    },
  },
];
