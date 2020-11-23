import { MessagesGroup, MessagesGroupModel } from '../../entities/MessagesGroup';
import { MessageModel } from '../../entities/Message';
import {
  attributesGroupsMessages,
  citiesMessages,
  commonMessages,
  configsMessages,
  countriesMessages,
  currenciesMessages,
  languagesMessages,
  metricsMessages,
  optionsGroupsMessages,
  productsMessages,
  rolesMessages,
  rubricsMessages,
  rubricVariantsMessages,
  usersMessages,
  companiesMessages,
  shopsMessages,
  shopProductsMessages,
  cartsMessages,
} from '@yagu/config';
import { Translation } from '../../entities/Translation';

interface MessageInterface {
  key: string;
  message: Translation[];
}

interface CreateInitialApiMessagesGroup {
  name: string;
  messages: MessageInterface[];
}

async function createInitialApiMessagesGroup({
  name,
  messages,
}: CreateInitialApiMessagesGroup): Promise<MessagesGroup> {
  let group = await MessagesGroupModel.findOne({ name });
  const messagesIds = [];

  for await (const message of messages) {
    const currentMessage = await MessageModel.findOne({ key: message.key });
    if (!currentMessage) {
      const newMessage = await MessageModel.create(message);
      messagesIds.push(newMessage.id);
    } else {
      messagesIds.push(currentMessage.id);
    }
  }

  if (!group) {
    group = await MessagesGroupModel.create({ name, messages: messagesIds });
  } else {
    group = await MessagesGroupModel.findOneAndUpdate(
      {
        name,
      },
      {
        messages: messagesIds,
      },
      {
        new: true,
      },
    );
  }

  if (!group) {
    throw Error('Error in createInitialApiMessagesGroup');
  }

  return group;
}

async function createInitialApiMessages(): Promise<MessagesGroup[]> {
  const config = [
    { name: 'Общее', messages: commonMessages },
    { name: 'Настройки сайта', messages: configsMessages },
    { name: 'Валюта', messages: currenciesMessages },
    { name: 'Языки', messages: languagesMessages },
    { name: 'Города', messages: citiesMessages },
    { name: 'Страны', messages: countriesMessages },
    { name: 'Роли', messages: rolesMessages },
    { name: 'Пользователи', messages: usersMessages },
    { name: 'Корзина', messages: cartsMessages },
    { name: 'Группы опций', messages: optionsGroupsMessages },
    { name: 'Группы атрибутов', messages: attributesGroupsMessages },
    { name: 'Типы рубрик', messages: rubricVariantsMessages },
    { name: 'Рубрики', messages: rubricsMessages },
    { name: 'Товары', messages: productsMessages },
    { name: 'Метрические значения', messages: metricsMessages },
    { name: 'Компании', messages: companiesMessages },
    { name: 'Магазины', messages: shopsMessages },
    { name: 'Товары магазина', messages: shopProductsMessages },
  ];

  return Promise.all(
    config.map((group) => {
      return createInitialApiMessagesGroup(group);
    }),
  );
}

export default createInitialApiMessages;
