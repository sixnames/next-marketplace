import 'reflect-metadata';
import express, { Express } from 'express';
import { ApolloServer } from 'apollo-server-express';
import { APOLLO_OPTIONS, MONGO_URL, DB_OPTIONS, SESS_OPTIONS, SESSION_COLLECTION } from './config';
import { buildSchemaSync } from 'type-graphql';
import cors from 'cors';
import mongoose from 'mongoose';
import connectMongoDBStore from 'connect-mongodb-session';
import session from 'express-session';
import {
  clearTestDataRoute,
  createTestDataRoute,
  testSignInRoute,
} from './routes/testingDataRoutes';
import { assetsRoute } from './routes/assetsRoutes';
import { internationalisationMiddleware } from './middlewares/internationalisationMiddleware';
import { visitorMiddleware } from './middlewares/visitorMiddleware';
import { schemaOptions } from './schema/schema';

// Configure env variables
require('dotenv-flow').config();

interface CreateAppPayloadInterface {
  app: Express;
  server: ApolloServer;
}

const createApp = async (): Promise<CreateAppPayloadInterface> => {
  // Mongoose connection
  await mongoose.connect(MONGO_URL, DB_OPTIONS);

  // GQL Schema
  const schema = buildSchemaSync(schemaOptions);

  // Create express app
  const app = express();
  app.disable('x-powered-by');

  // Session
  const MongoDBStore = connectMongoDBStore(session);
  const store = new MongoDBStore(
    {
      uri: MONGO_URL,
      collection: SESSION_COLLECTION,
      connectionOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 1000,
      },
    },
    (e) => {
      if (e) {
        console.log('============ MongoDBStore connection error ============');
        console.error(e);
      }
    },
  );
  app.use(
    session({
      store,
      ...SESS_OPTIONS,
    }),
  );

  // Test data routes
  // TODO make this methods safe
  app.get('/create-test-data', createTestDataRoute);
  app.get('/clear-test-data', clearTestDataRoute);
  app.get('/test-sign-in', testSignInRoute);

  // Assets route
  app.get('/assets/*', cors({ origin: new RegExp('/*/') }), assetsRoute);

  // Middlewares
  app.use(internationalisationMiddleware);
  app.use(visitorMiddleware);

  // Apollo server
  const server = new ApolloServer({
    ...APOLLO_OPTIONS,
    schema,
    introspection: true,
    context: async ({ req, res, connection }) => {
      // Return apollo context
      return connection ? connection.context : { req, res };
    },
  });

  server.applyMiddleware({
    app,
    cors: {
      // origin: IN_DEV ? DEV_ORIGIN : undefined,
      origin: new RegExp('/*/'),
      credentials: true,
    },
  });

  return {
    app,
    server,
  };
};

export default createApp;
