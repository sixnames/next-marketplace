import { MessageBaseInterface } from '../../../../db/uiInterfaces';
import { MessageModel } from '../../../../db/dbModels';
import * as messagesGroups from '../messagesGroups/messagesGroups';
import { getObjectId } from 'mongo-seeding';
import { attributesGroupsMessages } from '../../apiMessages/attributesGroupsMessages';
import { brandCollectionsMessages } from '../../apiMessages/brandCollectionsMessages';
import { brandsMessages } from '../../apiMessages/brandsMessages';
import { cartsMessages } from '../../apiMessages/cartsMessages';
import { citiesMessages } from '../../apiMessages/citiesMessages';
import { commonMessages } from '../../apiMessages/commonMessages';
import { companiesMessages } from '../../apiMessages/companiesMessages';
import { configsMessages } from '../../apiMessages/configsMessages';
import { countriesMessages } from '../../apiMessages/countriesMessages';
import { currenciesMessages } from '../../apiMessages/currenciesMessages';
import { languagesMessages } from '../../apiMessages/languagesMessages';
import { navItemsMessages } from '../../apiMessages/navItemsMessages';
import { manufacturersMessages } from '../../apiMessages/manufacturersMessages';
import { metricsMessages } from '../../apiMessages/metricsMessages';
import { optionsGroupsMessages } from '../../apiMessages/optionsGroupsMessages';
import { ordersMessages } from '../../apiMessages/ordersMessages';
import { productsMessages } from '../../apiMessages/productsMessages';
import { rolesMessages } from '../../apiMessages/rolesMessages';
import { rubricsMessages } from '../../apiMessages/rubricsMessages';
import { rubricVariantsMessages } from '../../apiMessages/rubricVariantsMessages';
import { shopProductsMessages } from '../../apiMessages/shopProductsMessages';
import { shopsMessages } from '../../apiMessages/shopsMessages';
import { usersMessages } from '../../apiMessages/usersMessages';

interface GenerateMessagesForGroupInterface {
  initialMessages: MessageBaseInterface[];
  groupName: string;
}

const generateMessagesForGroup = ({
  initialMessages,
  groupName,
}: GenerateMessagesForGroupInterface): MessageModel[] => {
  const group = messagesGroups.find(({ nameI18n }) => nameI18n.ru === groupName);
  if (!group) {
    return [];
  }
  const generatedMessages: MessageModel[] = [];
  initialMessages.forEach((base) => {
    generatedMessages.push({
      ...base,
      _id: getObjectId(base.slug),
      messagesGroupId: group._id,
    });
  });
  return generatedMessages;
};

const config: GenerateMessagesForGroupInterface[] = [
  {
    initialMessages: commonMessages,
    groupName: 'Общее',
  },
  {
    initialMessages: configsMessages,
    groupName: 'Настройки сайта',
  },
  {
    initialMessages: currenciesMessages,
    groupName: 'Валюта',
  },
  {
    initialMessages: languagesMessages,
    groupName: 'Языки',
  },
  {
    initialMessages: navItemsMessages,
    groupName: 'Навигация',
  },
  {
    initialMessages: citiesMessages,
    groupName: 'Города',
  },
  {
    initialMessages: countriesMessages,
    groupName: 'Страны',
  },
  {
    initialMessages: rolesMessages,
    groupName: 'Роли',
  },
  {
    initialMessages: usersMessages,
    groupName: 'Пользователи',
  },
  {
    initialMessages: optionsGroupsMessages,
    groupName: 'Группы опций',
  },
  {
    initialMessages: attributesGroupsMessages,
    groupName: 'Группы атрибутов',
  },
  {
    initialMessages: rubricVariantsMessages,
    groupName: 'Типы рубрик',
  },
  {
    initialMessages: rubricsMessages,
    groupName: 'Рубрики',
  },
  {
    initialMessages: productsMessages,
    groupName: 'Товары',
  },
  {
    initialMessages: metricsMessages,
    groupName: 'Метрические значения',
  },
  {
    initialMessages: companiesMessages,
    groupName: 'Компании',
  },
  {
    initialMessages: shopsMessages,
    groupName: 'Магазины',
  },
  {
    initialMessages: shopProductsMessages,
    groupName: 'Товары магазина',
  },
  {
    initialMessages: cartsMessages,
    groupName: 'Корзина',
  },
  {
    initialMessages: ordersMessages,
    groupName: 'Заказы',
  },
  {
    initialMessages: brandsMessages,
    groupName: 'Бренды',
  },
  {
    initialMessages: brandCollectionsMessages,
    groupName: 'Линейки бренда',
  },
  {
    initialMessages: manufacturersMessages,
    groupName: 'Производители',
  },
];

const getMessagesList = (): MessageModel[] => {
  return config.reduce((acc: MessageModel[], configItem) => {
    return [...acc, ...generateMessagesForGroup(configItem)];
  }, []);
};

const messages = getMessagesList();

export = messages;
