import { arg, extendType, inputObjectType, nonNull, objectType, stringArg } from 'nexus';
import { getRequestParams, getResolverValidationSchema } from 'lib/sessionHelpers';
import {
  ManufacturerModel,
  ManufacturerPayloadModel,
  ManufacturersPaginationPayloadModel,
  ProductModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { COL_MANUFACTURERS, COL_PRODUCTS } from 'db/collectionNames';
import { aggregatePagination } from 'db/aggregatePagination';
import { findDocumentByI18nField } from 'db/findDocumentByI18nField';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getNextItemId } from 'lib/itemIdUtils';
import { generateDefaultLangSlug } from 'lib/slugUtils';
import { createManufacturerSchema, updateManufacturerSchema } from 'validation/manufacturerSchema';

export const Manufacturer = objectType({
  name: 'Manufacturer',
  definition(t) {
    t.implements('Base');
    t.implements('Timestamp');
    t.list.nonNull.url('url');
    t.nonNull.string('slug');
    t.nonNull.json('nameI18n');
    t.json('descriptionI18n');

    // Manufacturer name translation field resolver
    t.nonNull.field('name', {
      type: 'String',
      resolve: async (source, _args, context) => {
        const { getI18nLocale } = await getRequestParams(context);
        return getI18nLocale(source.nameI18n);
      },
    });

    // Manufacturer description translation field resolver
    t.field('description', {
      type: 'String',
      resolve: async (source, _args, context) => {
        if (!source.descriptionI18n) {
          return null;
        }
        const { getI18nLocale } = await getRequestParams(context);
        return getI18nLocale(source.descriptionI18n);
      },
    });
  },
});

export const ManufacturersPaginationPayload = objectType({
  name: 'ManufacturersPaginationPayload',
  definition(t) {
    t.implements('PaginationPayload');
    t.nonNull.list.nonNull.field('docs', {
      type: 'Manufacturer',
    });
  },
});

// Manufacturer Queries
export const ManufacturerQueries = extendType({
  type: 'Query',
  definition(t) {
    // Should return manufacturer by given id
    t.nonNull.field('getManufacturer', {
      type: 'Manufacturer',
      description: 'Should return manufacturer by given id',
      args: {
        _id: nonNull(
          arg({
            type: 'ObjectId',
          }),
        ),
      },
      resolve: async (_root, args): Promise<ManufacturerModel> => {
        const db = await getDatabase();
        const manufacturersCollection = db.collection<ManufacturerModel>(COL_MANUFACTURERS);
        const manufacturer = await manufacturersCollection.findOne({ _id: args._id });
        if (!manufacturer) {
          throw Error('Manufacturer not found by given id');
        }
        return manufacturer;
      },
    });

    // Should return manufacturer by given slug
    t.nonNull.field('getManufacturerBySlug', {
      type: 'Manufacturer',
      description: 'Should return manufacturer by given slug',
      args: {
        slug: nonNull(stringArg()),
      },
      resolve: async (_root, args): Promise<ManufacturerModel> => {
        const db = await getDatabase();
        const manufacturersCollection = db.collection<ManufacturerModel>(COL_MANUFACTURERS);
        const manufacturer = await manufacturersCollection.findOne({ slug: args.slug });
        if (!manufacturer) {
          throw Error('Manufacturer not found by given slug');
        }
        return manufacturer;
      },
    });

    // Should return paginated manufacturers
    t.nonNull.field('getAllManufacturers', {
      type: 'ManufacturersPaginationPayload',
      description: 'Should return paginated manufacturers',
      args: {
        input: arg({
          type: 'PaginationInput',
        }),
      },
      resolve: async (_root, args, context): Promise<ManufacturersPaginationPayloadModel> => {
        const { city } = await getRequestParams(context);
        const paginationResult = await aggregatePagination<ManufacturerModel>({
          collectionName: COL_MANUFACTURERS,
          input: args.input,
          city,
        });
        return paginationResult;
      },
    });

    // Should return manufacturers list
    t.nonNull.list.nonNull.field('getManufacturersOptions', {
      type: 'Manufacturer',
      description: 'Should return manufacturers list',
      resolve: async (_root): Promise<ManufacturerModel[]> => {
        const db = await getDatabase();
        const manufacturersCollection = db.collection<ManufacturerModel>(COL_MANUFACTURERS);
        const manufacturers = await manufacturersCollection.find({}).toArray();
        return manufacturers;
      },
    });
  },
});

export const ManufacturerPayload = objectType({
  name: 'ManufacturerPayload',
  definition(t) {
    t.implements('Payload');
    t.field('payload', {
      type: 'Manufacturer',
    });
  },
});

export const CreateManufacturerInput = inputObjectType({
  name: 'CreateManufacturerInput',
  definition(t) {
    t.list.nonNull.url('url');
    t.nonNull.json('nameI18n');
    t.json('descriptionI18n');
  },
});

export const UpdateManufacturerInput = inputObjectType({
  name: 'UpdateManufacturerInput',
  definition(t) {
    t.nonNull.objectId('manufacturerId');
    t.nonNull.json('nameI18n');
    t.list.nonNull.url('url');
    t.json('descriptionI18n');
  },
});

// Manufacturer Mutations
export const ManufacturerMutations = extendType({
  type: 'Mutation',
  definition(t) {
    // Should create manufacturer
    t.nonNull.field('createManufacturer', {
      type: 'ManufacturerPayload',
      description: 'Should create manufacturer',
      args: {
        input: nonNull(
          arg({
            type: 'CreateManufacturerInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<ManufacturerPayloadModel> => {
        try {
          // Validate
          const validationSchema = await getResolverValidationSchema({
            context,
            schema: createManufacturerSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
          const manufacturersCollection = db.collection<ManufacturerModel>(COL_MANUFACTURERS);
          const { input } = args;

          // Check if manufacturer already exist
          const exist = await findDocumentByI18nField({
            collectionName: COL_MANUFACTURERS,
            fieldArg: input.nameI18n,
            fieldName: 'nameI18n',
          });
          if (exist) {
            return {
              success: false,
              message: await getApiMessage('manufacturers.create.duplicate'),
            };
          }

          // Create manufacturer
          const itemId = await getNextItemId(COL_MANUFACTURERS);
          const slug = generateDefaultLangSlug(input.nameI18n);
          const createManufacturerResult = await manufacturersCollection.insertOne({
            ...input,
            itemId,
            slug,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          const createManufacturer = createManufacturerResult.ops[0];
          if (!createManufacturerResult.result.ok || !createManufacturer) {
            return {
              success: false,
              message: await getApiMessage('manufacturers.create.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('manufacturers.create.success'),
            payload: createManufacturer,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should update manufacturer
    t.nonNull.field('updateManufacturer', {
      type: 'ManufacturerPayload',
      description: 'Should update manufacturer',
      args: {
        input: nonNull(
          arg({
            type: 'UpdateManufacturerInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<ManufacturerPayloadModel> => {
        try {
          // Validate
          const validationSchema = await getResolverValidationSchema({
            context,
            schema: updateManufacturerSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
          const manufacturersCollection = db.collection<ManufacturerModel>(COL_MANUFACTURERS);
          const { input } = args;
          const { manufacturerId, ...values } = input;

          // Check manufacturer availability
          const manufacturer = await manufacturersCollection.findOne({ _id: manufacturerId });
          if (!manufacturer) {
            return {
              success: false,
              message: await getApiMessage('manufacturers.update.notFound'),
            };
          }

          // Check if manufacturer already exist
          const exist = await findDocumentByI18nField({
            collectionName: COL_MANUFACTURERS,
            fieldArg: input.nameI18n,
            fieldName: 'nameI18n',
            additionalQuery: { _id: { $ne: manufacturerId } },
          });
          if (exist) {
            return {
              success: false,
              message: await getApiMessage('manufacturers.update.duplicate'),
            };
          }

          // Update manufacturer
          const updatedManufacturerResult = await manufacturersCollection.findOneAndUpdate(
            { _id: manufacturerId },
            {
              $set: {
                ...values,
                updatedAt: new Date(),
              },
            },
            {
              returnOriginal: false,
            },
          );
          const updatedManufacturer = updatedManufacturerResult.value;
          if (!updatedManufacturerResult.ok || !updatedManufacturer) {
            return {
              success: false,
              message: await getApiMessage('manufacturers.update.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('manufacturers.update.success'),
            payload: updatedManufacturer,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should delete manufacturer
    t.nonNull.field('deleteManufacturer', {
      type: 'ManufacturerPayload',
      description: 'Should delete manufacturer',
      args: {
        _id: nonNull(
          arg({
            type: 'ObjectId',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<ManufacturerPayloadModel> => {
        try {
          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
          const manufacturersCollection = db.collection<ManufacturerModel>(COL_MANUFACTURERS);
          const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
          const { _id } = args;

          // Check manufacturer availability
          const manufacturer = await manufacturersCollection.findOne({ _id });
          if (!manufacturer) {
            return {
              success: false,
              message: await getApiMessage('manufacturers.delete.notFound'),
            };
          }

          // Check if manufacturer is used in products
          const used = await productsCollection.findOne({ manufacturerSlug: manufacturer.slug });
          if (used) {
            return {
              success: false,
              message: await getApiMessage('manufacturers.delete.used'),
            };
          }

          // Delete manufacturer
          const removedManufacturerResult = await manufacturersCollection.findOneAndDelete({ _id });
          if (!removedManufacturerResult.ok) {
            return {
              success: false,
              message: await getApiMessage('manufacturers.delete.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('manufacturers.delete.success'),
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
