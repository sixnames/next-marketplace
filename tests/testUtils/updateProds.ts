import { generateDbCollections } from 'db/mongodb';
import messageTemplates from '../data/messages/messages';
import messagesGroupsTemplates from '../data/messagesGroups/messagesGroups';
import navItemTemplates from '../data/navItems/navItems';
import { dbsConfig, getProdDb, updateIndexes } from './getProdDb';

require('dotenv').config();

async function updateProds() {
  for await (const dbConfig of dbsConfig) {
    const { db, client } = await getProdDb(dbConfig);

    // Update api messages
    console.log(' ');
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>');
    console.log(' ');
    console.log(`Updating api messages in ${dbConfig.dbName} db`);
    const collections = generateDbCollections({ db, client });
    const messagesGroupsCollection = collections.messagesGroupsCollection();
    const messagesCollection = collections.messagesCollection();
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
        const createdMessagesGroup = await messagesGroupsCollection.findOne({
          _id: createdMessagesGroupResult.insertedId,
        });
        if (createdMessagesGroupResult.acknowledged && createdMessagesGroup) {
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
    const navItemsCollection = collections.navItemsCollection();
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
              icon: navItem.icon,
            },
          },
        );
      }
    }

    console.log(`Nav items updated in ${dbConfig.dbName} db`);
    console.log(' ');

    // update indexes
    console.log(`Updating indexes in ${dbConfig.dbName} db`);
    await updateIndexes(db, client);
    console.log(`Indexes updated in ${dbConfig.dbName} db`);

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
