import { MessageType } from 'db/dbModels';
import { DEFAULT_LOCALE, SECONDARY_LOCALE } from 'config/common';

export const attributesGroupsMessages: MessageType[] = [
  {
    slug: 'attributesGroups.create.duplicate',
    messageI18n: {
      [DEFAULT_LOCALE]: 'Группа атрибутов с таким именем уже существует.',
      [SECONDARY_LOCALE]: 'Attributes group with same name is already exists.',
    },
  },
  {
    slug: 'attributesGroups.create.error',
    messageI18n: {
      [DEFAULT_LOCALE]: 'Ошибка создания группы атрибутов.',
      [SECONDARY_LOCALE]: 'Attributes group creation error.',
    },
  },
  {
    slug: 'attributesGroups.create.success',
    messageI18n: {
      [DEFAULT_LOCALE]: 'Группа атрибутов создана.',
      [SECONDARY_LOCALE]: 'Attributes group created.',
    },
  },
  {
    slug: 'attributesGroups.update.duplicate',
    messageI18n: {
      [DEFAULT_LOCALE]: 'Группа атрибутов с таким именем уже существует.',
      [SECONDARY_LOCALE]: 'Attributes group with same name is already exists.',
    },
  },
  {
    slug: 'attributesGroups.update.error',
    messageI18n: {
      [DEFAULT_LOCALE]: 'Ошибка обновления группы атрибутов.',
      [SECONDARY_LOCALE]: 'Attributes group update error.',
    },
  },
  {
    slug: 'attributesGroups.update.success',
    messageI18n: {
      [DEFAULT_LOCALE]: 'Группа атрибутов обновлена.',
      [SECONDARY_LOCALE]: 'Attributes group updated.',
    },
  },
  {
    slug: 'attributesGroups.delete.used',
    messageI18n: {
      [DEFAULT_LOCALE]: 'Группа атрибутов используется в рубриках, её нельзя удалить.',
      [SECONDARY_LOCALE]: `Attributes group is used in rubrics. You can't delete it.`,
    },
  },
  {
    slug: 'attributesGroups.delete.notFound',
    messageI18n: {
      [DEFAULT_LOCALE]: 'Группа атрибутов не найдена.',
      [SECONDARY_LOCALE]: 'Attributes group deleted.',
    },
  },
  {
    slug: 'attributesGroups.delete.attributesError',
    messageI18n: {
      [DEFAULT_LOCALE]: 'Ошибка удаления атрибутов связанных с группой.',
      [SECONDARY_LOCALE]: 'Connected attributes delete error.',
    },
  },
  {
    slug: 'attributesGroups.delete.error',
    messageI18n: {
      [DEFAULT_LOCALE]: 'Ошибка удаления группы атрибутов.',
      [SECONDARY_LOCALE]: 'Attributes group delete error.',
    },
  },
  {
    slug: 'attributesGroups.delete.success',
    messageI18n: {
      [DEFAULT_LOCALE]: 'Группа атрибутов удалена.',
      [SECONDARY_LOCALE]: 'Attributes group removed.',
    },
  },
  {
    slug: 'attributesGroups.addAttribute.groupError',
    messageI18n: {
      [DEFAULT_LOCALE]: 'Группа атрибутов не найдена.',
      [SECONDARY_LOCALE]: 'Attributes group not found.',
    },
  },
  {
    slug: 'attributesGroups.addAttribute.attributeError',
    messageI18n: {
      [DEFAULT_LOCALE]: 'Ошибка создания атрибута.',
      [SECONDARY_LOCALE]: 'Attributes creation error.',
    },
  },
  {
    slug: 'attributesGroups.addAttribute.duplicate',
    messageI18n: {
      [DEFAULT_LOCALE]: 'Атрибут с таким именем уже присутствует в данной группе.',
      [SECONDARY_LOCALE]: 'Attributes with same name is already exists in this group.',
    },
  },
  {
    slug: 'attributesGroups.addAttribute.addError',
    messageI18n: {
      [DEFAULT_LOCALE]: 'Ошибка привязки атрибута к группе.',
      [SECONDARY_LOCALE]: 'Attributes connect error.',
    },
  },
  {
    slug: 'attributesGroups.addAttribute.success',
    messageI18n: {
      [DEFAULT_LOCALE]: 'Атрибут добавлен в группу.',
      [SECONDARY_LOCALE]: 'Attributes added to the group.',
    },
  },
  {
    slug: 'attributesGroups.updateAttribute.groupError',
    messageI18n: {
      [DEFAULT_LOCALE]: 'Группа атрибутов не найдена.',
      [SECONDARY_LOCALE]: 'Attributes group not found.',
    },
  },
  {
    slug: 'attributesGroups.updateAttribute.duplicate',
    messageI18n: {
      [DEFAULT_LOCALE]: 'Атрибут с таким именем уже присутствует в данной группе.',
      [SECONDARY_LOCALE]: 'Attributes with same name is already exists in this group.',
    },
  },
  {
    slug: 'attributesGroups.updateAttribute.updateError',
    messageI18n: {
      [DEFAULT_LOCALE]: 'Ошибка обновления атрибута.',
      [SECONDARY_LOCALE]: 'Attributes update error.',
    },
  },
  {
    slug: 'attributesGroups.updateAttribute.success',
    messageI18n: {
      [DEFAULT_LOCALE]: 'Атрибут обновлён.',
      [SECONDARY_LOCALE]: 'Attributes updated.',
    },
  },
  {
    slug: 'attributesGroups.deleteAttribute.deleteError',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка удаления атрибута.`,
      [SECONDARY_LOCALE]: `Attribute delete error.`,
    },
  },
  {
    slug: 'attributesGroups.deleteAttribute.used',
    messageI18n: {
      [DEFAULT_LOCALE]: `Атрибут используется в товарах.`,
      [SECONDARY_LOCALE]: `Attribute is used in products.`,
    },
  },
  {
    slug: 'attributesGroups.deleteAttribute.groupError',
    messageI18n: {
      [DEFAULT_LOCALE]: `Группа атрибутов не найдена.`,
      [SECONDARY_LOCALE]: `Attributes group not found.`,
    },
  },
  {
    slug: 'attributesGroups.deleteAttribute.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Атрибут удалён.`,
      [SECONDARY_LOCALE]: `Attribute updated.`,
    },
  },
  {
    slug: 'validation.attributesGroups.id',
    messageI18n: {
      [DEFAULT_LOCALE]: `ID группы атрибутов обязательно к заполнению.`,
      [SECONDARY_LOCALE]: `Attributes group ID is required.`,
    },
  },
  {
    slug: 'validation.attributesGroups.name',
    messageI18n: {
      [DEFAULT_LOCALE]: `Название группы атрибутов обязательно к заполнению.`,
      [SECONDARY_LOCALE]: `Attributes group Name is required.`,
    },
  },
  {
    slug: 'validation.attributes.id',
    messageI18n: {
      [DEFAULT_LOCALE]: `ID атрибута обязательно к заполнению.`,
      [SECONDARY_LOCALE]: `Attribute ID is required.`,
    },
  },
  {
    slug: 'validation.attributes.name',
    messageI18n: {
      [DEFAULT_LOCALE]: `Название атрибута обязательно к заполнению.`,
      [SECONDARY_LOCALE]: `Attribute Name is required.`,
    },
  },
  {
    slug: 'validation.attributes.variant',
    messageI18n: {
      [DEFAULT_LOCALE]: `Тип атрибута обязателен к заполнению.`,
      [SECONDARY_LOCALE]: `Attribute Variant is required.`,
    },
  },
  {
    slug: 'validation.attributes.viewVariant',
    messageI18n: {
      [DEFAULT_LOCALE]: `Тип отображения атрибута обязателен к заполнению.`,
      [SECONDARY_LOCALE]: `Attribute view variant is required.`,
    },
  },
  {
    slug: 'validation.attributes.options',
    messageI18n: {
      [DEFAULT_LOCALE]: `Группа опций обязательна к заполнению.`,
      [SECONDARY_LOCALE]: `Attribute options group is required.`,
    },
  },
  {
    slug: 'validation.attributes.position',
    messageI18n: {
      [DEFAULT_LOCALE]: `Позиционирование атрибута в заголовке каталога обязательно к заполнению.`,
      [SECONDARY_LOCALE]: `Attribute position in catalogue title is required.`,
    },
  },
];
