import { DEFAULT_COUNTERS_OBJECT } from 'config/common';
import { getAlphabetList } from 'lib/optionsUtils';
import { arg, extendType, inputObjectType, nonNull, objectType, stringArg } from 'nexus';
import {
  getOperationPermission,
  getRequestParams,
  getResolverValidationSchema,
} from 'lib/sessionHelpers';
import {
  SupplierModel,
  SupplierPayloadModel,
  SuppliersAlphabetListModel,
  SuppliersPaginationPayloadModel,
  ProductModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { COL_SUPPLIERS, COL_PRODUCTS } from 'db/collectionNames';
import { aggregatePagination } from 'db/dao/aggregatePagination';
import { findDocumentByI18nField } from 'db/dao/findDocumentByI18nField';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getNextItemId } from 'lib/itemIdUtils';
import { generateDefaultLangSlug } from 'lib/slugUtils';
import { createSupplierSchema, updateSupplierSchema } from 'validation/supplierSchema';

export const Supplier = objectType({
  name: 'Supplier',
  definition(t) {
    t.implements('Base');
    t.implements('Timestamp');
    t.list.nonNull.url('url');
    t.nonNull.string('slug');
    t.nonNull.json('nameI18n');
    t.json('descriptionI18n');

    // Supplier name translation field resolver
    t.nonNull.field('name', {
      type: 'String',
      resolve: async (source, _args, context) => {
        const { getI18nLocale } = await getRequestParams(context);
        return getI18nLocale(source.nameI18n);
      },
    });

    // Supplier description translation field resolver
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

export const SuppliersPaginationPayload = objectType({
  name: 'SuppliersPaginationPayload',
  definition(t) {
    t.implements('PaginationPayload');
    t.nonNull.list.nonNull.field('docs', {
      type: 'Supplier',
    });
  },
});

export const SupplierAlphabetInput = inputObjectType({
  name: 'SupplierAlphabetInput',
  definition(t) {
    t.list.nonNull.string('slugs');
  },
});

export const SuppliersAlphabetList = objectType({
  name: 'SuppliersAlphabetList',
  definition(t) {
    t.implements('AlphabetList');
    t.nonNull.list.nonNull.field('docs', {
      type: 'Supplier',
    });
  },
});

// Supplier Queries
export const SupplierQueries = extendType({
  type: 'Query',
  definition(t) {
    // Should return supplier by given id
    t.nonNull.field('getSupplier', {
      type: 'Supplier',
      description: 'Should return supplier by given id',
      args: {
        _id: nonNull(
          arg({
            type: 'ObjectId',
          }),
        ),
      },
      resolve: async (_root, args): Promise<SupplierModel> => {
        const { db } = await getDatabase();
        const suppliersCollection = db.collection<SupplierModel>(COL_SUPPLIERS);
        const supplier = await suppliersCollection.findOne({ _id: args._id });
        if (!supplier) {
          throw Error('Supplier not found by given id');
        }
        return supplier;
      },
    });

    // Should return supplier by given slug
    t.nonNull.field('getSupplierBySlug', {
      type: 'Supplier',
      description: 'Should return supplier by given slug',
      args: {
        slug: nonNull(stringArg()),
      },
      resolve: async (_root, args): Promise<SupplierModel> => {
        const { db } = await getDatabase();
        const suppliersCollection = db.collection<SupplierModel>(COL_SUPPLIERS);
        const supplier = await suppliersCollection.findOne({ slug: args.slug });
        if (!supplier) {
          throw Error('Supplier not found by given slug');
        }
        return supplier;
      },
    });

    // Should return paginated suppliers
    t.nonNull.field('getAllSuppliers', {
      type: 'SuppliersPaginationPayload',
      description: 'Should return paginated suppliers',
      args: {
        input: arg({
          type: 'PaginationInput',
        }),
      },
      resolve: async (_root, args, context): Promise<SuppliersPaginationPayloadModel> => {
        const { city } = await getRequestParams(context);
        const paginationResult = await aggregatePagination<SupplierModel>({
          collectionName: COL_SUPPLIERS,
          input: args.input,
          city,
        });
        return paginationResult;
      },
    });

    // Should return suppliers grouped by alphabet
    t.nonNull.list.nonNull.field('getSupplierAlphabetLists', {
      type: 'SuppliersAlphabetList',
      description: 'Should return suppliers grouped by alphabet',
      args: {
        input: arg({
          type: 'SupplierAlphabetInput',
        }),
      },
      resolve: async (_root, args, context): Promise<SuppliersAlphabetListModel[]> => {
        const { locale } = await getRequestParams(context);
        const { db } = await getDatabase();
        const suppliersCollection = db.collection<SupplierModel>(COL_SUPPLIERS);
        const { input } = args;
        let query: Record<string, any> = {};
        if (input) {
          if (input.slugs) {
            query = {
              slug: {
                $in: input.slugs,
              },
            };
          }
        }

        const suppliers = await suppliersCollection
          .find(query, {
            projection: {
              _id: true,
              slug: true,
              nameI18n: true,
            },
          })
          .toArray();
        return getAlphabetList<SupplierModel>({
          entityList: suppliers,
          locale,
        });
      },
    });
  },
});

export const SupplierPayload = objectType({
  name: 'SupplierPayload',
  definition(t) {
    t.implements('Payload');
    t.field('payload', {
      type: 'Supplier',
    });
  },
});

export const CreateSupplierInput = inputObjectType({
  name: 'CreateSupplierInput',
  definition(t) {
    t.list.nonNull.url('url');
    t.nonNull.json('nameI18n');
    t.json('descriptionI18n');
  },
});

export const UpdateSupplierInput = inputObjectType({
  name: 'UpdateSupplierInput',
  definition(t) {
    t.nonNull.objectId('supplierId');
    t.nonNull.json('nameI18n');
    t.list.nonNull.url('url');
    t.json('descriptionI18n');
  },
});

// Supplier Mutations
export const SupplierMutations = extendType({
  type: 'Mutation',
  definition(t) {
    // Should create supplier
    t.nonNull.field('createSupplier', {
      type: 'SupplierPayload',
      description: 'Should create supplier',
      args: {
        input: nonNull(
          arg({
            type: 'CreateSupplierInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<SupplierPayloadModel> => {
        try {
          // Permission
          const { allow, message } = await getOperationPermission({
            context,
            slug: 'createSupplier',
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
            schema: createSupplierSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const { db } = await getDatabase();
          const suppliersCollection = db.collection<SupplierModel>(COL_SUPPLIERS);
          const { input } = args;

          // Check if supplier already exist
          const exist = await findDocumentByI18nField({
            collectionName: COL_SUPPLIERS,
            fieldArg: input.nameI18n,
            fieldName: 'nameI18n',
          });
          if (exist) {
            return {
              success: false,
              message: await getApiMessage('suppliers.create.duplicate'),
            };
          }

          // Create supplier
          const itemId = await getNextItemId(COL_SUPPLIERS);
          const slug = generateDefaultLangSlug(input.nameI18n);
          const createSupplierResult = await suppliersCollection.insertOne({
            ...input,
            itemId,
            slug,
            url: (input.url || []).map((link) => {
              return `${link}`;
            }),
            ...DEFAULT_COUNTERS_OBJECT,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          const createSupplier = createSupplierResult.ops[0];
          if (!createSupplierResult.result.ok || !createSupplier) {
            return {
              success: false,
              message: await getApiMessage('suppliers.create.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('suppliers.create.success'),
            payload: createSupplier,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should update supplier
    t.nonNull.field('updateSupplier', {
      type: 'SupplierPayload',
      description: 'Should update supplier',
      args: {
        input: nonNull(
          arg({
            type: 'UpdateSupplierInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<SupplierPayloadModel> => {
        try {
          // Permission
          const { allow, message } = await getOperationPermission({
            context,
            slug: 'updateSupplier',
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
            schema: updateSupplierSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const { db } = await getDatabase();
          const suppliersCollection = db.collection<SupplierModel>(COL_SUPPLIERS);
          const { input } = args;
          const { supplierId, ...values } = input;

          // Check supplier availability
          const supplier = await suppliersCollection.findOne({ _id: supplierId });
          if (!supplier) {
            return {
              success: false,
              message: await getApiMessage('suppliers.update.notFound'),
            };
          }

          // Check if supplier already exist
          const exist = await findDocumentByI18nField({
            collectionName: COL_SUPPLIERS,
            fieldArg: input.nameI18n,
            fieldName: 'nameI18n',
            additionalQuery: { _id: { $ne: supplierId } },
          });
          if (exist) {
            return {
              success: false,
              message: await getApiMessage('suppliers.update.duplicate'),
            };
          }

          // Update supplier
          const updatedSupplierResult = await suppliersCollection.findOneAndUpdate(
            { _id: supplierId },
            {
              $set: {
                ...values,
                url: (values.url || []).map((link) => {
                  return `${link}`;
                }),
                updatedAt: new Date(),
              },
            },
            {
              returnDocument: 'after',
            },
          );
          const updatedSupplier = updatedSupplierResult.value;
          if (!updatedSupplierResult.ok || !updatedSupplier) {
            return {
              success: false,
              message: await getApiMessage('suppliers.update.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('suppliers.update.success'),
            payload: updatedSupplier,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should delete supplier
    t.nonNull.field('deleteSupplier', {
      type: 'SupplierPayload',
      description: 'Should delete supplier',
      args: {
        _id: nonNull(
          arg({
            type: 'ObjectId',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<SupplierPayloadModel> => {
        try {
          // Permission
          const { allow, message } = await getOperationPermission({
            context,
            slug: 'deleteSupplier',
          });
          if (!allow) {
            return {
              success: false,
              message,
            };
          }

          const { getApiMessage } = await getRequestParams(context);
          const { db } = await getDatabase();
          const suppliersCollection = db.collection<SupplierModel>(COL_SUPPLIERS);
          const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
          const { _id } = args;

          // Check supplier availability
          const supplier = await suppliersCollection.findOne({ _id });
          if (!supplier) {
            return {
              success: false,
              message: await getApiMessage('suppliers.delete.notFound'),
            };
          }

          // Check if supplier is used in products
          const used = await productsCollection.findOne({ supplierSlugs: supplier.slug });
          if (used) {
            return {
              success: false,
              message: await getApiMessage('suppliers.delete.used'),
            };
          }

          // Delete supplier
          const removedSupplierResult = await suppliersCollection.findOneAndDelete({ _id });
          if (!removedSupplierResult.ok) {
            return {
              success: false,
              message: await getApiMessage('suppliers.delete.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('suppliers.delete.success'),
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
