import { MessageBase, MessageModel, MessagesGroupModel } from './dbModels';
import { getDatabase } from './mongodb';
import { COL_MESSAGES, COL_MESSAGES_GROUPS } from './collectionNames';
import { Collection, ObjectId } from 'mongodb';
import { attributesGroupsMessages } from 'config/apiMessages/attributesGroupsMessages';
import { brandCollectionsMessages } from 'config/apiMessages/brandCollectionsMessages';
import { brandsMessages } from 'config/apiMessages/brandsMessages';
import { cartsMessages } from 'config/apiMessages/cartsMessages';
import { citiesMessages } from 'config/apiMessages/citiesMessages';
import { commonMessages } from 'config/apiMessages/commonMessages';
import { companiesMessages } from 'config/apiMessages/companiesMessages';
import { configsMessages } from 'config/apiMessages/configsMessages';
import { countriesMessages } from 'config/apiMessages/countriesMessages';
import { currenciesMessages } from 'config/apiMessages/currenciesMessages';
import { languagesMessages } from 'config/apiMessages/languagesMessages';
import { manufacturersMessages } from 'config/apiMessages/manufacturersMessages';
import { metricsMessages } from 'config/apiMessages/metricsMessages';
import { optionsGroupsMessages } from 'config/apiMessages/optionsGroupsMessages';
import { ordersMessages } from 'config/apiMessages/ordersMessages';
import { productsMessages } from 'config/apiMessages/productsMessages';
import { rolesMessages } from 'config/apiMessages/rolesMessages';
import { rubricsMessages } from 'config/apiMessages/rubricsMessages';
import { rubricVariantsMessages } from 'config/apiMessages/rubricVariantsMessages';
import { shopProductsMessages } from 'config/apiMessages/shopProductsMessages';
import { shopsMessages } from 'config/apiMessages/shopsMessages';
import { usersMessages } from 'config/apiMessages/usersMessages';

interface CreateInitialApiMessagesGroup {
  name: string;
  messages: MessageBase[];
  messagesGroupsCollection: Collection<MessagesGroupModel>;
  messagesCollection: Collection<MessageModel>;
}

async function createInitialApiMessagesGroup({
  name,
  messages,
  messagesGroupsCollection,
  messagesCollection,
}: CreateInitialApiMessagesGroup): Promise<MessagesGroupModel> {
  let group = await messagesGroupsCollection.findOne({ name });
  const messagesIds: ObjectId[] = [];

  for await (const message of messages) {
    const currentMessage = await messagesCollection.findOne({ slug: message.slug });
    if (!currentMessage) {
      const createdMessage = await messagesCollection.insertOne({
        ...message,
      });

      if (!createdMessage.result.ok || !createdMessage.insertedId) {
        throw Error('Initial message creation error');
      }

      messagesIds.push(createdMessage.insertedId);
    } else {
      messagesIds.push(currentMessage._id);
    }
  }

  if (!group) {
    const createdGroup = await messagesGroupsCollection.insertOne({ name, messagesIds });
    if (!createdGroup.result.ok) {
      throw Error('Initial messages group creation error');
    }
    group = createdGroup.ops[0];
  } else {
    const updatedGroup = await messagesGroupsCollection.findOneAndUpdate(
      {
        _id: group._id,
      },
      {
        $set: {
          messagesIds,
        },
      },
      {
        returnOriginal: false,
      },
    );
    if (!updatedGroup.ok || !updatedGroup.value) {
      throw Error('Initial messages group update error');
    }
    group = updatedGroup.value;
  }

  if (!group) {
    throw Error('Error in createInitialApiMessagesGroup');
  }

  return group;
}

export interface CreateInitialApiMessagesPayloadInterface {
  commonMessagesGroup: MessagesGroupModel;
  configMessagesGroup: MessagesGroupModel;
  currencyMessagesGroup: MessagesGroupModel;
  languageMessagesGroup: MessagesGroupModel;
  cityMessagesGroup: MessagesGroupModel;
  countryMessagesGroup: MessagesGroupModel;
  roleMessagesGroup: MessagesGroupModel;
  userMessagesGroup: MessagesGroupModel;
  optionsGroupMessagesGroup: MessagesGroupModel;
  attributesGroupMessagesGroup: MessagesGroupModel;
  rubricVariantGroupMessagesGroup: MessagesGroupModel;
  rubricMessagesGroup: MessagesGroupModel;
  productMessagesGroup: MessagesGroupModel;
  metricMessagesGroup: MessagesGroupModel;
  companyMessagesGroup: MessagesGroupModel;
  shopMessagesGroup: MessagesGroupModel;
  shopProductMessagesGroup: MessagesGroupModel;
  cartMessagesGroup: MessagesGroupModel;
  orderMessagesGroup: MessagesGroupModel;
  brandMessagesGroup: MessagesGroupModel;
  brandCollectionMessagesGroup: MessagesGroupModel;
  manufacturerMessagesGroup: MessagesGroupModel;
}

async function createInitialApiMessages(): Promise<CreateInitialApiMessagesPayloadInterface> {
  const db = await getDatabase();
  const messagesGroupsCollection = db.collection<MessagesGroupModel>(COL_MESSAGES_GROUPS);
  const messagesCollection = db.collection<MessageModel>(COL_MESSAGES);

  const commonMessagesGroup = await createInitialApiMessagesGroup({
    name: 'Общее',
    messages: commonMessages,
    messagesGroupsCollection,
    messagesCollection,
  });

  const configMessagesGroup = await createInitialApiMessagesGroup({
    name: 'Настройки сайта',
    messages: configsMessages,
    messagesGroupsCollection,
    messagesCollection,
  });

  const currencyMessagesGroup = await createInitialApiMessagesGroup({
    name: 'Валюта',
    messages: currenciesMessages,
    messagesGroupsCollection,
    messagesCollection,
  });

  const languageMessagesGroup = await createInitialApiMessagesGroup({
    name: 'Языки',
    messages: languagesMessages,
    messagesGroupsCollection,
    messagesCollection,
  });

  const cityMessagesGroup = await createInitialApiMessagesGroup({
    name: 'Города',
    messages: citiesMessages,
    messagesGroupsCollection,
    messagesCollection,
  });

  const countryMessagesGroup = await createInitialApiMessagesGroup({
    name: 'Страны',
    messages: countriesMessages,
    messagesGroupsCollection,
    messagesCollection,
  });

  const roleMessagesGroup = await createInitialApiMessagesGroup({
    name: 'Роли',
    messages: rolesMessages,
    messagesGroupsCollection,
    messagesCollection,
  });

  const userMessagesGroup = await createInitialApiMessagesGroup({
    name: 'Пользователи',
    messages: usersMessages,
    messagesGroupsCollection,
    messagesCollection,
  });

  const optionsGroupMessagesGroup = await createInitialApiMessagesGroup({
    name: 'Группы опций',
    messages: optionsGroupsMessages,
    messagesGroupsCollection,
    messagesCollection,
  });

  const attributesGroupMessagesGroup = await createInitialApiMessagesGroup({
    name: 'Группы атрибутов',
    messages: attributesGroupsMessages,
    messagesGroupsCollection,
    messagesCollection,
  });

  const rubricVariantGroupMessagesGroup = await createInitialApiMessagesGroup({
    name: 'Типы рубрик',
    messages: rubricVariantsMessages,
    messagesGroupsCollection,
    messagesCollection,
  });

  const rubricMessagesGroup = await createInitialApiMessagesGroup({
    name: 'Рубрики',
    messages: rubricsMessages,
    messagesGroupsCollection,
    messagesCollection,
  });

  const productMessagesGroup = await createInitialApiMessagesGroup({
    name: 'Товары',
    messages: productsMessages,
    messagesGroupsCollection,
    messagesCollection,
  });

  const metricMessagesGroup = await createInitialApiMessagesGroup({
    name: 'Метрические значения',
    messages: metricsMessages,
    messagesGroupsCollection,
    messagesCollection,
  });

  const companyMessagesGroup = await createInitialApiMessagesGroup({
    name: 'Компании',
    messages: companiesMessages,
    messagesGroupsCollection,
    messagesCollection,
  });

  const shopMessagesGroup = await createInitialApiMessagesGroup({
    name: 'Магазины',
    messages: shopsMessages,
    messagesGroupsCollection,
    messagesCollection,
  });

  const shopProductMessagesGroup = await createInitialApiMessagesGroup({
    name: 'Товары магазина',
    messages: shopProductsMessages,
    messagesGroupsCollection,
    messagesCollection,
  });

  const cartMessagesGroup = await createInitialApiMessagesGroup({
    name: 'Корзина',
    messages: cartsMessages,
    messagesGroupsCollection,
    messagesCollection,
  });

  const orderMessagesGroup = await createInitialApiMessagesGroup({
    name: 'Заказы',
    messages: ordersMessages,
    messagesGroupsCollection,
    messagesCollection,
  });

  const brandMessagesGroup = await createInitialApiMessagesGroup({
    name: 'Бренды',
    messages: brandsMessages,
    messagesGroupsCollection,
    messagesCollection,
  });

  const brandCollectionMessagesGroup = await createInitialApiMessagesGroup({
    name: 'Линейки бренда',
    messages: brandCollectionsMessages,
    messagesGroupsCollection,
    messagesCollection,
  });

  const manufacturerMessagesGroup = await createInitialApiMessagesGroup({
    name: 'Производители',
    messages: manufacturersMessages,
    messagesGroupsCollection,
    messagesCollection,
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
