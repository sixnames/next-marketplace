import { DEFAULT_LANG, SECONDARY_LANG } from '../common';

const optionsGroupsMessages = [
  {
    key: 'optionsGroups.create.duplicate',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Группа опций с таким именем уже существует.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Options group with same name is already exists.',
      },
    ],
  },
  {
    key: 'optionsGroups.create.error',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка создания группы опций.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Options group creation error.',
      },
    ],
  },
  {
    key: 'optionsGroups.create.success',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Группа опций создана.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Options group created.',
      },
    ],
  },
  {
    key: 'optionsGroups.update.duplicate',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Группа опций с таким именем уже существует.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Options group with same name is already exists.',
      },
    ],
  },
  {
    key: 'optionsGroups.update.error',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка обновления группы опций.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Options group update error.',
      },
    ],
  },
  {
    key: 'optionsGroups.update.success',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Группа опций обновлена.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Options group updated.',
      },
    ],
  },
  {
    key: 'optionsGroups.delete.used',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Группа опций используется в атрибутах, её нельзя удалить.',
      },
      {
        key: SECONDARY_LANG,
        value: `Options group is used in attributes. You can't delete it.`,
      },
    ],
  },
  {
    key: 'optionsGroups.delete.optionsError',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка удаления опций связанных с группой.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Connected options delete error.',
      },
    ],
  },
  {
    key: 'optionsGroups.delete.error',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка удаления группы опций.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Options group delete error.',
      },
    ],
  },
  {
    key: 'optionsGroups.delete.success',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Группа опций удалена.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Options group removed.',
      },
    ],
  },
  {
    key: 'optionsGroups.addOption.groupError',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Группа опции не найдена.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Options group not found.',
      },
    ],
  },
  {
    key: 'optionsGroups.addOption.optionError',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка создания опции.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Option creation error.',
      },
    ],
  },
  {
    key: 'optionsGroups.addOption.duplicate',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Опция с таким именем уже присутствует в данной группе.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Option with same name is already exists in this group.',
      },
    ],
  },
  {
    key: 'optionsGroups.addOption.error',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка привязки опции к группе.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Option connect error.',
      },
    ],
  },
  {
    key: 'optionsGroups.addOption.success',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Опция добавлена в группу.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Option added to the group.',
      },
    ],
  },
  {
    key: 'optionsGroups.updateOption.groupError',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Группа опции не найдена.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Options group not found.',
      },
    ],
  },
  {
    key: 'optionsGroups.updateOption.duplicate',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Опция с таким именем уже присутствует в данной группе.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Option with same name is already exists in this group.',
      },
    ],
  },
  {
    key: 'optionsGroups.updateOption.error',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка обновления опции.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Option update error.',
      },
    ],
  },
  {
    key: 'optionsGroups.updateOption.success',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Опция обновлена.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Option updated.',
      },
    ],
  },
  {
    key: 'optionsGroups.deleteOption.groupError',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Группа опции не найдена.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Options group not found.',
      },
    ],
  },
  {
    key: 'optionsGroups.deleteOption.error',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка удаления опции.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Option delete error.',
      },
    ],
  },
  {
    key: 'optionsGroups.deleteOption.success',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Опция удалена.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Option updated.',
      },
    ],
  },
];

export default optionsGroupsMessages;
