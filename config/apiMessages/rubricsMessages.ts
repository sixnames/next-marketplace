import { MessageType } from 'db/dbModels';
import { DEFAULT_LOCALE, SECONDARY_LOCALE } from 'config/common';

export const rubricsMessages: MessageType[] = [
  {
    slug: 'rubrics.create.duplicate',
    messageI18n: {
      [DEFAULT_LOCALE]: `Рубрика с таким именем уже существует.`,
      [SECONDARY_LOCALE]: `Rubric with same name is already exists.`,
    },
  },
  {
    slug: 'rubrics.create.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка создания рубрики.`,
      [SECONDARY_LOCALE]: `Rubric creation error.`,
    },
  },
  {
    slug: 'rubrics.create.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Рубрика создана.`,
      [SECONDARY_LOCALE]: `Rubric created.`,
    },
  },
  {
    slug: 'rubrics.update.notFound',
    messageI18n: {
      [DEFAULT_LOCALE]: `Рубрика не найдена.`,
      [SECONDARY_LOCALE]: `Rubric not found.`,
    },
  },
  {
    slug: 'rubrics.update.duplicate',
    messageI18n: {
      [DEFAULT_LOCALE]: `Рубрика с таким именем уже существует.`,
      [SECONDARY_LOCALE]: `Rubric with same name is already exists.`,
    },
  },
  {
    slug: 'rubrics.update.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка обновления рубрики.`,
      [SECONDARY_LOCALE]: `Rubric update error.`,
    },
  },
  {
    slug: 'rubrics.update.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Рубрика обновлена.`,
      [SECONDARY_LOCALE]: `Rubric updated.`,
    },
  },
  {
    slug: 'rubrics.delete.notFound',
    messageI18n: {
      [DEFAULT_LOCALE]: `Рубрика не найдена.`,
      [SECONDARY_LOCALE]: `Rubric not found.`,
    },
  },
  {
    slug: 'rubrics.delete.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка удаления рубрики.`,
      [SECONDARY_LOCALE]: `Rubric delete error.`,
    },
  },
  {
    slug: 'rubrics.delete.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Рубрика удалена.`,
      [SECONDARY_LOCALE]: `Rubric deleted.`,
    },
  },
  {
    slug: 'rubrics.addAttributesGroup.notFound',
    messageI18n: {
      [DEFAULT_LOCALE]: `Группа атрибутов или Рубрика не найдены.`,
      [SECONDARY_LOCALE]: `Rubric or attributes group not found.`,
    },
  },
  {
    slug: 'rubrics.addAttributesGroup.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка добавления Группы атрибутов в рубрику.`,
      [SECONDARY_LOCALE]: `Add attributes group to rubric error.`,
    },
  },
  {
    slug: 'rubrics.addAttributesGroup.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Группа атрибутов добавлена в рубрику.`,
      [SECONDARY_LOCALE]: `Attributes group added to the rubric.`,
    },
  },
  {
    slug: 'rubrics.updateAttributesGroup.notFound',
    messageI18n: {
      [DEFAULT_LOCALE]: `Группа атрибутов или Рубрика не найдены.`,
      [SECONDARY_LOCALE]: `Rubric or attributes group not found.`,
    },
  },
  {
    slug: 'rubrics.updateAttributesGroup.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка обновления Группы атрибутов в рубрике.`,
      [SECONDARY_LOCALE]: `Update attributes group error.`,
    },
  },
  {
    slug: 'rubrics.updateAttributesGroup.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Группа атрибутов обновлена.`,
      [SECONDARY_LOCALE]: `Attributes group updated.`,
    },
  },
  {
    slug: 'rubrics.deleteAttributesGroup.notFound',
    messageI18n: {
      [DEFAULT_LOCALE]: `Группа атрибутов или Рубрика не найдены.`,
      [SECONDARY_LOCALE]: `Rubric or attributes group not found.`,
    },
  },
  {
    slug: 'rubrics.deleteAttributesGroup.ownerError',
    messageI18n: {
      [DEFAULT_LOCALE]: `Группу атрибутов нельзя удалить т.к. рубрика не является владельцем.`,
      [SECONDARY_LOCALE]: `You can't delete attributes group from not owner rubric`,
    },
  },
  {
    slug: 'rubrics.deleteAttributesGroup.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка удаления Группы атрибутов из рубрики.`,
      [SECONDARY_LOCALE]: `Delete attributes group from rubric error.`,
    },
  },
  {
    slug: 'rubrics.deleteAttributesGroup.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Группа атрибутов удалена из рубрики.`,
      [SECONDARY_LOCALE]: `Attributes group removed from rubric.`,
    },
  },
  {
    slug: 'rubrics.addProduct.notFound',
    messageI18n: {
      [DEFAULT_LOCALE]: `Товар или Рубрика не найдены.`,
      [SECONDARY_LOCALE]: `Rubric or product not found.`,
    },
  },
  {
    slug: 'rubrics.addProduct.exists',
    messageI18n: {
      [DEFAULT_LOCALE]: `Товар уже присутствует в группе.`,
      [SECONDARY_LOCALE]: `Product already exists in this group.`,
    },
  },
  {
    slug: 'rubrics.addProduct.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка добавления товара в рубрику.`,
      [SECONDARY_LOCALE]: `Add product to rubric error.`,
    },
  },
  {
    slug: 'rubrics.addProduct.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Товар добавлен в рубрику.`,
      [SECONDARY_LOCALE]: `Product added to the rubric.`,
    },
  },
  {
    slug: 'rubrics.deleteProduct.notFound',
    messageI18n: {
      [DEFAULT_LOCALE]: `Товар или Рубрика не найдены.`,
      [SECONDARY_LOCALE]: `Rubric or product not found.`,
    },
  },
  {
    slug: 'rubrics.deleteProduct.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка удаления товара из рубрики.`,
      [SECONDARY_LOCALE]: `Delete product from rubric error.`,
    },
  },
  {
    slug: 'rubrics.deleteProduct.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Товар удалён из рубрики.`,
      [SECONDARY_LOCALE]: `Product removed from rubric.`,
    },
  },
  {
    slug: 'validation.rubrics.id',
    messageI18n: {
      [DEFAULT_LOCALE]: `ID рубрики обязательно к заполнению.`,
      [SECONDARY_LOCALE]: `Rubric ID is required.`,
    },
  },
  {
    slug: 'validation.rubrics.name',
    messageI18n: {
      [DEFAULT_LOCALE]: `Название рубрики обязательно к заполнению.`,
      [SECONDARY_LOCALE]: `Rubric Name is required.`,
    },
  },
  {
    slug: 'validation.rubrics.description',
    messageI18n: {
      [DEFAULT_LOCALE]: `Описание рубрики обязательно к заполнению.`,
      [SECONDARY_LOCALE]: `Rubric description is required.`,
    },
  },
  {
    slug: 'validation.rubrics.shortDescription',
    messageI18n: {
      [DEFAULT_LOCALE]: `Короткое описание рубрики обязательно к заполнению.`,
      [SECONDARY_LOCALE]: `Rubric short description is required.`,
    },
  },
  {
    slug: 'validation.rubrics.variant',
    messageI18n: {
      [DEFAULT_LOCALE]: `Тип рубрики обязателен к заполнению.`,
      [SECONDARY_LOCALE]: `Rubric Variant is required.`,
    },
  },
  {
    slug: 'validation.rubrics.defaultTitle',
    messageI18n: {
      [DEFAULT_LOCALE]: `Заголовок каталога обязателен к заполнению.`,
      [SECONDARY_LOCALE]: `Rubric catalogue default title is required.`,
    },
  },
  {
    slug: 'validation.rubrics.keyword',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ключевое слово рубрики обязательно к заполнению.`,
      [SECONDARY_LOCALE]: `Rubric keyword is required.`,
    },
  },
  {
    slug: 'validation.rubrics.gender',
    messageI18n: {
      [DEFAULT_LOCALE]: `Род ключевого слова обязателен к заполнению.`,
      [SECONDARY_LOCALE]: `Rubric keyword gender is required.`,
    },
  },
];
