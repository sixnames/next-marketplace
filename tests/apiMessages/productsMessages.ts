import { MessageBaseInterface } from 'db/uiInterfaces';
import { DEFAULT_LOCALE, SECONDARY_LOCALE } from 'lib/config/common';

export const productsMessages: MessageBaseInterface[] = [
  {
    slug: 'products.create.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка создания товара.`,
      [SECONDARY_LOCALE]: `Product creation error.`,
    },
  },
  {
    slug: 'products.create.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Товар создан.`,
      [SECONDARY_LOCALE]: `Product created.`,
    },
  },
  {
    slug: 'products.update.notFound',
    messageI18n: {
      [DEFAULT_LOCALE]: `Товар не найден.`,
      [SECONDARY_LOCALE]: `Product not found.`,
    },
  },
  {
    slug: 'products.update.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка обновления товара.`,
      [SECONDARY_LOCALE]: `Product update error.`,
    },
  },
  {
    slug: 'products.variant.exist',
    messageI18n: {
      [DEFAULT_LOCALE]: `Связь уже существует.`,
      [SECONDARY_LOCALE]: `Connection already exist.`,
    },
  },
  {
    slug: 'products.variant.createError',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка создания связи.`,
      [SECONDARY_LOCALE]: `Connection creation error.`,
    },
  },
  {
    slug: 'products.variant.updateError',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка обновления связи.`,
      [SECONDARY_LOCALE]: `Connection update error.`,
    },
  },
  {
    slug: 'products.variant.deleteError',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка удаления связи.`,
      [SECONDARY_LOCALE]: `Connection delete error.`,
    },
  },
  {
    slug: 'products.variant.noAttributeError',
    messageI18n: {
      [DEFAULT_LOCALE]: `У добавляемого товара отсутствует необходимый атрибут.`,
      [SECONDARY_LOCALE]: `Required attribute is not added to the chosen product.`,
    },
  },
  {
    slug: 'products.variant.createSuccess',
    messageI18n: {
      [DEFAULT_LOCALE]: `Связь создана.`,
      [SECONDARY_LOCALE]: `Connection created.`,
    },
  },
  {
    slug: 'products.variant.addProductSuccess',
    messageI18n: {
      [DEFAULT_LOCALE]: `Товар добавлен в связь.`,
      [SECONDARY_LOCALE]: `Connection product added.`,
    },
  },
  {
    slug: 'products.variant.deleteProductSuccess',
    messageI18n: {
      [DEFAULT_LOCALE]: `Товар удалён из связи.`,
      [SECONDARY_LOCALE]: `Connection product removed.`,
    },
  },
  {
    slug: 'products.variant.intersect',
    messageI18n: {
      [DEFAULT_LOCALE]: `Значение атрибута добавляемого товара пересекается со значениями в связи.`,
      [SECONDARY_LOCALE]: `Chosen product attribute value intersects with variant values.`,
    },
  },
  {
    slug: 'products.update.attributeVariantError',
    messageI18n: {
      [DEFAULT_LOCALE]: `Атрибут должен иметь тип Селект.`,
      [SECONDARY_LOCALE]: `Attribute has to be Select variant.`,
    },
  },
  {
    slug: 'products.update.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Товар обновлён.`,
      [SECONDARY_LOCALE]: `Product updated.`,
    },
  },
  {
    slug: 'products.delete.notFound',
    messageI18n: {
      [DEFAULT_LOCALE]: `Товар не найден.`,
      [SECONDARY_LOCALE]: `Product not found.`,
    },
  },
  {
    slug: 'products.delete.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка удаления товара.`,
      [SECONDARY_LOCALE]: `Product delete error.`,
    },
  },
  {
    slug: 'products.delete.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Товар удалён.`,
      [SECONDARY_LOCALE]: `Product removed.`,
    },
  },
  {
    slug: 'validation.products.id',
    messageI18n: {
      [DEFAULT_LOCALE]: `ID товара обязательно.`,
      [SECONDARY_LOCALE]: `Product ID is required.`,
    },
  },
  {
    slug: 'validation.productConnections.id',
    messageI18n: {
      [DEFAULT_LOCALE]: `ID связи товара обязательно.`,
      [SECONDARY_LOCALE]: `Product variant ID is required.`,
    },
  },
  {
    slug: 'validation.products.name',
    messageI18n: {
      [DEFAULT_LOCALE]: `Название товара обязательно.`,
      [SECONDARY_LOCALE]: `Product name is required.`,
    },
  },
  {
    slug: 'validation.products.originalName',
    messageI18n: {
      [DEFAULT_LOCALE]: `Оригинальное название товара обязательно.`,
      [SECONDARY_LOCALE]: `Product original name is required.`,
    },
  },
  {
    slug: 'validation.products.cardName',
    messageI18n: {
      [DEFAULT_LOCALE]: `Название карточки товара обязательно.`,
      [SECONDARY_LOCALE]: `Product card name is required.`,
    },
  },
  {
    slug: 'validation.products.description',
    messageI18n: {
      [DEFAULT_LOCALE]: `Описание товара обязательно.`,
      [SECONDARY_LOCALE]: `Product description is required.`,
    },
  },
  {
    slug: 'validation.products.rubrics',
    messageI18n: {
      [DEFAULT_LOCALE]: `Рубрика товара обязательна.`,
      [SECONDARY_LOCALE]: `Product rubric is required.`,
    },
  },
  {
    slug: 'validation.products.manufacturer',
    messageI18n: {
      [DEFAULT_LOCALE]: `Производитель товара обязателен.`,
      [SECONDARY_LOCALE]: `Product manufacturer is required.`,
    },
  },
];
