import { DEFAULT_LOCALE, SECONDARY_LOCALE } from '../../config/common';
import { MessageBaseInterface } from '../../db/uiInterfaces';

export const optionsGroupsMessages: MessageBaseInterface[] = [
  {
    slug: 'optionsGroups.create.duplicate',
    messageI18n: {
      [DEFAULT_LOCALE]: `Группа опций с таким именем уже существует.`,
      [SECONDARY_LOCALE]: `Options group with same name is already exists.`,
    },
  },
  {
    slug: 'optionsGroups.create.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка создания группы опций.`,
      [SECONDARY_LOCALE]: `Options group creation error.`,
    },
  },
  {
    slug: 'optionsGroups.create.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Группа опций создана.`,
      [SECONDARY_LOCALE]: `Options group created.`,
    },
  },
  {
    slug: 'optionsGroups.update.notFound',
    messageI18n: {
      [DEFAULT_LOCALE]: `Группа опций не найдена.`,
      [SECONDARY_LOCALE]: `Options group not found.`,
    },
  },
  {
    slug: 'optionsGroups.update.duplicate',
    messageI18n: {
      [DEFAULT_LOCALE]: `Группа опций с таким именем уже существует.`,
      [SECONDARY_LOCALE]: `Options group with same name is already exists.`,
    },
  },
  {
    slug: 'optionsGroups.update.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка обновления группы опций.`,
      [SECONDARY_LOCALE]: `Options group update error.`,
    },
  },
  {
    slug: 'optionsGroups.update.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Группа опций обновлена.`,
      [SECONDARY_LOCALE]: `Options group updated.`,
    },
  },
  {
    slug: 'optionsGroups.delete.used',
    messageI18n: {
      [DEFAULT_LOCALE]: `Группа опций используется в атрибутах, её нельзя удалить.`,
      [SECONDARY_LOCALE]: `Options group is used in attributes. You can't delete it.`,
    },
  },
  {
    slug: 'optionsGroups.delete.notFound',
    messageI18n: {
      [DEFAULT_LOCALE]: `Группа опций не найдена.`,
      [SECONDARY_LOCALE]: `Options group not found.`,
    },
  },
  {
    slug: 'optionsGroups.delete.optionsError',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка удаления опций связанных с группой.`,
      [SECONDARY_LOCALE]: `Connected options delete error.`,
    },
  },
  {
    slug: 'optionsGroups.delete.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка удаления группы опций.`,
      [SECONDARY_LOCALE]: `Options group delete error.`,
    },
  },
  {
    slug: 'optionsGroups.delete.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Группа опций удалена.`,
      [SECONDARY_LOCALE]: `Options group removed.`,
    },
  },
  {
    slug: 'optionsGroups.addOption.groupError',
    messageI18n: {
      [DEFAULT_LOCALE]: `Группа опции не найдена.`,
      [SECONDARY_LOCALE]: `Options group not found.`,
    },
  },
  {
    slug: 'optionsGroups.addOption.colorError',
    messageI18n: {
      [DEFAULT_LOCALE]: `Цвет обязателен.`,
      [SECONDARY_LOCALE]: `Color is required.`,
    },
  },
  {
    slug: 'optionsGroups.addOption.iconError',
    messageI18n: {
      [DEFAULT_LOCALE]: `Иконка обязательна.`,
      [SECONDARY_LOCALE]: `Icon is required.`,
    },
  },
  {
    slug: 'optionsGroups.addOption.optionError',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка создания опции.`,
      [SECONDARY_LOCALE]: `Option creation error.`,
    },
  },
  {
    slug: 'optionsGroups.addOption.duplicate',
    messageI18n: {
      [DEFAULT_LOCALE]: `Опция с таким именем уже присутствует в данной группе.`,
      [SECONDARY_LOCALE]: `Option with same name is already exists in this group.`,
    },
  },
  {
    slug: 'optionsGroups.addOption.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка привязки опции к группе.`,
      [SECONDARY_LOCALE]: `Option connect error.`,
    },
  },
  {
    slug: 'optionsGroups.addOption.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Опция добавлена в группу.`,
      [SECONDARY_LOCALE]: `Option added to the group.`,
    },
  },
  {
    slug: 'optionsGroups.updateOption.groupError',
    messageI18n: {
      [DEFAULT_LOCALE]: `Группа опции не найдена.`,
      [SECONDARY_LOCALE]: `Options group not found.`,
    },
  },
  {
    slug: 'optionsGroups.updateOption.duplicate',
    messageI18n: {
      [DEFAULT_LOCALE]: `Опция с таким именем уже присутствует в данной группе.`,
      [SECONDARY_LOCALE]: `Option with same name is already exists in this group.`,
    },
  },
  {
    slug: 'optionsGroups.updateOption.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка обновления опции.`,
      [SECONDARY_LOCALE]: `Option update error.`,
    },
  },
  {
    slug: 'optionsGroups.updateOption.attributeNotFound',
    messageI18n: {
      [DEFAULT_LOCALE]: `Новая группа опций не назначена ни одному атрибуту`,
      [SECONDARY_LOCALE]: `New options group is not connected to the attribute`,
    },
  },
  {
    slug: 'optionsGroups.updateOption.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Опция обновлена.`,
      [SECONDARY_LOCALE]: `Option updated.`,
    },
  },
  {
    slug: 'optionsGroups.deleteOption.notFound',
    messageI18n: {
      [DEFAULT_LOCALE]: `Опция не найдена.`,
      [SECONDARY_LOCALE]: `Option not found.`,
    },
  },
  {
    slug: 'optionsGroups.deleteOption.used',
    messageI18n: {
      [DEFAULT_LOCALE]: `Опция используется в товарах.`,
      [SECONDARY_LOCALE]: `Option is used in products.`,
    },
  },
  {
    slug: 'optionsGroups.deleteOption.groupError',
    messageI18n: {
      [DEFAULT_LOCALE]: `Группа опции не найдена.`,
      [SECONDARY_LOCALE]: `Options group not found.`,
    },
  },
  {
    slug: 'optionsGroups.deleteOption.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка удаления опции.`,
      [SECONDARY_LOCALE]: `Option delete error.`,
    },
  },
  {
    slug: 'optionsGroups.deleteOption.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Опция удалена.`,
      [SECONDARY_LOCALE]: `Option removed.`,
    },
  },
  {
    slug: 'validation.optionsGroup.id',
    messageI18n: {
      [DEFAULT_LOCALE]: `ID группы опций обязательно к заполнению.`,
      [SECONDARY_LOCALE]: `Options group ID is required.`,
    },
  },
  {
    slug: 'validation.optionsGroup.name',
    messageI18n: {
      [DEFAULT_LOCALE]: `Название группы опций обязательно к заполнению.`,
      [SECONDARY_LOCALE]: `Options group name is required.`,
    },
  },
  {
    slug: 'validation.option.id',
    messageI18n: {
      [DEFAULT_LOCALE]: `ID опции обязательно к заполнению.`,
      [SECONDARY_LOCALE]: `Option ID is required.`,
    },
  },
  {
    slug: 'validation.option.name',
    messageI18n: {
      [DEFAULT_LOCALE]: `Название опции обязательно к заполнению.`,
      [SECONDARY_LOCALE]: `Option name is required.`,
    },
  },
  {
    slug: 'validation.option.variantGender',
    messageI18n: {
      [DEFAULT_LOCALE]: `Род варианта опции обязателен к заполнению.`,
      [SECONDARY_LOCALE]: `Option variant gender is required.`,
    },
  },
  {
    slug: 'validation.option.variantValue',
    messageI18n: {
      [DEFAULT_LOCALE]: `Значение рода опции`,
      [SECONDARY_LOCALE]: `Option variant value is required.`,
    },
  },
  {
    slug: 'validation.option.gender',
    messageI18n: {
      [DEFAULT_LOCALE]: `Значение рода опции`,
      [SECONDARY_LOCALE]: `Option gender is required.`,
    },
  },
];
