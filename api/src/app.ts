import 'reflect-metadata';
import session from 'express-session';
import express, { Express } from 'express';
import { ApolloServer } from 'apollo-server-express';
import { APOLLO_OPTIONS, SESS_OPTIONS, DEFAULT_CITY, DEFAULT_LANG, MONGO_URL } from './config';
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
import { AttributeVariantResolver } from './resolvers/attributeVariant/AttributeVariantResolver';
import { ProductResolver } from './resolvers/product/ProductResolver';
import { getSharpImage } from './utils/assets/getSharpImage';
import createTestData from './utils/testUtils/createTestData';
import clearTestData from './utils/testUtils/clearTestData';
import { CatalogueDataResolver } from './resolvers/catalogueData/CatalogueDataResolver';
import cookie from 'cookie';
import path from 'path';
import cors from 'cors';

const createApp = (): { app: Express; server: ApolloServer } => {
  const schema = buildSchemaSync({
    resolvers: [
      UserResolver,
      MetricResolver,
      OptionResolver,
      OptionsGroupResolver,
      AttributeResolver,
      AttributeVariantResolver,
      AttributesGroupResolver,
      RubricVariantResolver,
      RubricResolver,
      ProductResolver,
      CatalogueDataResolver,
    ],
    dateScalarMode: 'timestamp',
    emitSchemaFile: path.resolve('./schema.graphql'),
    validate: false,
  });

  const MongoDBStore = connectMongoDBStore(session);
  const store = new MongoDBStore({
    uri: MONGO_URL,
    collection: 'sessions',
  });

  const app = express();
  app.disable('x-powered-by');

  const sessionHandler = session({
    store,
    ...SESS_OPTIONS,
  });

  app.use(sessionHandler);

  // Get current city from subdomain name and language from cookie
  app.use((req, _, next) => {
    const city = req.headers['x-subdomain'];
    const cookies = cookie.parse(req.headers.cookie || '');

    req.session!.city = city ? city : DEFAULT_CITY;
    req.session!.lang = cookies.lang || DEFAULT_LANG;
    next();
  });

  // Test data
  app.get('/create-test-data', async (_, res) => {
    await createTestData();
    res.send('test data created');
  });
  app.get('/clear-test-data', async (_, res) => {
    await clearTestData();
    res.send('test data removed');
  });

  // Assets
  app.get('/assets/*', cors({ origin: new RegExp('/*/') }), async (req, res) => {
    // Extract the query-parameter
    const widthString = (req.query.width as string) || undefined;
    const heightString = (req.query.height as string) || undefined;
    const format = (req.query.format as string) || 'webp';
    const path = req.path;

    // Parse to integer if possible
    let width, height;
    if (widthString) {
      width = parseInt(widthString);
    }
    if (heightString) {
      height = parseInt(heightString);
    }

    // Set the content-type of the response
    res.type(`image/${format}`);

    // Get the processed image
    const file = await getSharpImage({ path, format, width, height });

    if (file) {
      file.pipe(res);
    } else {
      res.status(404);
      res.send();
    }
  });

  const server = new ApolloServer({
    ...APOLLO_OPTIONS,
    schema,
    context: ({ req, res, connection }) => (connection ? connection.context : { req, res }),
    introspection: true,
  });

  server.applyMiddleware({
    app,
    // cors: false,
    cors: {
      // origin: IN_DEV ? DEV_ORIGIN : undefined,
      // origin: DEV_ORIGIN,
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
