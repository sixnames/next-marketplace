import 'reflect-metadata';
import express, { Express } from 'express';
import { ApolloServer } from 'apollo-server-express';
import { APOLLO_OPTIONS, DB_OPTIONS, MONGO_URL, SESS_OPTIONS } from './config';
import session from 'express-session';
import connectMongo from 'connect-mongo';
import { buildSchemaSync } from 'type-graphql';
import cors from 'cors';
import { clearTestDataRoute, createTestDataRoute } from './routes/testingDataRoutes';
import { assetsRoute } from './routes/assetsRoutes';
import { internationalisationMiddleware } from './middlewares/internationalisationMiddleware';
import { schemaOptions } from './schema/schema';
import passport from './middlewares/passportMiddleware';
import mongoose from 'mongoose';
import { buildContext } from 'graphql-passport';

// Configure env variables
require('dotenv-flow').config();

interface CreateAppPayloadInterface {
  app: Express;
  server: ApolloServer;
}

const createApp = async (): Promise<CreateAppPayloadInterface> => {
  // Create express app
  const app = express();
  app.disable('x-powered-by');

  // Mongoose connection
  await mongoose.connect(`${MONGO_URL}`, DB_OPTIONS);

  // Session connection
  const MongoStore = connectMongo(session);
  const mongoStore = new MongoStore({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    client: mongoose.connection.client,
    stringify: false,
  });
  app.use(
    session({
      store: mongoStore,
      ...SESS_OPTIONS,
    }),
  );

  // Middlewares
  app.use(internationalisationMiddleware);
  app.use(passport.initialize());
  app.use(passport.session());

  // Test data routes
  // TODO make this methods safe
  app.get('/create-test-data', createTestDataRoute);
  app.get('/clear-test-data', clearTestDataRoute);

  // Assets route
  app.get('/assets/*', cors({ origin: new RegExp('/*/') }), assetsRoute);

  // GQL Schema
  const schema = buildSchemaSync(schemaOptions);

  // Apollo server
  const server = new ApolloServer({
    ...APOLLO_OPTIONS,
    schema,
    introspection: true,
    context: (ctx) => buildContext(ctx),
  });

  server.applyMiddleware({
    app,
    cors: {
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
