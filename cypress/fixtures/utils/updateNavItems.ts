import { NavItemModel } from '../../../db/dbModels';
import navItemTemplates from '../data/navItems/navItems';
import { COL_NAV_ITEMS } from '../../../db/collectionNames';
import { MongoClient } from 'mongodb';
import path from 'path';
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

async function updateNavItems() {
  const db = await getDatabase();

  console.log('Updating nav items');

  const timeStart = new Date().getTime();
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

  console.log('Total time: ', new Date().getTime() - timeStart);
}

(() => {
  updateNavItems()
    .then(() => {
      console.log('Success!');
      process.exit();
    })
    .catch((e) => {
      console.log(e);
      process.exit();
    });
})();
