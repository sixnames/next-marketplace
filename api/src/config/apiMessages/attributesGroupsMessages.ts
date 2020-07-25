import { DEFAULT_LANG, SECONDARY_LANG } from '../common';

const attributesGroupsMessages = [
  {
    key: 'attributesGroups.create.duplicate',
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
    key: 'attributesGroups.create.error',
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
    key: 'attributesGroups.create.success',
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
    key: 'attributesGroups.update.duplicate',
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
    key: 'attributesGroups.update.error',
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
    key: 'attributesGroups.update.success',
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
    key: 'attributesGroups.delete.used',
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
    key: 'attributesGroups.delete.notFound',
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
    key: 'attributesGroups.delete.attributesError',
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
    key: 'attributesGroups.delete.error',
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
    key: 'attributesGroups.delete.success',
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
    key: 'attributesGroups.addAttribute.groupError',
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
    key: 'attributesGroups.addAttribute.attributeError',
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
    key: 'attributesGroups.addAttribute.duplicate',
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
    key: 'attributesGroups.addAttribute.addError',
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
    key: 'attributesGroups.addAttribute.success',
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
    key: 'attributesGroups.updateAttribute.groupError',
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
    key: 'attributesGroups.updateAttribute.duplicate',
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
    key: 'attributesGroups.updateAttribute.updateError',
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
    key: 'attributesGroups.updateAttribute.success',
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
    key: 'attributesGroups.deleteAttribute.deleteError',
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
    key: 'attributesGroups.deleteAttribute.groupError',
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
    key: 'attributesGroups.deleteAttribute.success',
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
