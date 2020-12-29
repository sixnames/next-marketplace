import { MessagesGroup, MessagesGroupModel } from '../../entities/MessagesGroup';
import { MessageModel } from '../../entities/Message';
import { Translation } from '../../entities/Translation';
import {
  attributesGroupsMessages,
  brandsMessages,
  cartsMessages,
  citiesMessages,
  commonMessages,
  companiesMessages,
  configsMessages,
  countriesMessages,
  currenciesMessages,
  languagesMessages,
  metricsMessages,
  optionsGroupsMessages,
  ordersMessages,
  productsMessages,
  rolesMessages,
  rubricsMessages,
  rubricVariantsMessages,
  shopProductsMessages,
  shopsMessages,
  usersMessages,
  brandCollectionsMessages,
  manufacturersMessages,
} from '@yagu/shared';

interface MessageInterface {
  key: string;
  message: Translation[];
}

interface CreateInitialApiMessagesGroup {
  nameString: string;
  messages: MessageInterface[];
}

async function createInitialApiMessagesGroup({
  nameString,
  messages,
}: CreateInitialApiMessagesGroup): Promise<MessagesGroup> {
  let group = await MessagesGroupModel.findOne({ nameString });
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
    group = await MessagesGroupModel.create({ nameString, messages: messagesIds });
  } else {
    group = await MessagesGroupModel.findOneAndUpdate(
      {
        _id: group._id,
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

export interface CreateInitialApiMessagesPayloadInterface {
  commonMessagesGroup: MessagesGroup;
  configMessagesGroup: MessagesGroup;
  currencyMessagesGroup: MessagesGroup;
  languageMessagesGroup: MessagesGroup;
  cityMessagesGroup: MessagesGroup;
  countryMessagesGroup: MessagesGroup;
  roleMessagesGroup: MessagesGroup;
  userMessagesGroup: MessagesGroup;
  optionsGroupMessagesGroup: MessagesGroup;
  attributesGroupMessagesGroup: MessagesGroup;
  rubricVariantGroupMessagesGroup: MessagesGroup;
  rubricMessagesGroup: MessagesGroup;
  productMessagesGroup: MessagesGroup;
  metricMessagesGroup: MessagesGroup;
  companyMessagesGroup: MessagesGroup;
  shopMessagesGroup: MessagesGroup;
  shopProductMessagesGroup: MessagesGroup;
  cartMessagesGroup: MessagesGroup;
  orderMessagesGroup: MessagesGroup;
  brandMessagesGroup: MessagesGroup;
  brandCollectionMessagesGroup: MessagesGroup;
  manufacturerMessagesGroup: MessagesGroup;
}

async function createInitialApiMessages(): Promise<CreateInitialApiMessagesPayloadInterface> {
  const commonMessagesGroup = await createInitialApiMessagesGroup({
    nameString: 'Общее',
    messages: commonMessages,
  });

  const configMessagesGroup = await createInitialApiMessagesGroup({
    nameString: 'Настройки сайта',
    messages: configsMessages,
  });

  const currencyMessagesGroup = await createInitialApiMessagesGroup({
    nameString: 'Валюта',
    messages: currenciesMessages,
  });

  const languageMessagesGroup = await createInitialApiMessagesGroup({
    nameString: 'Языки',
    messages: languagesMessages,
  });

  const cityMessagesGroup = await createInitialApiMessagesGroup({
    nameString: 'Города',
    messages: citiesMessages,
  });

  const countryMessagesGroup = await createInitialApiMessagesGroup({
    nameString: 'Страны',
    messages: countriesMessages,
  });

  const roleMessagesGroup = await createInitialApiMessagesGroup({
    nameString: 'Роли',
    messages: rolesMessages,
  });

  const userMessagesGroup = await createInitialApiMessagesGroup({
    nameString: 'Пользователи',
    messages: usersMessages,
  });

  const optionsGroupMessagesGroup = await createInitialApiMessagesGroup({
    nameString: 'Группы опций',
    messages: optionsGroupsMessages,
  });

  const attributesGroupMessagesGroup = await createInitialApiMessagesGroup({
    nameString: 'Группы атрибутов',
    messages: attributesGroupsMessages,
  });

  const rubricVariantGroupMessagesGroup = await createInitialApiMessagesGroup({
    nameString: 'Типы рубрик',
    messages: rubricVariantsMessages,
  });

  const rubricMessagesGroup = await createInitialApiMessagesGroup({
    nameString: 'Рубрики',
    messages: rubricsMessages,
  });

  const productMessagesGroup = await createInitialApiMessagesGroup({
    nameString: 'Товары',
    messages: productsMessages,
  });

  const metricMessagesGroup = await createInitialApiMessagesGroup({
    nameString: 'Метрические значения',
    messages: metricsMessages,
  });

  const companyMessagesGroup = await createInitialApiMessagesGroup({
    nameString: 'Компании',
    messages: companiesMessages,
  });

  const shopMessagesGroup = await createInitialApiMessagesGroup({
    nameString: 'Магазины',
    messages: shopsMessages,
  });

  const shopProductMessagesGroup = await createInitialApiMessagesGroup({
    nameString: 'Товары магазина',
    messages: shopProductsMessages,
  });

  const cartMessagesGroup = await createInitialApiMessagesGroup({
    nameString: 'Корзина',
    messages: cartsMessages,
  });

  const orderMessagesGroup = await createInitialApiMessagesGroup({
    nameString: 'Заказы',
    messages: ordersMessages,
  });

  const brandMessagesGroup = await createInitialApiMessagesGroup({
    nameString: 'Бренды',
    messages: brandsMessages,
  });

  const brandCollectionMessagesGroup = await createInitialApiMessagesGroup({
    nameString: 'Линейки бренда',
    messages: brandCollectionsMessages,
  });

  const manufacturerMessagesGroup = await createInitialApiMessagesGroup({
    nameString: 'Производители',
    messages: manufacturersMessages,
  });

  return {
    commonMessagesGroup,
    configMessagesGroup,
    currencyMessagesGroup,
    languageMessagesGroup,
    cityMessagesGroup,
    countryMessagesGroup,
    roleMessagesGroup,
    userMessagesGroup,
    optionsGroupMessagesGroup,
    attributesGroupMessagesGroup,
    rubricVariantGroupMessagesGroup,
    rubricMessagesGroup,
    productMessagesGroup,
    metricMessagesGroup,
    companyMessagesGroup,
    shopMessagesGroup,
    shopProductMessagesGroup,
    cartMessagesGroup,
    orderMessagesGroup,
    brandMessagesGroup,
    brandCollectionMessagesGroup,
    manufacturerMessagesGroup,
  };
}

export default createInitialApiMessages;
