import 'reflect-metadata';
import express, { Express } from 'express';
import { ApolloServer } from 'apollo-server-express';
import {
  APOLLO_OPTIONS,
  DEFAULT_CITY,
  DEFAULT_LANG,
  MONGO_URL,
  LANG_COOKIE_KEY,
  LANG_COOKIE_HEADER,
  CITY_COOKIE_KEY,
  DB_OPTIONS,
  SESS_OPTIONS,
} from './config';
import { buildSchemaSync } from 'type-graphql';
import cookie from 'cookie';
import path from 'path';
import cors from 'cors';
import { LanguageModel } from './entities/Language';
import mongoose from 'mongoose';
import connectMongoDBStore from 'connect-mongodb-session';
import session from 'express-session';
import { UserResolver } from './resolvers/user/UserResolver';
import { CityResolver } from './resolvers/city/CityResolver';
import { CountryResolver } from './resolvers/country/CountryResolver';
import { LanguageResolver } from './resolvers/languages/LanguageResolver';
import { CurrencyResolver } from './resolvers/currency/CurrencyResolver';
import { AttributeResolver } from './resolvers/attribute/AttributeResolver';
import { AttributesGroupResolver } from './resolvers/attributesGroup/AttributesGroupResolver';
import { CatalogueDataResolver } from './resolvers/catalogueData/CatalogueDataResolver';
import { MessageResolver } from './resolvers/message/MessageResolver';
import { MetricResolver } from './resolvers/metric/MetricResolver';
import { OptionResolver } from './resolvers/option/OptionResolver';
import { OptionsGroupResolver } from './resolvers/optionsGroup/OptionsGroupResolver';
import { ProductResolver } from './resolvers/product/ProductResolver';
import { RubricResolver } from './resolvers/rubric/RubricResolver';
import {
  AttributePositioningListResolver,
  AttributeVariantResolver,
  GendersListResolver,
  ISOLanguagesListResolver,
} from './resolvers/selects/SelectsResolver';
import { RubricVariantResolver } from './resolvers/rubricVariant/RubricVariantResolver';
import { ConfigResolver } from './resolvers/config/ConfigResolver';
import {
  clearTestDataRoute,
  createTestDataRoute,
  getMockDataRoute,
  testSignInRoute,
} from '../routes/testingDataRoutes';
import { assetsRoute } from '../routes/assetsRoutes';

interface CreateAppInterface {
  app: Express;
  server: ApolloServer;
}

const createApp = async (): Promise<CreateAppInterface> => {
  // Mongoose connection
  await mongoose.connect(MONGO_URL, DB_OPTIONS);

  // GQL Schema
  const schema = buildSchemaSync({
    resolvers: [
      ConfigResolver,
      AttributeResolver,
      AttributesGroupResolver,
      CatalogueDataResolver,
      CityResolver,
      CountryResolver,
      CurrencyResolver,
      LanguageResolver,
      MessageResolver,
      MetricResolver,
      OptionResolver,
      OptionsGroupResolver,
      ProductResolver,
      RubricResolver,
      RubricVariantResolver,
      UserResolver,
      GendersListResolver,
      AttributeVariantResolver,
      AttributePositioningListResolver,
      ISOLanguagesListResolver,
    ],
    dateScalarMode: 'timestamp',
    emitSchemaFile: path.resolve('./schema.graphql'),
    validate: false,
  });

  const app = express();
  app.disable('x-powered-by');

  // Session
  const MongoDBStore = connectMongoDBStore(session);
  const store = new MongoDBStore({
    uri: MONGO_URL,
    collection: 'sessions',
  });
  const sessionHandler = session({
    store,
    ...SESS_OPTIONS,
  });
  app.use(sessionHandler);

  // Test data routes
  // TODO make this methods safe
  app.get('/get-mock-data', getMockDataRoute);
  app.get('/create-test-data', createTestDataRoute);
  app.get('/clear-test-data', clearTestDataRoute);
  app.get('/test-sign-in', testSignInRoute);

  // Assets route
  app.get('/assets/*', cors({ origin: new RegExp('/*/') }), assetsRoute);

  // Apollo server
  const server = new ApolloServer({
    ...APOLLO_OPTIONS,
    schema,
    introspection: true,
    context: async ({ req, res, connection }) => {
      // Get current city from subdomain name
      // and language from cookie or user accepted language
      // City
      const city = req.headers['x-subdomain'];
      const currentCity = city ? city : DEFAULT_CITY;
      req.city = `${currentCity}`;
      res.cookie(CITY_COOKIE_KEY, currentCity);

      // Language
      const cookies = cookie.parse(req.headers.cookie || '');
      const systemLang = (req.headers[LANG_COOKIE_HEADER] || '').slice(0, 2);
      const cookieLang = cookies[LANG_COOKIE_KEY];
      const clientLanguage = cookieLang || systemLang;

      const languageExists = await LanguageModel.exists({ key: clientLanguage });
      const defaultLanguage = await LanguageModel.findOne({ isDefault: true });
      const defaultLanguageKey = defaultLanguage ? defaultLanguage.key : DEFAULT_LANG;

      req.defaultLang = defaultLanguageKey;

      if (languageExists) {
        req.lang = clientLanguage;
      } else {
        res.cookie(LANG_COOKIE_KEY, defaultLanguageKey);
        req.lang = defaultLanguageKey;
      }

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
