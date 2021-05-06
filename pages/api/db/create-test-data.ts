import { NextApiRequest, NextApiResponse } from 'next';
import { Seeder } from 'mongo-seeding';
import path from 'path';

const tlsCAFile = path.join(process.cwd(), 'db', 'root.crt');

async function sendTestEmail(_req: NextApiRequest, res: NextApiResponse) {
  const config = {
    database: {
      protocol: 'mongodb',
      host: `${process.env.MONGO_TEST_HOST}`,
      port: 27018,
      username: `${process.env.MONGO_TEST_USER_NAME}`,
      password: `${process.env.MONGO_TEST_USER_PWD}`,
      name: `${process.env.MONGO_DB_NAME}`,
      options: {
        tls: 'true',
        tlsCAFile,
        replicaSet: `${process.env.MONGO_DB_RS}`,
        authSource: `${process.env.MONGO_DB_NAME}`,
      },
    },
    dropDatabase: false,
    dropCollections: true,
    databaseReconnectTimeout: 10000,
  };
  const seeder = new Seeder(config);

  const collections = seeder.readCollectionsFromPath(
    path.resolve(process.cwd(), 'cypress/fixtures/data'),
  );

  try {
    await seeder.import(collections);
    res.send('Done');
  } catch (err) {
    console.log(err);
    res.send('Error');
  }
}

export default sendTestEmail;
