import { MessagesGroupModel } from '../../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';

const messagesGroups: MessagesGroupModel[] = [
  {
    _id: getObjectId('messagesGroups Общее'),
    nameI18n: {
      ru: 'Общее',
    },
  },
  {
    _id: getObjectId('messagesGroups Настройки сайта'),
    nameI18n: {
      ru: 'Настройки сайта',
    },
  },
  {
    _id: getObjectId('messagesGroups Атрибуты блога'),
    nameI18n: {
      ru: 'Атрибуты блога',
    },
  },
  {
    _id: getObjectId('messagesGroups Блог-пост'),
    nameI18n: {
      ru: 'Блог-пост',
    },
  },
  {
    _id: getObjectId('messagesGroups Валюта'),
    nameI18n: {
      ru: 'Валюта',
    },
  },
  {
    _id: getObjectId('messagesGroups Языки'),
    nameI18n: {
      ru: 'Языки',
    },
  },
  {
    _id: getObjectId('messagesGroups Навигация'),
    nameI18n: {
      ru: 'Навигация',
    },
  },
  {
    _id: getObjectId('messagesGroups Города'),
    nameI18n: {
      ru: 'Города',
    },
  },
  {
    _id: getObjectId('messagesGroups Страны'),
    nameI18n: {
      ru: 'Страны',
    },
  },
  {
    _id: getObjectId('messagesGroups Роли'),
    nameI18n: {
      ru: 'Роли',
    },
  },
  {
    _id: getObjectId('messagesGroups Пользователи'),
    nameI18n: {
      ru: 'Пользователи',
    },
  },
  {
    _id: getObjectId('messagesGroups Группы опций'),
    nameI18n: {
      ru: 'Группы опций',
    },
  },
  {
    _id: getObjectId('messagesGroups Группы атрибутов'),
    nameI18n: {
      ru: 'Группы атрибутов',
    },
  },
  {
    _id: getObjectId('messagesGroups Типы рубрик'),
    nameI18n: {
      ru: 'Типы рубрик',
    },
  },
  {
    _id: getObjectId('messagesGroups Рубрики'),
    nameI18n: {
      ru: 'Рубрики',
    },
  },
  {
    _id: getObjectId('messagesGroups Категории'),
    nameI18n: {
      ru: 'Категории',
    },
  },
  {
    _id: getObjectId('messagesGroups Товары'),
    nameI18n: {
      ru: 'Товары',
    },
  },
  {
    _id: getObjectId('messagesGroups Метрические значения'),
    nameI18n: {
      ru: 'Метрические значения',
    },
  },
  {
    _id: getObjectId('messagesGroups Компании'),
    nameI18n: {
      ru: 'Компании',
    },
  },
  {
    _id: getObjectId('messagesGroups Магазины'),
    nameI18n: {
      ru: 'Магазины',
    },
  },
  {
    _id: getObjectId('messagesGroups Товары магазина'),
    nameI18n: {
      ru: 'Товары магазина',
    },
  },
  {
    _id: getObjectId('messagesGroups Корзина'),
    nameI18n: {
      ru: 'Корзина',
    },
  },
  {
    _id: getObjectId('messagesGroups Заказы'),
    nameI18n: {
      ru: 'Заказы',
    },
  },
  {
    _id: getObjectId('messagesGroups Бренды'),
    nameI18n: {
      ru: 'Бренды',
    },
  },
  {
    _id: getObjectId('messagesGroups Линейки бренда'),
    nameI18n: {
      ru: 'Линейки бренда',
    },
  },
  {
    _id: getObjectId('messagesGroups Производители'),
    nameI18n: {
      ru: 'Производители',
    },
  },
  {
    _id: getObjectId('messagesGroups Поставщики'),
    nameI18n: {
      ru: 'Поставщики',
    },
  },
  {
    _id: getObjectId('messagesGroups Группы страниц'),
    nameI18n: {
      ru: 'Группы страниц',
    },
  },
  {
    _id: getObjectId('messagesGroups Страницы'),
    nameI18n: {
      ru: 'Страницы',
    },
  },
  {
    _id: getObjectId('messagesGroups Статусы заказа'),
    nameI18n: {
      ru: 'Статусы заказа',
    },
  },
  {
    _id: getObjectId('messagesGroups Категории пользователя'),
    nameI18n: {
      ru: 'Категории пользователя',
    },
  },
];

export = messagesGroups;
