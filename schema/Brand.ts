import { DEFAULT_COUNTERS_OBJECT } from 'config/common';
import { getAlphabetList } from 'lib/optionsUtils';
import { arg, extendType, inputObjectType, nonNull, objectType, stringArg } from 'nexus';
import {
  getOperationPermission,
  getRequestParams,
  getResolverValidationSchema,
} from 'lib/sessionHelpers';
import {
  BrandCollectionModel,
  BrandCollectionsPaginationPayloadModel,
  BrandModel,
  BrandPayloadModel,
  BrandsAlphabetListModel,
  BrandsPaginationPayloadModel,
  ProductModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { COL_BRAND_COLLECTIONS, COL_BRANDS, COL_PRODUCTS } from 'db/collectionNames';
import { aggregatePagination } from 'db/aggregatePagination';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { findDocumentByI18nField } from 'db/findDocumentByI18nField';
import { generateDefaultLangSlug } from 'lib/slugUtils';
import { getNextItemId } from 'lib/itemIdUtils';
import {
  addCollectionToBrandSchema,
  createBrandSchema,
  deleteCollectionFromBrandSchema,
  updateBrandSchema,
  updateCollectionInBrandSchema,
} from 'validation/brandSchema';

export const BrandCollectionsPaginationPayload = objectType({
  name: 'BrandCollectionsPaginationPayload',
  definition(t) {
    t.implements('PaginationPayload');
    t.nonNull.list.nonNull.field('docs', {
      type: 'BrandCollection',
    });
  },
});

export const Brand = objectType({
  name: 'Brand',
  definition(t) {
    t.implements('Base');
    t.implements('Timestamp');
    t.list.nonNull.url('url');
    t.nonNull.string('slug');
    t.nonNull.string('nameI18n');
    t.json('descriptionI18n');

    // Brand name translation field resolver
    t.nonNull.field('name', {
      type: 'String',
      resolve: async (source, _args, context) => {
        const { getI18nLocale } = await getRequestParams(context);
        return getI18nLocale(source.nameI18n);
      },
    });

    // Brand description translation field resolver
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

    // Brand collections list resolver
    t.nonNull.field('collections', {
      type: 'BrandCollectionsPaginationPayload',
      args: {
        input: arg({
          type: 'PaginationInput',
        }),
      },
      resolve: async (source, args, context): Promise<BrandCollectionsPaginationPayloadModel> => {
        const { city } = await getRequestParams(context);
        const paginationResult = await aggregatePagination<BrandCollectionModel>({
          input: args.input,
          collectionName: COL_BRAND_COLLECTIONS,
          pipeline: [{ $match: { brandId: source._id } }],
          city,
        });

        return paginationResult;
      },
    });

    // Brand collections list resolver
    t.nonNull.list.nonNull.field('collectionsList', {
      type: 'BrandCollection',
      resolve: async (source): Promise<BrandCollectionModel[]> => {
        const db = await getDatabase();
        const brandCollectionsCollection = db.collection<BrandCollectionModel>(
          COL_BRAND_COLLECTIONS,
        );
        const brands = await brandCollectionsCollection.find({ brandId: source._id }).toArray();
        return brands;
      },
    });
  },
});

export const BrandsPaginationPayload = objectType({
  name: 'BrandsPaginationPayload',
  definition(t) {
    t.implements('PaginationPayload');
    t.nonNull.list.nonNull.field('docs', {
      type: 'Brand',
    });
  },
});

export const BrandAlphabetInput = inputObjectType({
  name: 'BrandAlphabetInput',
  definition(t) {
    t.list.nonNull.string('slugs');
  },
});

export const BrandsAlphabetList = objectType({
  name: 'BrandsAlphabetList',
  definition(t) {
    t.implements('AlphabetList');
    t.nonNull.list.nonNull.field('docs', {
      type: 'Brand',
    });
  },
});

// Brand queries
export const BrandQueries = extendType({
  type: 'Query',
  definition(t) {
    // Should return brand by _id
    t.nonNull.field('getBrand', {
      type: 'Brand',
      description: 'Should return brand by _id',
      args: {
        _id: nonNull(
          arg({
            type: 'ObjectId',
          }),
        ),
      },
      resolve: async (_root, args): Promise<BrandModel> => {
        const db = await getDatabase();
        const brandCollections = db.collection<BrandModel>(COL_BRANDS);
        const brand = await brandCollections.findOne({ _id: args._id });
        if (!brand) {
          throw Error('Brand not fond by given ID');
        }
        return brand;
      },
    });

    // Should return brand by slug
    t.field('getBrandBySlug', {
      type: 'Brand',
      description: 'Should return brand by slug',
      args: {
        slug: nonNull(stringArg()),
      },
      resolve: async (_root, args): Promise<BrandModel | null> => {
        const db = await getDatabase();
        const brandCollections = db.collection<BrandModel>(COL_BRANDS);
        const brand = await brandCollections.findOne({ slug: args.slug });
        return brand;
      },
    });

    // Should return paginated brands
    t.field('getAllBrands', {
      type: 'BrandsPaginationPayload',
      description: 'Should return paginated brands',
      args: {
        input: arg({
          type: 'PaginationInput',
        }),
      },
      resolve: async (_root, args, context): Promise<BrandsPaginationPayloadModel> => {
        const { city } = await getRequestParams(context);
        const paginationResult = await aggregatePagination<BrandModel>({
          collectionName: COL_BRANDS,
          input: args.input,
          city,
        });
        return paginationResult;
      },
    });

    // Should return brands grouped by alphabet
    t.nonNull.list.nonNull.field('getBrandAlphabetLists', {
      type: 'BrandsAlphabetList',
      description: 'Should return brands grouped by alphabet',
      args: {
        input: arg({
          type: 'BrandAlphabetInput',
        }),
      },
      resolve: async (_root, args): Promise<BrandsAlphabetListModel[]> => {
        const db = await getDatabase();
        const brandsCollection = db.collection<BrandModel>(COL_BRANDS);
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

        const brands = await brandsCollection
          .find(query, {
            projection: {
              _id: true,
              slug: true,
              nameI18n: true,
            },
          })
          .toArray();
        return getAlphabetList<BrandModel>(brands);
      },
    });
  },
});

export const BrandPayload = objectType({
  name: 'BrandPayload',
  definition(t) {
    t.implements('Payload');
    t.field('payload', {
      type: 'Brand',
    });
  },
});

export const CreateBrandInput = inputObjectType({
  name: 'CreateBrandInput',
  definition(t) {
    t.list.nonNull.url('url');
    t.nonNull.json('nameI18n');
    t.json('descriptionI18n');
  },
});

export const UpdateBrandInput = inputObjectType({
  name: 'UpdateBrandInput',
  definition(t) {
    t.nonNull.objectId('brandId');
    t.list.nonNull.url('url');
    t.nonNull.json('nameI18n');
    t.json('descriptionI18n');
  },
});

export const AddCollectionToBrandInput = inputObjectType({
  name: 'AddCollectionToBrandInput',
  definition(t) {
    t.nonNull.objectId('brandId');
    t.nonNull.json('nameI18n');
    t.json('descriptionI18n');
  },
});

export const UpdateCollectionInBrandInput = inputObjectType({
  name: 'UpdateCollectionInBrandInput',
  definition(t) {
    t.nonNull.objectId('brandId');
    t.nonNull.objectId('brandCollectionId');
    t.nonNull.json('nameI18n');
    t.json('descriptionI18n');
  },
});

export const DeleteCollectionFromBrandInput = inputObjectType({
  name: 'DeleteCollectionFromBrandInput',
  definition(t) {
    t.nonNull.objectId('brandId');
    t.nonNull.objectId('brandCollectionId');
  },
});

// Brand mutations
export const BrandMutations = extendType({
  type: 'Mutation',
  definition(t) {
    // Should create brand
    t.nonNull.field('createBrand', {
      type: 'BrandPayload',
      description: 'Should create brand',
      args: {
        input: nonNull(
          arg({
            type: 'CreateBrandInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<BrandPayloadModel> => {
        try {
          // Permission
          const { allow, message } = await getOperationPermission({
            context,
            slug: 'createBrand',
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
            schema: createBrandSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
          const brandsCollection = db.collection<BrandModel>(COL_BRANDS);

          // Check if brand already exist
          const exist = await findDocumentByI18nField<BrandModel>({
            collectionName: COL_BRANDS,
            fieldName: 'nameI18n',
            fieldArg: args.input.nameI18n,
          });
          if (exist) {
            return {
              success: false,
              message: await getApiMessage('brands.create.duplicate'),
            };
          }

          // Create brand
          const slug = generateDefaultLangSlug(args.input.nameI18n);
          const itemId = await getNextItemId(COL_BRANDS);
          const createdBrandResult = await brandsCollection.insertOne({
            ...args.input,
            slug,
            itemId,
            ...DEFAULT_COUNTERS_OBJECT,
            createdAt: new Date(),
            updatedAt: new Date(),
          });

          const createdBrand = createdBrandResult.ops[0];
          if (!createdBrandResult.result.ok || !createdBrand) {
            return {
              success: false,
              message: await getApiMessage('brands.create.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('brands.create.success'),
            payload: createdBrand,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should update brand
    t.nonNull.field('updateBrand', {
      type: 'BrandPayload',
      description: 'Should update brand',
      args: {
        input: nonNull(
          arg({
            type: 'UpdateBrandInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<BrandPayloadModel> => {
        try {
          // Permission
          const { allow, message } = await getOperationPermission({
            context,
            slug: 'updateBrand',
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
            schema: updateBrandSchema,
          });
          await validationSchema.validate(args.input);

          const { input } = args;
          const { brandId, ...values } = input;
          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
          const brandsCollection = db.collection<BrandModel>(COL_BRANDS);

          // Check brand availability
          const brand = await brandsCollection.findOne({ _id: brandId });
          if (!brand) {
            return {
              success: false,
              message: await getApiMessage('brands.update.notFound'),
            };
          }

          // Check if brand already exist
          const exist = await findDocumentByI18nField<BrandModel>({
            collectionName: COL_BRANDS,
            fieldName: 'nameI18n',
            fieldArg: values.nameI18n,
            additionalQuery: {
              _id: { $ne: brandId },
            },
          });
          if (exist) {
            return {
              success: false,
              message: await getApiMessage('brands.update.duplicate'),
            };
          }

          // Update brand
          const updatedBrandResult = await brandsCollection.findOneAndUpdate(
            { _id: brandId },
            {
              $set: {
                ...values,
              },
            },
            {
              returnOriginal: false,
            },
          );

          if (!updatedBrandResult.ok || !updatedBrandResult.value) {
            return {
              success: false,
              message: await getApiMessage('brands.update.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('brands.update.success'),
            payload: updatedBrandResult.value,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should delete brand
    t.nonNull.field('deleteBrand', {
      type: 'BrandPayload',
      description: 'Should delete brand',
      args: {
        _id: nonNull(
          arg({
            type: 'ObjectId',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<BrandPayloadModel> => {
        try {
          // Permission
          const { allow, message } = await getOperationPermission({
            context,
            slug: 'deleteBrand',
          });
          if (!allow) {
            return {
              success: false,
              message,
            };
          }

          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
          const brandsCollection = db.collection<BrandModel>(COL_BRANDS);
          const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);

          // Check brand availability
          const brand = await brandsCollection.findOne({ _id: args._id });
          if (!brand) {
            return {
              success: false,
              message: await getApiMessage('brands.delete.notFound'),
            };
          }

          // Check if brand is used in products
          const used = await productsCollection.findOne({ brandSlug: brand.slug });
          if (used) {
            return {
              success: false,
              message: await getApiMessage('brands.delete.used'),
            };
          }

          // Delete brand
          const removedBrandResult = await brandsCollection.findOneAndDelete({ _id: args._id });

          if (!removedBrandResult.ok) {
            return {
              success: false,
              message: await getApiMessage('brands.delete.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('brands.delete.success'),
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should add brand collection to the brand
    t.nonNull.field('addCollectionToBrand', {
      type: 'BrandPayload',
      description: 'Should add brand collection to the brand',
      args: {
        input: nonNull(
          arg({
            type: 'AddCollectionToBrandInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<BrandPayloadModel> => {
        try {
          // Permission
          const { allow, message } = await getOperationPermission({
            context,
            slug: 'createBrandCollection',
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
            schema: addCollectionToBrandSchema,
          });
          await validationSchema.validate(args.input);

          const { input } = args;
          const { brandId, ...values } = input;
          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
          const brandsCollection = db.collection<BrandModel>(COL_BRANDS);
          const brandsCollectionsCollection = db.collection<BrandCollectionModel>(
            COL_BRAND_COLLECTIONS,
          );

          // Check brand availability
          const brand = await brandsCollection.findOne({ _id: brandId });
          if (!brand) {
            return {
              success: false,
              message: await getApiMessage('brands.update.notFound'),
            };
          }

          // Check if brand collection name already exist in brand
          const exist = await findDocumentByI18nField<BrandModel>({
            collectionName: COL_BRAND_COLLECTIONS,
            fieldName: 'nameI18n',
            fieldArg: values.nameI18n,
            additionalQuery: {
              brandId: brand._id,
            },
          });
          if (exist) {
            return {
              success: false,
              message: await getApiMessage('brandCollections.create.duplicate'),
            };
          }

          // Create brand collection
          const itemId = await getNextItemId(COL_BRAND_COLLECTIONS);
          const slug = await generateDefaultLangSlug(values.nameI18n);
          const createdBrandCollectionResult = await brandsCollectionsCollection.insertOne({
            ...values,
            itemId,
            slug,
            brandId: brand._id,
            brandSlug: brand.slug,
            ...DEFAULT_COUNTERS_OBJECT,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          const createdBrandCollection = createdBrandCollectionResult.ops[0];
          if (!createdBrandCollectionResult.result.ok || !createdBrandCollection) {
            return {
              success: false,
              message: await getApiMessage('brandCollections.create.error'),
            };
          }

          // Update brand collections list
          const updatedBrandResult = await brandsCollection.findOneAndUpdate(
            { _id: brandId },
            {
              $push: {
                collectionsIds: createdBrandCollection._id,
              },
              $set: {
                updatedAt: new Date(),
              },
            },
            {
              returnOriginal: false,
            },
          );
          if (!updatedBrandResult.ok || !updatedBrandResult.value) {
            return {
              success: false,
              message: await getApiMessage('brands.update.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('brandCollections.create.success'),
            payload: updatedBrandResult.value,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should update brand collection in the brand
    t.nonNull.field('updateCollectionInBrand', {
      type: 'BrandPayload',
      description: 'Should update brand collection in the brand',
      args: {
        input: nonNull(
          arg({
            type: 'UpdateCollectionInBrandInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<BrandPayloadModel> => {
        try {
          // Permission
          const { allow, message } = await getOperationPermission({
            context,
            slug: 'updateBrandCollection',
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
            schema: updateCollectionInBrandSchema,
          });
          await validationSchema.validate(args.input);

          const { input } = args;
          const { brandId, brandCollectionId, ...values } = input;
          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
          const dbBrandsCollection = db.collection<BrandModel>(COL_BRANDS);
          const dbBrandsCollectionsCollection = db.collection<BrandCollectionModel>(
            COL_BRAND_COLLECTIONS,
          );

          // Check brand availability
          const brand = await dbBrandsCollection.findOne({ _id: brandId });
          if (!brand) {
            return {
              success: false,
              message: await getApiMessage('brands.update.notFound'),
            };
          }

          // Check brand collection availability
          const brandCollection = await dbBrandsCollection.findOne({ _id: brandId });
          if (!brandCollection) {
            return {
              success: false,
              message: await getApiMessage('brandCollections.update.notFound'),
            };
          }

          // Check if brand collection name already exist in brand
          const exist = await findDocumentByI18nField<BrandModel>({
            collectionName: COL_BRAND_COLLECTIONS,
            fieldName: 'nameI18n',
            fieldArg: values.nameI18n,
            additionalQuery: {
              $and: [{ brandId: brand._id }, { _id: { $ne: brandCollectionId } }],
            },
          });
          if (exist) {
            return {
              success: false,
              message: await getApiMessage('brandCollections.update.duplicate'),
            };
          }

          // Update brand collection
          const createdBrandCollectionResult = await dbBrandsCollectionsCollection.findOneAndUpdate(
            { _id: brandCollectionId },
            {
              $set: {
                ...values,
                updatedAt: new Date(),
              },
            },
          );
          if (!createdBrandCollectionResult.ok) {
            return {
              success: false,
              message: await getApiMessage('brandCollections.update.error'),
            };
          }

          // Update brand timestamps
          const updatedBrandResult = await dbBrandsCollection.findOneAndUpdate(
            { _id: brandId },
            {
              $set: {
                updatedAt: new Date(),
              },
            },
            {
              returnOriginal: false,
            },
          );
          if (!updatedBrandResult.ok || !updatedBrandResult.value) {
            return {
              success: false,
              message: await getApiMessage('brands.update.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('brandCollections.update.success'),
            payload: updatedBrandResult.value,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should delete brand collection from brand
    t.nonNull.field('deleteCollectionFromBrand', {
      type: 'BrandPayload',
      description: 'Should delete brand collection from brand',
      args: {
        input: nonNull(
          arg({
            type: 'DeleteCollectionFromBrandInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<BrandPayloadModel> => {
        try {
          // Permission
          const { allow, message } = await getOperationPermission({
            context,
            slug: 'deleteBrandCollection',
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
            schema: deleteCollectionFromBrandSchema,
          });
          await validationSchema.validate(args.input);

          const { input } = args;
          const { brandId, brandCollectionId } = input;
          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
          const dbBrandsCollection = db.collection<BrandModel>(COL_BRANDS);
          const dbBrandsCollectionsCollection = db.collection<BrandCollectionModel>(
            COL_BRAND_COLLECTIONS,
          );
          const dbProductsCollection = db.collection<ProductModel>(COL_PRODUCTS);

          // Check brand availability
          const brand = await dbBrandsCollection.findOne({ _id: brandId });
          if (!brand) {
            return {
              success: false,
              message: await getApiMessage('brands.update.notFound'),
            };
          }

          // Check brand collection availability
          const brandCollection = await dbBrandsCollection.findOne({ _id: brandId });
          if (!brandCollection) {
            return {
              success: false,
              message: await getApiMessage('brandCollections.delete.notFound'),
            };
          }

          // Check if brand collection is used in products
          const used = await dbProductsCollection.findOne({
            brandCollectionSlug: brandCollection.slug,
          });
          if (used) {
            return {
              success: false,
              message: await getApiMessage('brandCollections.delete.used'),
            };
          }

          // Delete brand collection
          const removedBrandCollectionResult = await dbBrandsCollectionsCollection.findOneAndDelete(
            { _id: brandCollectionId },
          );
          if (!removedBrandCollectionResult.ok) {
            return {
              success: false,
              message: await getApiMessage('brandCollections.delete.error'),
            };
          }

          // Update brand timestamps and pull removed collection _id
          const updatedBrandResult = await dbBrandsCollection.findOneAndUpdate(
            { _id: brandId },
            {
              $pull: {
                collectionsIds: brandCollectionId,
              },
              $set: {
                updatedAt: new Date(),
              },
            },
            {
              returnOriginal: false,
            },
          );
          if (!updatedBrandResult.ok || !updatedBrandResult.value) {
            return {
              success: false,
              message: await getApiMessage('brands.update.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('brandCollections.delete.success'),
            payload: updatedBrandResult.value,
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
