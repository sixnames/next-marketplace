import { arg, extendType, inputObjectType, nonNull, objectType } from 'nexus';
import { getDatabase } from 'db/mongodb';
import { COL_CITIES, COL_COUNTRIES } from 'db/collectionNames';
import { CityModel, CountryModel, CountryPayloadModel } from 'db/dbModels';
import { SORT_ASC } from 'config/common';
import {
  getOperationPermission,
  getRequestParams,
  getResolverValidationSchema,
} from 'lib/sessionHelpers';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { findDocumentByI18nField } from 'db/findDocumentByI18nField';
import {
  addCityToCountrySchema,
  createCountrySchema,
  deleteCityFromCountrySchema,
  updateCityInCountrySchema,
  updateCountrySchema,
} from 'validation/countrySchema';

export const Country = objectType({
  name: 'Country',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.string('name');
    t.nonNull.string('currency');
    t.nonNull.list.nonNull.objectId('citiesIds');

    // Country cities list field resolver
    t.nonNull.list.nonNull.field('cities', {
      type: 'City',
      resolve: async (source) => {
        const { db } = await getDatabase();
        const citiesCollection = db.collection<CityModel>(COL_CITIES);
        return citiesCollection.find({ _id: { $in: source.citiesIds } }).toArray();
      },
    });
  },
});

// Country Queries
export const CountryQueries = extendType({
  type: 'Query',
  definition(t) {
    // Should return countries list
    t.nonNull.list.nonNull.field('getAllCountries', {
      type: 'Country',
      description: 'Should return countries list',
      resolve: async (): Promise<CountryModel[]> => {
        const { db } = await getDatabase();
        const countriesCollection = db.collection<CountryModel>(COL_COUNTRIES);
        const countries = await countriesCollection
          .find(
            {},
            {
              sort: {
                itemId: SORT_ASC,
              },
            },
          )
          .toArray();
        return countries;
      },
    });
  },
});

export const CountryPayload = objectType({
  name: 'CountryPayload',
  definition(t) {
    t.implements('Payload');
    t.field('payload', {
      type: 'Country',
    });
  },
});

export const CreateCountryInput = inputObjectType({
  name: 'CreateCountryInput',
  definition(t) {
    t.nonNull.string('name');
    t.nonNull.string('currency');
  },
});

export const UpdateCountryInput = inputObjectType({
  name: 'UpdateCountryInput',
  definition(t) {
    t.nonNull.objectId('countryId');
    t.nonNull.string('name');
    t.nonNull.string('currency');
  },
});

export const AddCityToCountryInput = inputObjectType({
  name: 'AddCityToCountryInput',
  definition(t) {
    t.nonNull.objectId('countryId');
    t.nonNull.json('nameI18n');
    t.nonNull.string('slug');
  },
});

export const UpdateCityInCountryInput = inputObjectType({
  name: 'UpdateCityInCountryInput',
  definition(t) {
    t.nonNull.objectId('countryId');
    t.nonNull.objectId('cityId');
    t.nonNull.json('nameI18n');
    t.nonNull.string('slug');
  },
});

export const DeleteCityFromCountryInput = inputObjectType({
  name: 'DeleteCityFromCountryInput',
  definition(t) {
    t.nonNull.objectId('countryId');
    t.nonNull.objectId('cityId');
  },
});

// Country Mutations
export const CountryMutations = extendType({
  type: 'Mutation',
  definition(t) {
    // Should create country
    t.nonNull.field('createCountry', {
      type: 'CountryPayload',
      description: 'Should create country',
      args: {
        input: nonNull(
          arg({
            type: 'CreateCountryInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<CountryPayloadModel> => {
        try {
          // Permission
          const { allow, message } = await getOperationPermission({
            context,
            slug: 'createCountry',
          });
          if (!allow) {
            return {
              success: false,
              message,
            };
          }

          // Validate
          const validationSchema = await getResolverValidationSchema({
            context,
            schema: createCountrySchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const { db } = await getDatabase();
          const countriesCollection = db.collection<CountryModel>(COL_COUNTRIES);
          const { input } = args;

          // Check if country already exist
          const exist = await countriesCollection.findOne({ name: input.name });
          if (exist) {
            return {
              success: false,
              message: await getApiMessage('countries.create.duplicate'),
            };
          }

          // Create country
          const createdCountryResult = await countriesCollection.insertOne({
            ...input,
            citiesIds: [],
          });
          const createdCountry = createdCountryResult.ops[0];
          if (!createdCountryResult.result.ok || !createdCountry) {
            return {
              success: false,
              message: await getApiMessage('countries.create.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('countries.create.success'),
            payload: createdCountry,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should update country
    t.nonNull.field('updateCountry', {
      type: 'CountryPayload',
      description: 'Should update country',
      args: {
        input: nonNull(
          arg({
            type: 'UpdateCountryInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<CountryPayloadModel> => {
        try {
          // Permission
          const { allow, message } = await getOperationPermission({
            context,
            slug: 'updateCountry',
          });
          if (!allow) {
            return {
              success: false,
              message,
            };
          }

          // Validate
          const validationSchema = await getResolverValidationSchema({
            context,
            schema: updateCountrySchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const { db } = await getDatabase();
          const countriesCollection = db.collection<CountryModel>(COL_COUNTRIES);
          const { input } = args;
          const { countryId, ...values } = input;

          // Check country availability
          const country = await countriesCollection.findOne({ _id: countryId });
          if (!country) {
            return {
              success: false,
              message: await getApiMessage('countries.update.notFound'),
            };
          }

          // Check if country already exist
          const exist = await countriesCollection.findOne({
            _id: { $ne: countryId },
            name: input.name,
          });
          if (exist) {
            return {
              success: false,
              message: await getApiMessage('countries.update.duplicate'),
            };
          }

          // Create country
          const updatedCountryResult = await countriesCollection.findOneAndUpdate(
            { _id: countryId },
            {
              $set: {
                ...values,
              },
            },
            {
              returnOriginal: false,
            },
          );
          const updatedCountry = updatedCountryResult.value;
          if (!updatedCountryResult.ok || !updatedCountry) {
            return {
              success: false,
              message: await getApiMessage('countries.update.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('countries.update.success'),
            payload: updatedCountry,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should delete country
    t.nonNull.field('deleteCountry', {
      type: 'CountryPayload',
      description: 'Should delete country',
      args: {
        _id: nonNull(
          arg({
            type: 'ObjectId',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<CountryPayloadModel> => {
        const { getApiMessage } = await getRequestParams(context);
        const { db, client } = await getDatabase();
        const countriesCollection = db.collection<CountryModel>(COL_COUNTRIES);
        const citiesCollection = db.collection<CityModel>(COL_CITIES);

        const session = client.startSession();

        let mutationPayload: CountryPayloadModel = {
          success: false,
          message: await getApiMessage('cities.delete.error'),
        };

        try {
          await session.withTransaction(async () => {
            // Permission
            const { allow, message } = await getOperationPermission({
              context,
              slug: 'deleteCountry',
            });
            if (!allow) {
              mutationPayload = {
                success: false,
                message,
              };
              await session.abortTransaction();
              return;
            }

            const { _id } = args;

            // Check country availability
            const country = await countriesCollection.findOne({ _id });
            if (!country) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('countries.delete.notFound'),
              };
              await session.abortTransaction();
              return;
            }

            // Delete country
            const removedCountryResult = await countriesCollection.findOneAndDelete({ _id });
            if (!removedCountryResult.ok) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('countries.delete.error'),
              };
              await session.abortTransaction();
              return;
            }

            // Delete all country cities
            const removedCitiesResult = await citiesCollection.deleteMany({
              _id: { $in: country.citiesIds },
            });
            if (!removedCitiesResult.result.ok) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('cities.delete.error'),
              };
              await session.abortTransaction();
              return;
            }

            mutationPayload = {
              success: true,
              message: await getApiMessage('countries.delete.success'),
            };
          });

          return mutationPayload;
        } catch (e) {
          console.log(e);
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        } finally {
          await session.endSession();
        }
      },
    });

    // Should create city and add it to the country
    t.nonNull.field('addCityToCountry', {
      type: 'CountryPayload',
      description: 'Should create city and add it to the country',
      args: {
        input: nonNull(
          arg({
            type: 'AddCityToCountryInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<CountryPayloadModel> => {
        const { getApiMessage } = await getRequestParams(context);
        const { db, client } = await getDatabase();
        const countriesCollection = db.collection<CountryModel>(COL_COUNTRIES);
        const citiesCollection = db.collection<CityModel>(COL_CITIES);

        const session = client.startSession();

        let mutationPayload: CountryPayloadModel = {
          success: false,
          message: await getApiMessage('cities.create.error'),
        };

        try {
          await session.withTransaction(async () => {
            // Permission
            const { allow, message } = await getOperationPermission({
              context,
              slug: 'createCity',
            });
            if (!allow) {
              mutationPayload = {
                success: false,
                message,
              };
              await session.abortTransaction();
              return;
            }

            // Validate
            const validationSchema = await getResolverValidationSchema({
              context,
              schema: addCityToCountrySchema,
            });
            await validationSchema.validate(args.input);

            const { input } = args;
            const { countryId, ...values } = input;

            // Check country availability
            const country = await countriesCollection.findOne({ _id: countryId });
            if (!country) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('cities.create.notFound'),
              };
              await session.abortTransaction();
              return;
            }

            // Check if city already exist
            const exist = await findDocumentByI18nField({
              fieldName: 'nameI18n',
              fieldArg: values.nameI18n,
              collectionName: COL_CITIES,
              additionalQuery: {
                _id: { $in: country.citiesIds },
              },
            });
            if (exist) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('cities.create.duplicate'),
              };
              await session.abortTransaction();
              return;
            }

            // Create city
            const createdCityResult = await citiesCollection.insertOne({
              ...values,
            });
            const createdCity = createdCityResult.ops[0];
            if (!createdCityResult.result.ok || !createdCity) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('cities.create.error'),
              };
              await session.abortTransaction();
              return;
            }

            // Add created city to the country
            const updatedCountryResult = await countriesCollection.findOneAndUpdate(
              { _id: countryId },
              {
                $push: {
                  citiesIds: createdCity._id,
                },
                $set: {
                  updatedAt: new Date(),
                },
              },
              {
                returnOriginal: false,
              },
            );
            const updatedCountry = updatedCountryResult.value;
            if (!updatedCountryResult.ok || !updatedCountry) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('cities.create.error'),
              };
              await session.abortTransaction();
              return;
            }

            mutationPayload = {
              success: true,
              message: await getApiMessage('cities.create.success'),
              payload: updatedCountry,
            };
          });

          return mutationPayload;
        } catch (e) {
          console.log(e);
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        } finally {
          await session.endSession();
        }
      },
    });

    // Should update city
    t.nonNull.field('updateCityInCountry', {
      type: 'CountryPayload',
      description: 'Should update city',
      args: {
        input: nonNull(
          arg({
            type: 'UpdateCityInCountryInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<CountryPayloadModel> => {
        try {
          // Permission
          const { allow, message } = await getOperationPermission({
            context,
            slug: 'updateCity',
          });
          if (!allow) {
            return {
              success: false,
              message,
            };
          }

          // Validate
          const validationSchema = await getResolverValidationSchema({
            context,
            schema: updateCityInCountrySchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const { db } = await getDatabase();
          const countriesCollection = db.collection<CountryModel>(COL_COUNTRIES);
          const citiesCollection = db.collection<CityModel>(COL_CITIES);
          const { input } = args;
          const { countryId, cityId, ...values } = input;

          // Check country availability
          const country = await countriesCollection.findOne({ _id: countryId });
          if (!country) {
            return {
              success: false,
              message: await getApiMessage('cities.update.notFound'),
            };
          }

          // Check city availability
          const city = await citiesCollection.findOne({ _id: cityId });
          if (!city) {
            return {
              success: false,
              message: await getApiMessage('cities.update.notFound'),
            };
          }

          // Check if city already exist
          const exist = await findDocumentByI18nField({
            fieldName: 'nameI18n',
            fieldArg: values.nameI18n,
            collectionName: COL_CITIES,
            additionalQuery: {
              $and: [{ _id: { $in: country.citiesIds } }, { _id: { $ne: cityId } }],
            },
          });
          if (exist) {
            return {
              success: false,
              message: await getApiMessage('cities.update.duplicate'),
            };
          }

          // Update city
          const updatedCityResult = await citiesCollection.findOneAndUpdate(
            { _id: cityId },
            {
              $set: {
                ...values,
              },
            },
            {
              returnOriginal: false,
            },
          );
          const updatedCity = updatedCityResult.value;
          if (!updatedCityResult.ok || !updatedCity) {
            return {
              success: false,
              message: await getApiMessage('cities.update.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('cities.update.success'),
            payload: country,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should delete city
    t.nonNull.field('deleteCityFromCountry', {
      type: 'CountryPayload',
      description: 'Should delete city',
      args: {
        input: nonNull(
          arg({
            type: 'DeleteCityFromCountryInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<CountryPayloadModel> => {
        const { getApiMessage } = await getRequestParams(context);
        const { db, client } = await getDatabase();
        const countriesCollection = db.collection<CountryModel>(COL_COUNTRIES);
        const citiesCollection = db.collection<CityModel>(COL_CITIES);

        const session = client.startSession();

        let mutationPayload: CountryPayloadModel = {
          success: false,
          message: await getApiMessage('cities.delete.error'),
        };

        try {
          await session.withTransaction(async () => {
            // Permission
            const { allow, message } = await getOperationPermission({
              context,
              slug: 'deleteCity',
            });
            if (!allow) {
              mutationPayload = {
                success: false,
                message,
              };
              await session.abortTransaction();
              return;
            }

            // Validate
            const validationSchema = await getResolverValidationSchema({
              context,
              schema: deleteCityFromCountrySchema,
            });
            await validationSchema.validate(args.input);

            const { input } = args;
            const { countryId, cityId } = input;

            // Check country availability
            const country = await countriesCollection.findOne({ _id: countryId });
            if (!country) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('cities.delete.notFound'),
              };
              await session.abortTransaction();
              return;
            }

            // Check city availability
            const city = await citiesCollection.findOne({ _id: cityId });
            if (!city) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('cities.delete.notFound'),
              };
              await session.abortTransaction();
              return;
            }

            // Remove city
            const removedCityResult = await citiesCollection.findOneAndDelete({ _id: cityId });
            if (!removedCityResult.ok) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('cities.delete.error'),
              };
              await session.abortTransaction();
              return;
            }

            // Update country cities list
            const updatedCountryResult = await countriesCollection.findOneAndUpdate(
              {
                _id: countryId,
              },
              {
                $pull: {
                  citiesIds: cityId,
                },
              },
              {
                returnOriginal: false,
              },
            );
            const updatedCountry = updatedCountryResult.value;
            if (!updatedCountryResult.ok || !updatedCountry) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('cities.delete.error'),
              };
              await session.abortTransaction();
              return;
            }

            mutationPayload = {
              success: true,
              message: await getApiMessage('cities.delete.success'),
              payload: updatedCountry,
            };
          });

          return mutationPayload;
        } catch (e) {
          console.log(e);
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        } finally {
          await session.endSession();
        }
      },
    });
  },
});
