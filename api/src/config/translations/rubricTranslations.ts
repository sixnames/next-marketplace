import { RUBRIC_LEVEL_THREE, RUBRIC_LEVEL_TWO } from '../common';

const rubricTranslations = {
  rubric: {
    create: {
      duplicate: {
        ru: 'Рубрика с таким именем уже существует.',
        en: 'Rubric with same name is already exists.',
      },
      error: {
        ru: 'Ошибка создания рубрики.',
        en: 'Rubric creation error.',
      },
      success: {
        ru: 'Рубрика создана.',
        en: 'Rubric created.',
      },
    },
    update: {
      duplicate: {
        ru: 'Рубрика с таким именем уже существует.',
        en: 'Rubric with same name is already exists.',
      },
      error: {
        ru: 'Ошибка обновления рубрики.',
        en: 'Rubric update error.',
      },
      success: {
        ru: 'Рубрика обновлена.',
        en: 'Rubric updated.',
      },
    },
    delete: {
      notFound: {
        ru: 'Рубрика не найдена.',
        en: 'Rubric not found.',
      },
      error: {
        ru: 'Ошибка удаления рубрики.',
        en: 'Rubric delete error.',
      },
      success: {
        ru: 'Рубрика удалена.',
        en: 'Rubric deleted.',
      },
    },
    addAttributesGroup: {
      notFound: {
        ru: 'Группа атрибутов или Рубрика не найдены.',
        en: 'Rubric or attributes group not found.',
      },
      levelError: {
        ru: `В рубрику не ${RUBRIC_LEVEL_TWO}-го уровня нельзя добавить группу атрибутов.`,
        en: `You can't add attributes group to rubric with level other than ${RUBRIC_LEVEL_TWO}.`,
      },
      error: {
        ru: 'Ошибка добавления Группы атрибутов в рубрику.',
        en: 'Add attributes group to rubric error.',
      },
      success: {
        ru: 'Группа атрибутов добавлена в рубрику.',
        en: 'Attributes group added to the rubric.',
      },
    },
    updateAttributesGroup: {
      notFound: {
        ru: 'Группа атрибутов или Рубрика не найдены.',
        en: 'Rubric or attributes group not found.',
      },
      error: {
        ru: 'Ошибка обновления Группы атрибутов в рубрике.',
        en: 'Update attributes group error.',
      },
      success: {
        ru: 'Группа атрибутов обновлена.',
        en: 'Attributes group updated.',
      },
    },
    deleteAttributesGroup: {
      notFound: {
        ru: 'Группа атрибутов или Рубрика не найдены.',
        en: 'Rubric or attributes group not found.',
      },
      levelError: {
        ru: `Из рубрики не ${RUBRIC_LEVEL_TWO}-го уровня нельзя удалить группу атрибутов.`,
        en: `You can't delete attributes group from rubric with level other than ${RUBRIC_LEVEL_TWO}.`,
      },
      error: {
        ru: 'Ошибка удаления Группы атрибутов из рубрики.',
        en: 'Add attributes group from rubric error.',
      },
      success: {
        ru: 'Группа атрибутов удалена из рубрики.',
        en: 'Attributes group removed from rubric.',
      },
    },
    addProduct: {
      notFound: {
        ru: 'Товар или Рубрика не найдены.',
        en: 'Rubric or product not found.',
      },
      exists: {
        ru: 'Товар уже присутствует в группе.',
        en: 'Product already exists in this group.',
      },
      levelError: {
        ru: `В рубрику не ${RUBRIC_LEVEL_THREE}-го уровня нельзя добавить товар.`,
        en: `You can't add product to rubric with level other than ${RUBRIC_LEVEL_THREE}.`,
      },
      addToProductError: {
        ru: 'Ошибка добавления товара в рубрику.',
        en: 'Add product to rubric error.',
      },
      success: {
        ru: 'Товар добавлен в рубрику.',
        en: 'Product added to the rubric.',
      },
    },
    deleteProduct: {
      notFound: {
        ru: 'Товар или Рубрика не найдены.',
        en: 'Rubric or product not found.',
      },
      levelError: {
        ru: `Из рубрики не ${RUBRIC_LEVEL_THREE}-го уровня нельзя удалить товар.`,
        en: `You can't delete product from rubric with level other than ${RUBRIC_LEVEL_THREE}.`,
      },
      deleteFromProductError: {
        ru: 'Ошибка удаления товара из рубрики.',
        en: 'Delete product from rubric error.',
      },
      success: {
        ru: 'Товар удалён из рубрики.',
        en: 'Product removed from rubric.',
      },
    },
  },
};

export default rubricTranslations;
