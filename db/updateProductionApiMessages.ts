import messagesGroupsTemplates from '../cypress/fixtures/data/messagesGroups/messagesGroups';
import messageTemplates from '../cypress/fixtures/data/messages/messages';
import path from 'path';
import { COL_MESSAGES, COL_MESSAGES_GROUPS } from './collectionNames';
import { MongoClient } from 'mongodb';
require('dotenv').config();

async function getDatabase() {
  const tlsCAFile = path.join(process.cwd(), 'db', 'root.crt');
  const uri = process.env.PROD_MONGO_URL;
  if (!uri) {
    throw new Error('Unable to connect to database, no URI provided');
  }

  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    authSource: process.env.PROD_MONGO_DB_NAME,
    tls: true,
    tlsCAFile,
    replicaSet: process.env.MONGO_DB_RS,
  };

  // Create connection
  const client = await MongoClient.connect(uri, options);

  // Select the database through the connection
  return client.db(process.env.PROD_MONGO_DB_NAME);
}

async function updateProductionApiMessages() {
  const db = await getDatabase();

  console.log('Updating api messages');

  const timeStart = new Date().getTime();
  const messagesGroupsCollection = db.collection(COL_MESSAGES_GROUPS);
  const messagesCollection = db.collection(COL_MESSAGES);
  // await messagesGroupsCollection.deleteMany({});
  // await messagesCollection.deleteMany({});

  for await (const messagesGroupTemplate of messagesGroupsTemplates) {
    let messagesGroup = await messagesGroupsCollection.findOne({
      'nameI18n.ru': messagesGroupTemplate.nameI18n.ru,
    });
    if (!messagesGroup) {
      console.log(`>>>>>>>>>>> Creating messages group ${messagesGroupTemplate.nameI18n.ru}`);
      const createdMessagesGroupResult = await messagesGroupsCollection.insertOne(
        messagesGroupTemplate,
      );
      const createdMessagesGroup = createdMessagesGroupResult.ops[0];
      if (createdMessagesGroupResult.result && createdMessagesGroup) {
        messagesGroup = createdMessagesGroup;
      }
    }

    const messagesGroupMessageTemplates = messageTemplates.filter(({ messagesGroupId }) => {
      return messagesGroupId.equals(messagesGroup._id);
    });

    for await (const messageTemplate of messagesGroupMessageTemplates) {
      const message = await messagesCollection.findOne({
        slug: messageTemplate.slug,
      });
      if (!message) {
        console.log(`Creating message ${messageTemplate.slug}`);
        await messagesCollection.insertOne(messageTemplate);
      }
    }
  }

  console.log('Total time: ', new Date().getTime() - timeStart);
}

(() => {
  updateProductionApiMessages()
    .then(() => {
      console.log('Success!');
      process.exit();
    })
    .catch((e) => {
      console.log(e);
      process.exit();
    });
})();
