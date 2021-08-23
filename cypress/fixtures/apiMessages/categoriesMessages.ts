import { DEFAULT_LOCALE, SECONDARY_LOCALE } from '../../../config/common';
import { MessageBaseInterface } from '../../../db/uiInterfaces';

export const categoriesMessages: MessageBaseInterface[] = [
  {
    slug: 'categories.create.duplicate',
    messageI18n: {
      [DEFAULT_LOCALE]: `Категория с таким именем уже существует.`,
      [SECONDARY_LOCALE]: `Category with same name is already exists.`,
    },
  },
  {
    slug: 'categories.create.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка создания категории.`,
      [SECONDARY_LOCALE]: `Category creation error.`,
    },
  },
  {
    slug: 'categories.create.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Категория создана.`,
      [SECONDARY_LOCALE]: `Category created.`,
    },
  },
  {
    slug: 'categories.update.notFound',
    messageI18n: {
      [DEFAULT_LOCALE]: `Категория не найдена.`,
      [SECONDARY_LOCALE]: `Category not found.`,
    },
  },
  {
    slug: 'categories.update.duplicate',
    messageI18n: {
      [DEFAULT_LOCALE]: `Категория с таким именем уже существует.`,
      [SECONDARY_LOCALE]: `Category with same name is already exists.`,
    },
  },
  {
    slug: 'categories.update.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка обновления категории.`,
      [SECONDARY_LOCALE]: `Category update error.`,
    },
  },
  {
    slug: 'categories.update.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Категория обновлена.`,
      [SECONDARY_LOCALE]: `Category updated.`,
    },
  },
  {
    slug: 'categories.delete.notFound',
    messageI18n: {
      [DEFAULT_LOCALE]: `Категория не найдена.`,
      [SECONDARY_LOCALE]: `Category not found.`,
    },
  },
  {
    slug: 'categories.delete.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка удаления категории.`,
      [SECONDARY_LOCALE]: `Category delete error.`,
    },
  },
  {
    slug: 'categories.delete.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Категория удалена.`,
      [SECONDARY_LOCALE]: `Category deleted.`,
    },
  },
  {
    slug: 'categories.addAttributesGroup.notFound',
    messageI18n: {
      [DEFAULT_LOCALE]: `Группа атрибутов или Категория не найдены.`,
      [SECONDARY_LOCALE]: `Category or attributes group not found.`,
    },
  },
  {
    slug: 'categories.addAttributesGroup.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка добавления Группы атрибутов в категорию.`,
      [SECONDARY_LOCALE]: `Add attributes group to rubric error.`,
    },
  },
  {
    slug: 'categories.addAttributesGroup.noAttributes',
    messageI18n: {
      [DEFAULT_LOCALE]: `В выбранной группе нет атрибутов.`,
      [SECONDARY_LOCALE]: `There is no attributes in selected group.`,
    },
  },
  {
    slug: 'categories.addAttributesGroup.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Группа атрибутов добавлена в категорию.`,
      [SECONDARY_LOCALE]: `Attributes group added to the rubric.`,
    },
  },
  {
    slug: 'categories.updateAttributesGroup.notFound',
    messageI18n: {
      [DEFAULT_LOCALE]: `Группа атрибутов или Категория не найдены.`,
      [SECONDARY_LOCALE]: `Category or attributes group not found.`,
    },
  },
  {
    slug: 'categories.updateAttributesGroup.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка обновления Группы атрибутов в категории.`,
      [SECONDARY_LOCALE]: `Update attributes group error.`,
    },
  },
  {
    slug: 'categories.updateAttributesGroup.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Группа атрибутов обновлена.`,
      [SECONDARY_LOCALE]: `Attributes group updated.`,
    },
  },
  {
    slug: 'categories.deleteAttributesGroup.notFound',
    messageI18n: {
      [DEFAULT_LOCALE]: `Группа атрибутов или Категория не найдены.`,
      [SECONDARY_LOCALE]: `Category or attributes group not found.`,
    },
  },
  {
    slug: 'categories.deleteAttributesGroup.ownerError',
    messageI18n: {
      [DEFAULT_LOCALE]: `Группу атрибутов нельзя удалить т.к. категория не является владельцем.`,
      [SECONDARY_LOCALE]: `You can't delete attributes group from not owner rubric`,
    },
  },
  {
    slug: 'categories.deleteAttributesGroup.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка удаления Группы атрибутов из категории.`,
      [SECONDARY_LOCALE]: `Delete attributes group from rubric error.`,
    },
  },
  {
    slug: 'categories.deleteAttributesGroup.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Группа атрибутов удалена из категории.`,
      [SECONDARY_LOCALE]: `Attributes group removed from rubric.`,
    },
  },
  {
    slug: 'categories.addProduct.notFound',
    messageI18n: {
      [DEFAULT_LOCALE]: `Товар или Категория не найдены.`,
      [SECONDARY_LOCALE]: `Category or product not found.`,
    },
  },
  {
    slug: 'categories.addProduct.exists',
    messageI18n: {
      [DEFAULT_LOCALE]: `Товар уже присутствует в группе.`,
      [SECONDARY_LOCALE]: `Product already exists in this group.`,
    },
  },
  {
    slug: 'categories.addProduct.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка добавления товара в категорию.`,
      [SECONDARY_LOCALE]: `Add product to rubric error.`,
    },
  },
  {
    slug: 'categories.addProduct.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Товар добавлен в категорию.`,
      [SECONDARY_LOCALE]: `Product added to the rubric.`,
    },
  },
  {
    slug: 'categories.deleteProduct.notFound',
    messageI18n: {
      [DEFAULT_LOCALE]: `Товар или Категория не найдены.`,
      [SECONDARY_LOCALE]: `Category or product not found.`,
    },
  },
  {
    slug: 'categories.deleteProduct.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка удаления товара из категории.`,
      [SECONDARY_LOCALE]: `Delete product from rubric error.`,
    },
  },
  {
    slug: 'categories.deleteProduct.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Товар удалён из категории.`,
      [SECONDARY_LOCALE]: `Product removed from rubric.`,
    },
  },
  {
    slug: 'validation.categories.id',
    messageI18n: {
      [DEFAULT_LOCALE]: `ID категории обязательно к заполнению.`,
      [SECONDARY_LOCALE]: `Category ID is required.`,
    },
  },
  {
    slug: 'validation.categories.name',
    messageI18n: {
      [DEFAULT_LOCALE]: `Название категории обязательно к заполнению.`,
      [SECONDARY_LOCALE]: `Category Name is required.`,
    },
  },
  {
    slug: 'validation.categories.description',
    messageI18n: {
      [DEFAULT_LOCALE]: `Описание категории обязательно к заполнению.`,
      [SECONDARY_LOCALE]: `Category description is required.`,
    },
  },
  {
    slug: 'validation.categories.shortDescription',
    messageI18n: {
      [DEFAULT_LOCALE]: `Короткое описание категории обязательно к заполнению.`,
      [SECONDARY_LOCALE]: `Category short description is required.`,
    },
  },
  {
    slug: 'validation.categories.variant',
    messageI18n: {
      [DEFAULT_LOCALE]: `Тип рубрики обязателен к заполнению.`,
      [SECONDARY_LOCALE]: `Category Variant is required.`,
    },
  },
  {
    slug: 'validation.categories.defaultTitle',
    messageI18n: {
      [DEFAULT_LOCALE]: `Заголовок каталога обязателен к заполнению.`,
      [SECONDARY_LOCALE]: `Category catalogue default title is required.`,
    },
  },
  {
    slug: 'validation.categories.keyword',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ключевое слово категории обязательно к заполнению.`,
      [SECONDARY_LOCALE]: `Category keyword is required.`,
    },
  },
  {
    slug: 'validation.categories.gender',
    messageI18n: {
      [DEFAULT_LOCALE]: `Род ключевого слова обязателен к заполнению.`,
      [SECONDARY_LOCALE]: `Category keyword gender is required.`,
    },
  },
];
