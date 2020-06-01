import 'reflect-metadata';
import session from 'express-session';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import {
  APOLLO_OPTIONS,
  SESS_OPTIONS,
  // DEV_ORIGIN,
  DB_URI,
  DEFAULT_CITY,
} from './config';
import connectMongoDBStore from 'connect-mongodb-session';
import { buildSchemaSync } from 'type-graphql';
import { UserResolver } from './resolvers/user/UserResolver';
import { MetricResolver } from './resolvers/metric/MetricResolver';
import { OptionResolver } from './resolvers/option/OptionResolver';
import { OptionsGroupResolver } from './resolvers/optionsGroup/OptionsGroupResolver';
import { AttributeResolver } from './resolvers/attribute/AttributeResolver';
import { AttributesGroupResolver } from './resolvers/attributesGroup/AttributesGroupResolver';
import { RubricVariantResolver } from './resolvers/rubricVariant/RubricVariantResolver';
import { RubricResolver } from './resolvers/rubric/RubricResolver';

const createApp = () => {
  const schema = buildSchemaSync({
    resolvers: [
      UserResolver,
      MetricResolver,
      OptionResolver,
      OptionsGroupResolver,
      AttributeResolver,
      AttributesGroupResolver,
      RubricVariantResolver,
      RubricResolver,
    ],
    emitSchemaFile: true,
    validate: false,
  });

  const MongoDBStore = connectMongoDBStore(session);
  const store = new MongoDBStore({
    uri: DB_URI,
    collection: 'sessions',
  });

  const app = express();
  app.disable('x-powered-by');

  const sessionHandler = session({
    store,
    ...SESS_OPTIONS,
  });

  app.use(sessionHandler);

  // Get current city from subdomain name
  app.use((req, _, next) => {
    const city = req.headers['x-subdomain'];
    req.session!.city = city ? city : DEFAULT_CITY;
    next();
  });

  // app.use(IMAGES_DIRECTORY_NAME, express.static(path.join(__dirname, '../../web/src/images')));

  const server = new ApolloServer({
    ...APOLLO_OPTIONS,
    schema,
    context: ({ req, res, connection }) => (connection ? connection.context : { req, res }),
  });

  server.applyMiddleware({
    app,
  });

  return {
    app,
    server,
  };
};

export default createApp;
