import { DEFAULT_LOCALE, SECONDARY_LOCALE } from '../../config/common';
import { MessageBaseInterface } from '../../db/uiInterfaces';

export const shopProductsMessages: MessageBaseInterface[] = [
  {
    slug: 'shopProducts.create.duplicate',
    messageI18n: {
      [DEFAULT_LOCALE]: `Товар магазина с таким названием уже существует.`,
      [SECONDARY_LOCALE]: `Shop product already exist.`,
    },
  },
  {
    slug: 'shopProducts.create.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка создания товара в магазин.`,
      [SECONDARY_LOCALE]: `Shop product creation error.`,
    },
  },
  {
    slug: 'shopProducts.create.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Товар магазина создан.`,
      [SECONDARY_LOCALE]: `Shop product created.`,
    },
  },
  {
    slug: 'shopProducts.update.notFound',
    messageI18n: {
      [DEFAULT_LOCALE]: `Товар магазина не найден.`,
      [SECONDARY_LOCALE]: `Shop product not found.`,
    },
  },
  {
    slug: 'shopProducts.update.duplicate',
    messageI18n: {
      [DEFAULT_LOCALE]: `Товар магазина уже существует.`,
      [SECONDARY_LOCALE]: `Shop product already exist.`,
    },
  },
  {
    slug: 'shopProducts.update.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка обновления товара магазина.`,
      [SECONDARY_LOCALE]: `Shop product update error.`,
    },
  },
  {
    slug: 'shopProducts.update.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Товар магазина обновлен.`,
      [SECONDARY_LOCALE]: `Shop product updated.`,
    },
  },
  {
    slug: 'shopProducts.delete.notFound',
    messageI18n: {
      [DEFAULT_LOCALE]: `Товар магазина не найден.`,
      [SECONDARY_LOCALE]: `Shop product not found.`,
    },
  },
  {
    slug: 'shopProducts.delete.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка удаления товара магазина.`,
      [SECONDARY_LOCALE]: `Shop product delete error.`,
    },
  },
  {
    slug: 'shopProducts.delete.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Товар магазина удален.`,
      [SECONDARY_LOCALE]: `Shop product removed.`,
    },
  },
  {
    slug: 'validation.shopProducts.id',
    messageI18n: {
      [DEFAULT_LOCALE]: `ID товара магазина обязательно к заполнению.`,
      [SECONDARY_LOCALE]: `Shop product ID is required.`,
    },
  },
  {
    slug: 'validation.shopProducts.available',
    messageI18n: {
      [DEFAULT_LOCALE]: `Наличие обязательно к заполнению.`,
      [SECONDARY_LOCALE]: `Shop product availability is required.`,
    },
  },
  {
    slug: 'validation.shopProducts.price',
    messageI18n: {
      [DEFAULT_LOCALE]: `Цена товара магазина обязательна к заполнению.`,
      [SECONDARY_LOCALE]: `Shop product price is required.`,
    },
  },
  {
    slug: 'validation.shopProducts.product',
    messageI18n: {
      [DEFAULT_LOCALE]: `ID товара из каталога обязательно к заполнению.`,
      [SECONDARY_LOCALE]: `Catalogue product ID is required.`,
    },
  },
];
