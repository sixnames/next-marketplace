import 'reflect-metadata';
import express, { Express } from 'express';
import { ApolloServer } from 'apollo-server-express';
import { APOLLO_OPTIONS, MONGO_URL, DB_OPTIONS, SESS_OPTIONS, SESSION_COLLECTION } from './config';
import {
  DEFAULT_CITY,
  DEFAULT_LANG,
  LANG_COOKIE_KEY,
  LANG_COOKIE_HEADER,
  CITY_COOKIE_KEY,
  ROLE_SLUG_GUEST,
} from '@yagu/config';
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
import {
  ProductAttributeResolver,
  ProductAttributesGroupResolver,
  ProductConnectionResolver,
  ProductResolver,
} from './resolvers/product/ProductResolver';
import { RubricResolver } from './resolvers/rubric/RubricResolver';
import {
  AttributePositioningListResolver,
  AttributeVariantResolver,
  AttributeViewVariantsListResolver,
  GendersListResolver,
  IconOptionsListResolver,
  ISOLanguagesListResolver,
  OptionsGroupVariantsListResolver,
} from './resolvers/selects/SelectsResolver';
import { RubricVariantResolver } from './resolvers/rubricVariant/RubricVariantResolver';
import { ConfigCityResolver, ConfigResolver } from './resolvers/config/ConfigResolver';
import { RoleResolver } from './resolvers/role/RoleResolver';
import { NavItemResolver } from './resolvers/navItem/NavItemResolver';
import {
  clearTestDataRoute,
  createTestDataRoute,
  testSignInRoute,
} from './routes/testingDataRoutes';
import { assetsRoute } from './routes/assetsRoutes';
import { RoleRuleResolver } from './resolvers/roleRule/RoleRuleResolver';
import { AuthField } from './decorators/methodDecorators';
import { RoleModel } from './entities/Role';
import { RoleRuleModel, RoleRuleOperationModel } from './entities/RoleRule';
import { CompanyResolver } from './resolvers/company/CompanyResolver';
import { ApolloContextInterface } from './types/context';
import { ShopResolver } from './resolvers/shop/ShopResolver';
import { ShopProductResolver } from './resolvers/shopProduct/ShopProductResolver';

// Configure env variables
require('dotenv-flow').config();

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
      ConfigCityResolver,
      NavItemResolver,
      RoleResolver,
      RoleRuleResolver,
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
      ProductConnectionResolver,
      ProductAttributesGroupResolver,
      ProductAttributeResolver,
      RubricResolver,
      RubricVariantResolver,
      UserResolver,
      CompanyResolver,
      ShopResolver,
      ShopProductResolver,
      GendersListResolver,
      AttributeVariantResolver,
      AttributePositioningListResolver,
      ISOLanguagesListResolver,
      IconOptionsListResolver,
      AttributeViewVariantsListResolver,
      OptionsGroupVariantsListResolver,
    ],
    emitSchemaFile: path.resolve('./schema.graphql'),
    validate: false,
    globalMiddlewares: [AuthField],
  });

  const app = express();
  app.disable('x-powered-by');

  // Session
  // TODO fix mongo connection in jest env
  if (process.env.NODE_ENV !== 'test') {
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
  }

  // Test data routes
  // TODO make this methods safe
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
    context: async ({ req, res, connection }: ApolloContextInterface) => {
      // Get current city from subdomain name
      // and language from cookie or user accepted language
      // City
      const city = req.headers['x-subdomain'];
      const currentCity = city ? city : DEFAULT_CITY;
      req.city = `${currentCity}`;
      res.cookie(CITY_COOKIE_KEY, currentCity);

      // Language
      const cookies = cookie.parse(req.headers.cookie || '');
      const systemLang = req.headers[LANG_COOKIE_HEADER] || '';
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

      // Set request role
      const roleRuleOperationsPopulate = {
        path: 'operations',
        model: RoleRuleOperationModel,
        options: {
          sort: {
            order: 1,
          },
        },
      };

      // console.log('Session =========================\n');
      // console.log(JSON.stringify(req.session, null, 2));
      // console.log('User ============================\n');
      // console.log(JSON.stringify(req.sessionID, null, 2));
      // console.log(JSON.stringify(req.session.user, null, 2));
      // console.log('-----------------------------------');
      // console.log('-----------------------------------');
      // console.log('-----------------------------------');

      if (req.session.user) {
        let userRole = await RoleModel.findOne({ _id: req.session!.user.role });
        if (!userRole) {
          userRole = await RoleModel.findOne({ slug: ROLE_SLUG_GUEST });
        }

        if (!userRole) {
          throw Error('Guest role not found');
        }

        req.role = userRole;
        req.roleRules = await RoleRuleModel.find({
          roleId: userRole.id,
        }).populate(roleRuleOperationsPopulate);
      } else {
        const guestRole = await RoleModel.findOne({ slug: ROLE_SLUG_GUEST });
        if (!guestRole) {
          throw Error('Guest role not found');
        }

        req.role = guestRole;
        req.roleRules = await RoleRuleModel.find({
          roleId: guestRole.id,
        }).populate(roleRuleOperationsPopulate);
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
