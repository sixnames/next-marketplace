import { RUBRIC_LEVEL_TWO } from '@rg/config';

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
  },
};

export default rubricTranslations;
