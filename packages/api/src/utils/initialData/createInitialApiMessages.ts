import { LanguageType } from '../../entities/common';
import { MessagesGroupModel } from '../../entities/MessagesGroup';
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
} from '@yagu/config';

interface MessageInterface {
  key: string;
  message: LanguageType[];
}

interface CreateInitialApiMessagesGroup {
  name: string;
  messages: MessageInterface[];
}

async function createInitialApiMessagesGroup({ name, messages }: CreateInitialApiMessagesGroup) {
  const group = await MessagesGroupModel.findOne({ name });
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
    await MessagesGroupModel.create({ name, messages: messagesIds });
  } else {
    await MessagesGroupModel.findOneAndUpdate(
      {
        name,
      },
      {
        messages: messagesIds,
      },
    );
  }
}

async function createInitialApiMessages() {
  const config = [
    { name: 'Общее', messages: commonMessages },
    { name: 'Настройки сайта', messages: configsMessages },
    { name: 'Валюта', messages: currenciesMessages },
    { name: 'Языки', messages: languagesMessages },
    { name: 'Города', messages: citiesMessages },
    { name: 'Страны', messages: countriesMessages },
    { name: 'Роли', messages: rolesMessages },
    { name: 'Пользователи', messages: usersMessages },
    { name: 'Группы опций', messages: optionsGroupsMessages },
    { name: 'Группы атрибутов', messages: attributesGroupsMessages },
    { name: 'Типы рубрик', messages: rubricVariantsMessages },
    { name: 'Рубрики', messages: rubricsMessages },
    { name: 'Товары', messages: productsMessages },
    { name: 'Метрические значения', messages: metricsMessages },
  ];

  return Promise.all(
    config.map((group) => {
      return createInitialApiMessagesGroup(group);
    }),
  );
}

export default createInitialApiMessages;
