import 'reflect-metadata';
import session from 'express-session';
import express, { Express } from 'express';
import { ApolloServer } from 'apollo-server-express';
import {
  APOLLO_OPTIONS,
  SESS_OPTIONS,
  DEFAULT_CITY,
  DEFAULT_LANG,
  MONGO_URL,
  LANG_COOKIE_KEY,
  ROLE_ADMIN,
  ROLE_CUSTOMER,
  ROLE_MANAGER,
  LANG_COOKIE_HEADER,
  CITY_COOKIE_KEY,
} from './config';
import connectMongoDBStore from 'connect-mongodb-session';
import { buildSchemaSync } from 'type-graphql';
import { getSharpImage } from './utils/assets/getSharpImage';
import createTestData from './utils/testUtils/createTestData';
import clearTestData from './utils/testUtils/clearTestData';
import cookie from 'cookie';
import path from 'path';
import cors from 'cors';
import { attemptSignIn } from './utils/auth';
import { LanguageModel } from './entities/Language';

const createApp = (): { app: Express; server: ApolloServer } => {
  const schema = buildSchemaSync({
    resolvers: [path.resolve(__dirname, 'resolvers', '**', '*Resolver.ts')],
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

  // Get current city from subdomain name
  // and language from cookie or user accepted language
  app.use(async (req, res, next) => {
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

    next();
  });

  // Test data
  // TODO make this methods safe
  app.get('/create-test-data', async (_, res) => {
    await createTestData();

    // set default lang for tests
    res.cookie(LANG_COOKIE_KEY, DEFAULT_LANG);
    res.send('test data created');
  });

  app.get('/clear-test-data', async (_, res) => {
    await clearTestData();
    res.send('test data removed');
  });

  app.get('/test-sign-in', async (req, res) => {
    const lang = req.lang;
    const { email, password } = req.query;
    const { user, message } = await attemptSignIn(`${email}`, `${password}`, lang);

    if (!user) {
      res.status(401);
      res.send(message);
      return;
    }

    req.session!.userId = user.id;
    req.session!.userRole = user.role;
    req.session!.isAdmin = user.role === ROLE_ADMIN;
    req.session!.isCustomer = user.role === ROLE_CUSTOMER;
    req.session!.isManager = user.role === ROLE_MANAGER;

    res.send('signed in');
  });
  // end of Test data

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
