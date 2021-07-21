import navItemTemplates from '../data/navItems/navItems';
import { MessageModel, MessagesGroupModel, NavItemModel } from '../../../db/dbModels';
import messagesGroupsTemplates from '../data/messagesGroups/messagesGroups';
import messageTemplates from '../data/messages/messages';
import path from 'path';
import { COL_MESSAGES, COL_MESSAGES_GROUPS, COL_NAV_ITEMS } from '../../../db/collectionNames';
import { MongoClient } from 'mongodb';
require('dotenv').config();

interface GetDatabaseInterface {
  uri: string;
  dbName: string;
}

async function getDatabase({ uri, dbName }: GetDatabaseInterface) {
  const tlsCAFile = path.join(process.cwd(), 'db', 'root.crt');

  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    authSource: dbName,
    tls: true,
    tlsCAFile,
    replicaSet: process.env.MONGO_DB_RS,
  };

  // Create connection
  const client = await MongoClient.connect(uri, options);
  // Select the database through the connection
  return {
    db: client.db(dbName),
    client,
  };
}

const dbsConfig: GetDatabaseInterface[] = [
  {
    uri: `${process.env.WP_DB_URI}`,
    dbName: `${process.env.WP_DB_NAME}`,
  },
  {
    uri: `${process.env.SC_DB_URI}`,
    dbName: `${process.env.SC_DB_NAME}`,
  },
];

async function updateProds() {
  for await (const dbConfig of dbsConfig) {
    const { db, client } = await getDatabase(dbConfig);

    // Update api messages
    console.log(`Updating api messages in ${dbConfig.dbName} db`);
    const messagesGroupsCollection = db.collection<MessagesGroupModel>(COL_MESSAGES_GROUPS);
    const messagesCollection = db.collection<MessageModel>(COL_MESSAGES);
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
        return messagesGroup && messagesGroupId.equals(messagesGroup._id);
      });

      for await (const messageTemplate of messagesGroupMessageTemplates) {
        const message = await messagesCollection.findOne({
          slug: messageTemplate.slug,
        });
        if (!message) {
          console.log(`>>>> Creating message ${messageTemplate.slug}`);
          await messagesCollection.insertOne(messageTemplate);
        }
      }
    }

    console.log(`Api messages updated in ${dbConfig.dbName} db`);
    console.log(' ');

    // Update nav items
    console.log(`Updating nav items in ${dbConfig.dbName} db`);
    const navItemsCollection = db.collection<NavItemModel>(COL_NAV_ITEMS);
    for await (const navItemTemplate of navItemTemplates) {
      const navItem = await navItemsCollection.findOne({
        slug: navItemTemplate.slug,
      });
      if (!navItem) {
        console.log(`>>>>>>>>>>> Creating nav item ${navItemTemplate.nameI18n.ru}`);
        await navItemsCollection.insertOne(navItemTemplate);
      } else {
        await navItemsCollection.findOneAndUpdate(
          { _id: navItem._id },
          {
            $set: {
              nameI18n: navItemTemplate.nameI18n,
              index: navItemTemplate.index,
              path: navItemTemplate.path,
            },
          },
        );
      }
    }

    console.log(`Nav items updated in ${dbConfig.dbName} db`);
    console.log(' ');

    // disconnect form db
    await client.close();
  }
}

(() => {
  updateProds()
    .then(() => {
      console.log('Success!');
      process.exit();
    })
    .catch((e) => {
      console.log(e);
      process.exit();
    });
})();
