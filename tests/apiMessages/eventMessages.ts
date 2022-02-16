import { MessageBaseInterface } from 'db/uiInterfaces';
import { DEFAULT_LOCALE, SECONDARY_LOCALE } from 'lib/config/common';

export const eventMessages: MessageBaseInterface[] = [
  {
    slug: 'events.create.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка создания мероприятия.`,
      [SECONDARY_LOCALE]: `Event creation error.`,
    },
  },
  {
    slug: 'events.create.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Мероприятие создан.`,
      [SECONDARY_LOCALE]: `Event created.`,
    },
  },
  {
    slug: 'events.update.notFound',
    messageI18n: {
      [DEFAULT_LOCALE]: `Мероприятие не найден.`,
      [SECONDARY_LOCALE]: `Event not found.`,
    },
  },
  {
    slug: 'events.update.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка обновления мероприятия.`,
      [SECONDARY_LOCALE]: `Event update error.`,
    },
  },
  {
    slug: 'events.update.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Мероприятие обновлён.`,
      [SECONDARY_LOCALE]: `Event updated.`,
    },
  },
  {
    slug: 'events.delete.notFound',
    messageI18n: {
      [DEFAULT_LOCALE]: `Мероприятие не найден.`,
      [SECONDARY_LOCALE]: `Event not found.`,
    },
  },
  {
    slug: 'events.delete.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка удаления мероприятия.`,
      [SECONDARY_LOCALE]: `Event delete error.`,
    },
  },
  {
    slug: 'events.delete.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Мероприятие удалён.`,
      [SECONDARY_LOCALE]: `Event removed.`,
    },
  },
  {
    slug: 'validation.events.id',
    messageI18n: {
      [DEFAULT_LOCALE]: `ID мероприятия обязательно.`,
      [SECONDARY_LOCALE]: `Event ID is required.`,
    },
  },
  {
    slug: 'validation.events.name',
    messageI18n: {
      [DEFAULT_LOCALE]: `Название мероприятия обязательно.`,
      [SECONDARY_LOCALE]: `Event name is required.`,
    },
  },
  {
    slug: 'validation.events.description',
    messageI18n: {
      [DEFAULT_LOCALE]: `Описание мероприятия обязательно.`,
      [SECONDARY_LOCALE]: `Event description is required.`,
    },
  },
  {
    slug: 'validation.events.rubrics',
    messageI18n: {
      [DEFAULT_LOCALE]: `Рубрика мероприятия обязательна.`,
      [SECONDARY_LOCALE]: `Event rubric is required.`,
    },
  },
  {
    slug: 'validation.events.seatsCount',
    messageI18n: {
      [DEFAULT_LOCALE]: `Количество билетов мероприятия обязательно.`,
      [SECONDARY_LOCALE]: `Event seats count is required.`,
    },
  },
];
