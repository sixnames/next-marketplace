import { DEFAULT_LANG, SECONDARY_LANG } from '../common';

const rubricsMessages = [
  {
    key: 'rubrics.create.duplicate',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Рубрика с таким именем уже существует.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Rubric with same name is already exists.',
      },
    ],
  },
  {
    key: 'rubrics.create.error',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка создания рубрики.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Rubric creation error.',
      },
    ],
  },
  {
    key: 'rubrics.create.success',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Рубрика создана.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Rubric created.',
      },
    ],
  },
  {
    key: 'rubrics.update.notFound',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Рубрика не найдена.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Rubric not found.',
      },
    ],
  },
  {
    key: 'rubrics.update.duplicate',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Рубрика с таким именем уже существует.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Rubric with same name is already exists.',
      },
    ],
  },
  {
    key: 'rubrics.update.error',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка обновления рубрики.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Rubric update error.',
      },
    ],
  },
  {
    key: 'rubrics.update.success',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Рубрика обновлена.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Rubric updated.',
      },
    ],
  },
  {
    key: 'rubrics.delete.notFound',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Рубрика не найдена.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Rubric not found.',
      },
    ],
  },
  {
    key: 'rubrics.delete.error',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка удаления рубрики.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Rubric delete error.',
      },
    ],
  },
  {
    key: 'rubrics.delete.success',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Рубрика удалена.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Rubric deleted.',
      },
    ],
  },
  {
    key: 'rubrics.addAttributesGroup.notFound',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Группа атрибутов или Рубрика не найдены.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Rubric or attributes group not found.',
      },
    ],
  },
  {
    key: 'rubrics.addAttributesGroup.error',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка добавления Группы атрибутов в рубрику.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Add attributes group to rubric error.',
      },
    ],
  },
  {
    key: 'rubrics.addAttributesGroup.success',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Группа атрибутов добавлена в рубрику.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Attributes group added to the rubric.',
      },
    ],
  },
  {
    key: 'rubrics.updateAttributesGroup.notFound',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Группа атрибутов или Рубрика не найдены.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Rubric or attributes group not found.',
      },
    ],
  },
  {
    key: 'rubrics.updateAttributesGroup.error',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка обновления Группы атрибутов в рубрике.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Update attributes group error.',
      },
    ],
  },
  {
    key: 'rubrics.updateAttributesGroup.success',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Группа атрибутов обновлена.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Attributes group updated.',
      },
    ],
  },
  {
    key: 'rubrics.deleteAttributesGroup.notFound',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Группа атрибутов или Рубрика не найдены.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Rubric or attributes group not found.',
      },
    ],
  },
  {
    key: 'rubrics.deleteAttributesGroup.ownerError',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Группу атрибутов нельзя удалить т.к. рубрика не является владельцем.',
      },
      {
        key: SECONDARY_LANG,
        value: `You can't delete attributes group from not owner rubric`,
      },
    ],
  },
  {
    key: 'rubrics.deleteAttributesGroup.error',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка удаления Группы атрибутов из рубрики.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Delete attributes group from rubric error.',
      },
    ],
  },
  {
    key: 'rubrics.deleteAttributesGroup.success',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Группа атрибутов удалена из рубрики.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Attributes group removed from rubric.',
      },
    ],
  },
  {
    key: 'rubrics.addProduct.notFound',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Товар или Рубрика не найдены.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Rubric or product not found.',
      },
    ],
  },
  {
    key: 'rubrics.addProduct.exists',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Товар уже присутствует в группе.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Product already exists in this group.',
      },
    ],
  },
  {
    key: 'rubrics.addProduct.error',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка добавления товара в рубрику.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Add product to rubric error.',
      },
    ],
  },
  {
    key: 'rubrics.addProduct.success',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Товар добавлен в рубрику.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Product added to the rubric.',
      },
    ],
  },
  {
    key: 'rubrics.deleteProduct.notFound',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Товар или Рубрика не найдены.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Rubric or product not found.',
      },
    ],
  },
  {
    key: 'rubrics.deleteProduct.error',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка удаления товара из рубрики.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Delete product from rubric error.',
      },
    ],
  },
  {
    key: 'rubrics.deleteProduct.success',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Товар удалён из рубрики.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Product removed from rubric.',
      },
    ],
  },
];

export default rubricsMessages;
