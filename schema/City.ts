import { arg, extendType, nonNull, objectType, stringArg } from 'nexus';
import { SORT_DESC } from '../config/common';
import { COL_CITIES } from '../db/collectionNames';
import { aggregatePagination } from '../db/dao/aggregatePagination';
import { CitiesPaginationPayloadModel, CityModel } from '../db/dbModels';
import { getDatabase } from '../db/mongodb';
import { getRequestParams } from '../lib/sessionHelpers';

export const City = objectType({
  name: 'City',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.json('nameI18n');
    t.nonNull.string('slug');

    // City name field resolver
    t.nonNull.field('name', {
      type: 'String',
      resolve: async (source, _args, context) => {
        const { getI18nLocale } = await getRequestParams(context);
        return getI18nLocale(source.nameI18n);
      },
    });
  },
});

export const CitiesPaginationPayload = objectType({
  name: 'CitiesPaginationPayload',
  definition(t) {
    t.implements('PaginationPayload');
    t.nonNull.list.nonNull.field('docs', {
      type: 'City',
    });
  },
});

export const CityQueries = extendType({
  type: 'Query',
  definition(t) {
    // Should return city by given id
    t.nonNull.field('getCity', {
      type: 'City',
      description: 'Should return city by given id',
      args: {
        _id: nonNull(arg({ type: 'ObjectId' })),
      },
      resolve: async (_root, args): Promise<CityModel> => {
        const { db } = await getDatabase();
        const citiesCollection = db.collection<CityModel>(COL_CITIES);
        const city = await citiesCollection.findOne({ _id: args._id });
        if (!city) {
          throw Error('City not found by given _id');
        }
        return city;
      },
    });

    // Should return city by given slug
    t.nonNull.field('getCityBySlug', {
      type: 'City',
      description: 'Should return city by given slug',
      args: {
        slug: nonNull(stringArg()),
      },
      resolve: async (_root, args): Promise<CityModel> => {
        const { db } = await getDatabase();
        const citiesCollection = db.collection<CityModel>(COL_CITIES);
        const city = await citiesCollection.findOne({ slug: args.slug });
        if (!city) {
          throw Error('City not found by given slug');
        }
        return city;
      },
    });

    // Should return paginated cities
    t.nonNull.field('getAllCities', {
      type: 'CitiesPaginationPayload',
      description: 'Should return paginated cities',
      args: {
        input: arg({
          type: 'PaginationInput',
        }),
      },
      resolve: async (_root, args, context): Promise<CitiesPaginationPayloadModel> => {
        const { citySlug } = await getRequestParams(context);
        const paginationResult = await aggregatePagination<CityModel>({
          collectionName: COL_CITIES,
          input: args.input,
          citySlug,
        });
        return paginationResult;
      },
    });

    // Should return cities list
    t.nonNull.list.nonNull.field('getSessionCities', {
      type: 'City',
      description: 'Should return cities list',
      resolve: async (_root): Promise<CityModel[]> => {
        const { db } = await getDatabase();
        const citiesCollection = db.collection<CityModel>(COL_CITIES);
        const cities = await citiesCollection.find({}, { sort: { itemId: SORT_DESC } }).toArray();
        return cities;
      },
    });
  },
});
