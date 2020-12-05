import 'reflect-metadata';
import express, { Express } from 'express';
import { ApolloServer } from 'apollo-server-express';
import { APOLLO_OPTIONS } from './config';
import { buildSchemaSync } from 'type-graphql';
import cors from 'cors';
import {
  clearTestDataRoute,
  createTestDataRoute,
  testSignInRoute,
} from './routes/testingDataRoutes';
import { assetsRoute } from './routes/assetsRoutes';
import { internationalisationMiddleware } from './middlewares/internationalisationMiddleware';
import { schemaOptions } from './schema/schema';
import { databaseMiddleware } from './middlewares/databaseMiddleware';
import { sessionMiddleware } from './middlewares/sessionMiddleware';
import passport, { visitorMiddleware } from './middlewares/passportMiddleware';

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

  // Test data routes
  // TODO make this methods safe
  app.get('/create-test-data', createTestDataRoute);
  app.get('/clear-test-data', clearTestDataRoute);
  app.get('/test-sign-in', testSignInRoute);

  // Assets route
  app.get('/assets/*', cors({ origin: new RegExp('/*/') }), assetsRoute);

  // Middlewares
  app
    .use(databaseMiddleware)
    .use(sessionMiddleware)
    .use(internationalisationMiddleware)
    .use(passport.initialize())
    .use(passport.session());

  // GQL Schema
  const schema = buildSchemaSync(schemaOptions);

  // Apollo server
  const server = new ApolloServer({
    ...APOLLO_OPTIONS,
    schema,
    introspection: true,
    context: visitorMiddleware,
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
