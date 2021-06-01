import { arg, extendType, inputObjectType, nonNull, objectType } from 'nexus';
import { CountryModel, CurrencyModel, CurrencyPayloadModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { COL_COUNTRIES, COL_CURRENCIES } from 'db/collectionNames';
import { SORT_ASC } from 'config/common';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import {
  getOperationPermission,
  getRequestParams,
  getResolverValidationSchema,
} from 'lib/sessionHelpers';
import { createCurrencySchema, updateCurrencySchema } from 'validation/currencySchema';

export const Currency = objectType({
  name: 'Currency',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.string('name');
  },
});

// Currency Queries
export const CurrencyQueries = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.list.nonNull.field('getAllCurrencies', {
      type: 'Currency',
      resolve: async (): Promise<CurrencyModel[]> => {
        const { db } = await getDatabase();
        const currenciesCollection = db.collection<CurrencyModel>(COL_CURRENCIES);
        const currencies = await currenciesCollection
          .find(
            {},
            {
              sort: {
                itemId: SORT_ASC,
              },
            },
          )
          .toArray();
        return currencies;
      },
    });
  },
});

export const CurrencyPayload = objectType({
  name: 'CurrencyPayload',
  definition(t) {
    t.implements('Payload');
    t.field('payload', {
      type: 'Currency',
    });
  },
});

export const CreateCurrencyInput = inputObjectType({
  name: 'CreateCurrencyInput',
  definition(t) {
    t.nonNull.string('name');
  },
});

export const UpdateCurrencyInput = inputObjectType({
  name: 'UpdateCurrencyInput',
  definition(t) {
    t.nonNull.objectId('currencyId');
    t.nonNull.string('name');
  },
});

// Currency Mutations
export const CurrencyMutations = extendType({
  type: 'Mutation',
  definition(t) {
    // Should create currency
    t.nonNull.field('createCurrency', {
      type: 'CurrencyPayload',
      description: 'Should create currency',
      args: {
        input: nonNull(
          arg({
            type: 'CreateCurrencyInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<CurrencyPayloadModel> => {
        try {
          // Permission
          const { allow, message } = await getOperationPermission({
            context,
            slug: 'createCurrency',
          });
          if (!allow) {
            return {
              success: false,
              message,
            };
          }

          // Validation
          const validationSchema = await getResolverValidationSchema({
            context,
            schema: createCurrencySchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const { db } = await getDatabase();
          const currenciesCollection = db.collection<CurrencyModel>(COL_CURRENCIES);
          const { input } = args;

          // Check if currency already exist
          const exist = await currenciesCollection.findOne({ name: input.name });
          if (exist) {
            return {
              success: false,
              message: await getApiMessage('currencies.create.duplicate'),
            };
          }

          // Create currency
          const createdCurrencyResult = await currenciesCollection.insertOne({
            ...input,
          });
          const createdCurrency = createdCurrencyResult.ops[0];
          if (!createdCurrencyResult.result.ok || !createdCurrency) {
            return {
              success: false,
              message: await getApiMessage('currencies.create.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('currencies.create.success'),
            payload: createdCurrency,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should update currency
    t.nonNull.field('updateCurrency', {
      type: 'CurrencyPayload',
      description: 'Should update currency',
      args: {
        input: nonNull(
          arg({
            type: 'UpdateCurrencyInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<CurrencyPayloadModel> => {
        try {
          // Permission
          const { allow, message } = await getOperationPermission({
            context,
            slug: 'updateCurrency',
          });
          if (!allow) {
            return {
              success: false,
              message,
            };
          }

          // Validation
          const validationSchema = await getResolverValidationSchema({
            context,
            schema: updateCurrencySchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const { db } = await getDatabase();
          const currenciesCollection = db.collection<CurrencyModel>(COL_CURRENCIES);
          const { input } = args;
          const { currencyId, ...values } = input;

          // Check currency availability
          const currency = await currenciesCollection.findOne({ _id: currencyId });
          if (!currency) {
            return {
              success: false,
              message: await getApiMessage('currencies.update.error'),
            };
          }

          // Check if currency already exist
          const exist = await currenciesCollection.findOne({
            _id: { $ne: currencyId },
            name: input.name,
          });
          if (exist) {
            return {
              success: false,
              message: await getApiMessage('currencies.update.duplicate'),
            };
          }

          // Update currency
          const updatedCurrencyResult = await currenciesCollection.findOneAndUpdate(
            { _id: currencyId },
            {
              $set: {
                ...values,
              },
            },
          );
          const updatedCurrency = updatedCurrencyResult.value;
          if (!updatedCurrencyResult.ok || !updatedCurrency) {
            return {
              success: false,
              message: await getApiMessage('currencies.update.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('currencies.update.success'),
            payload: updatedCurrency,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should delete currency
    t.nonNull.field('deleteCurrency', {
      type: 'CurrencyPayload',
      description: 'Should delete currency',
      args: {
        _id: nonNull(
          arg({
            type: 'ObjectId',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<CurrencyPayloadModel> => {
        try {
          // Permission
          const { allow, message } = await getOperationPermission({
            context,
            slug: 'deleteCurrency',
          });
          if (!allow) {
            return {
              success: false,
              message,
            };
          }

          const { getApiMessage } = await getRequestParams(context);
          const { db } = await getDatabase();
          const currenciesCollection = db.collection<CurrencyModel>(COL_CURRENCIES);
          const countriesCollection = db.collection<CountryModel>(COL_COUNTRIES);
          const { _id } = args;

          // Check currency availability
          const currency = await currenciesCollection.findOne({ _id });
          if (!currency) {
            return {
              success: false,
              message: await getApiMessage('currencies.delete.error'),
            };
          }

          // Check if currency is used in countries
          const used = await countriesCollection.findOne({
            currency: currency.name,
          });
          if (used) {
            return {
              success: false,
              message: await getApiMessage('currencies.delete.used'),
            };
          }

          // Delete currency
          const removedCurrencyResult = await currenciesCollection.findOneAndDelete({ _id });
          const removedCurrency = removedCurrencyResult.value;
          if (!removedCurrencyResult.ok || !removedCurrency) {
            return {
              success: false,
              message: await getApiMessage('currencies.delete.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('currencies.delete.success'),
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });
  },
});
