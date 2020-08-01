import { LanguageType } from '../../entities/common';
import languagesMessages from '../../config/apiMessages/languagesMessages';
import { MessagesGroupModel } from '../../entities/MessagesGroup';
import { MessageModel } from '../../entities/Message';
import usersMessages from '../../config/apiMessages/usersMessages';
import optionsGroupsMessages from '../../config/apiMessages/optionsGroupsMessages';
import attributesGroupsMessages from '../../config/apiMessages/attributesGroupsMessages';
import rubricVariantsMessages from '../../config/apiMessages/rubricVariantsMessages';
import rubricsMessages from '../../config/apiMessages/rubricsMessages';
import productsMessages from '../../config/apiMessages/productsMessages';
import metricsMessages from '../../config/apiMessages/metricsMessages';
import commonMessages from '../../config/apiMessages/commonMessages';
import currenciesMessages from '../../config/apiMessages/currenciesMessages';
import citiesMessages from '../../config/apiMessages/citiesMessages';
import countriesMessages from '../../config/apiMessages/countriesMessages';

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
  if (!group) {
    const messagesList = await MessageModel.insertMany(messages);
    const messagesIds = messagesList.map(({ id }) => id);
    await MessagesGroupModel.create({ name, messages: messagesIds });
  }
}

async function createInitialApiMessages() {
  const config = [
    { name: 'Общее', messages: commonMessages },
    { name: 'Валюта', messages: currenciesMessages },
    { name: 'Языки', messages: languagesMessages },
    { name: 'Города', messages: citiesMessages },
    { name: 'Страны', messages: countriesMessages },
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
