import { DEFAULT_LANG, SECONDARY_LANG } from '../common';

const attributesGroupsMessages = [
  {
    key: 'attributesGroup.create.duplicate',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Группа аттрибутов с таким именем уже существует.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Attributes group with same name is already exists.',
      },
    ],
  },
  {
    key: 'attributesGroup.create.error',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка создания группы атрибутов.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Attributes group creation error.',
      },
    ],
  },
  {
    key: 'attributesGroup.create.success',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Группа атрибутов создана.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Attributes group created.',
      },
    ],
  },
  {
    key: 'attributesGroup.update.duplicate',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Группа аттрибутов с таким именем уже существует.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Attributes group with same name is already exists.',
      },
    ],
  },
  {
    key: 'attributesGroup.update.error',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка обновления группы аттрибутов.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Attributes group update error.',
      },
    ],
  },
  {
    key: 'attributesGroup.update.success',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Группа аттрибутов обновлена.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Attributes group updated.',
      },
    ],
  },
  {
    key: 'attributesGroup.delete.used',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Группа аттрибутов используется в рубриках, её нельзя удалить.',
      },
      {
        key: SECONDARY_LANG,
        value: `Attributes group is used in rubrics. You can't delete it.`,
      },
    ],
  },
  {
    key: 'attributesGroup.delete.notFound',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Группа аттрибутов не найдена.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Attributes group deleted.',
      },
    ],
  },
  {
    key: 'attributesGroup.delete.attributesError',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка удаления атрибутов связанных с группой.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Connected attributes delete error.',
      },
    ],
  },
  {
    key: 'attributesGroup.delete.error',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка удаления группы аттрибутов.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Attributes group delete error.',
      },
    ],
  },
  {
    key: 'attributesGroup.delete.success',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Группа аттрибутов удалена.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Attributes group removed.',
      },
    ],
  },
  {
    key: 'attributesGroup.addAttribute.groupError',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Группа аттрибутов не найдена.',
      },
      {
        key: SECONDARY_LANG,
        value: `Attributes group not found.`,
      },
    ],
  },
  {
    key: 'attributesGroup.addAttribute.attributeError',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка создания аттрибута.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Attributes creation error.',
      },
    ],
  },
  {
    key: 'attributesGroup.addAttribute.duplicate',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Атрибут с таким именем уже присутствует в данной группе.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Attributes with same name is already exists in this group.',
      },
    ],
  },
  {
    key: 'attributesGroup.addAttribute.addError',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка привязки аттрибута к группе.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Attributes connect error.',
      },
    ],
  },
  {
    key: 'attributesGroup.addAttribute.success',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Атрибут добавлен в группу.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Attributes added to the group.',
      },
    ],
  },
  {
    key: 'attributesGroup.updateAttribute.groupError',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Группа аттрибутов не найдена.',
      },
      {
        key: SECONDARY_LANG,
        value: `Attributes group not found.`,
      },
    ],
  },
  {
    key: 'attributesGroup.updateAttribute.duplicate',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Атрибут с таким именем уже присутствует в данной группе.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Attributes with same name is already exists in this group.',
      },
    ],
  },
  {
    key: 'attributesGroup.updateAttribute.updateError',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка обновления аттрибута.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Attributes update error.',
      },
    ],
  },
  {
    key: 'attributesGroup.updateAttribute.success',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Атрибут обновлён.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Attributes updated.',
      },
    ],
  },
  {
    key: 'attributesGroup.deleteAttribute.deleteError',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка удаления аттрибута.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Attribute delete error.',
      },
    ],
  },
  {
    key: 'attributesGroup.deleteAttribute.groupError',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Группа аттрибутов не найдена.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Attributes group not found.',
      },
    ],
  },
  {
    key: 'attributesGroup.deleteAttribute.success',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Атрибут удалён.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Attribute updated.',
      },
    ],
  },
];

export default attributesGroupsMessages;
