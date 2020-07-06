const attributesGroupTranslations = {
  attributesGroup: {
    create: {
      duplicate: {
        ru: 'Группа аттрибутов с таким именем уже существует.',
        en: 'Attributes group with same name is already exists.',
      },
      error: {
        ru: 'Ошибка создания группы атрибутов.',
        en: 'Attributes group creation error.',
      },
      success: {
        ru: 'Группа атрибутов создана.',
        en: 'Attributes group created.',
      },
    },
    update: {
      duplicate: {
        ru: 'Группа аттрибутов с таким именем уже существует.',
        en: 'Attributes group with same name is already exists.',
      },
      error: {
        ru: 'Ошибка обновления группы аттрибутов.',
        en: 'Attributes group update error.',
      },
      success: {
        ru: 'Группа аттрибутов обновлена.',
        en: 'Attributes group updated.',
      },
    },
    delete: {
      used: {
        ru: 'Группа аттрибутов используется в рубриках, её нельзя удалить.',
        en: `Attributes group is used in rubrics. You can't delete it.`,
      },
      notFound: {
        ru: 'Группа аттрибутов не найдена.',
        en: 'Attributes group deleted.',
      },
      attributesError: {
        ru: 'Ошибка удаления атрибутов связанных с группой.',
        en: 'Connected attributes delete error.',
      },
      error: {
        ru: 'Ошибка удаления группы аттрибутов.',
        en: 'Attributes group delete error.',
      },
      success: {
        ru: 'Группа аттрибутов удалена.',
        en: 'Attributes group deleted.',
      },
    },
    addAttribute: {
      groupError: {
        ru: 'Группа аттрибутов не найдена.',
        en: `Attributes group not found.`,
      },
      attributeError: {
        ru: 'Ошибка создания аттрибута.',
        en: 'Attributes creation error.',
      },
      duplicate: {
        ru: 'Атрибут с таким именем уже присутствует в данной группе.',
        en: 'Attributes with same name is already exists in this group.',
      },
      addError: {
        ru: 'Ошибка привязки аттрибута к группе.',
        en: 'Attributes connect error.',
      },
      success: {
        ru: 'Атрибут добавлен в группу.',
        en: 'Attributes added to the group.',
      },
    },
    updateAttribute: {
      groupError: {
        ru: 'Группа аттрибутов не найдена.',
        en: `Attributes group not found.`,
      },
      duplicate: {
        ru: 'Атрибут с таким именем уже присутствует в данной группе.',
        en: 'Attributes with same name is already exists in this group.',
      },
      updateError: {
        ru: 'Ошибка обновления аттрибута.',
        en: 'Attributes update error.',
      },
      success: {
        ru: 'Атрибут обновлён.',
        en: 'Attributes updated.',
      },
    },
    deleteAttribute: {
      deleteError: {
        ru: 'Ошибка удаления аттрибута.',
        en: 'Attribute delete error.',
      },
      groupError: {
        ru: 'Группа аттрибутов не найдена.',
        en: `Attributes group not found.`,
      },
      success: {
        ru: 'Атрибут удалён.',
        en: 'Attribute updated.',
      },
    },
  },
};

export default attributesGroupTranslations;
