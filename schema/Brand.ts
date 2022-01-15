import { ObjectId } from 'mongodb';
import { arg, extendType, inputObjectType, nonNull, objectType } from 'nexus';
import { DEFAULT_COUNTERS_OBJECT } from '../config/common';
import { COL_BRAND_COLLECTIONS, COL_BRANDS, COL_PRODUCT_FACETS } from '../db/collectionNames';
import { findDocumentByI18nField } from '../db/dao/findDocumentByI18nField';
import {
  BrandCollectionModel,
  BrandModel,
  BrandPayloadModel,
  BrandsAlphabetListModel,
  ProductFacetModel,
} from '../db/dbModels';
import { getDatabase } from '../db/mongodb';
import getResolverErrorMessage from '../lib/getResolverErrorMessage';
import { getNextNumberItemId } from '../lib/itemIdUtils';
import { getAlphabetList } from '../lib/optionUtils';
import {
  getOperationPermission,
  getRequestParams,
  getResolverValidationSchema,
} from '../lib/sessionHelpers';
import { execUpdateProductTitles } from '../lib/updateProductTitles';
import {
  addCollectionToBrandSchema,
  createBrandSchema,
  deleteCollectionFromBrandSchema,
  updateBrandSchema,
  updateCollectionInBrandSchema,
} from '../validation/brandSchema';

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
    t.nonNull.string('nameI18n');
    t.nonNull.string('itemId');
    t.json('descriptionI18n');

    // Brand name translation field resolver
    t.nonNull.field('name', {
      type: 'String',
      resolve: async (source, _args, context) => {
        const { getI18nLocale } = await getRequestParams(context);
        return getI18nLocale(source.nameI18n);
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
    // Should return brands grouped by alphabet
    t.nonNull.list.nonNull.field('getBrandAlphabetLists', {
      type: 'BrandsAlphabetList',
      description: 'Should return brands grouped by alphabet',
      args: {
        input: arg({
          type: 'BrandAlphabetInput',
        }),
      },
      resolve: async (_root, args, context): Promise<BrandsAlphabetListModel[]> => {
        const { locale } = await getRequestParams(context);
        const { db } = await getDatabase();
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
              itemId: true,
              nameI18n: true,
            },
          })
          .toArray();
        return getAlphabetList<BrandModel>({
          entityList: brands,
          locale,
        });
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
    t.boolean('showAsBreadcrumb');
    t.boolean('showAsCatalogueBreadcrumb');
    t.boolean('showInCardTitle');
    t.boolean('showInSnippetTitle');
    t.boolean('showInCatalogueTitle');
  },
});

export const UpdateBrandInput = inputObjectType({
  name: 'UpdateBrandInput',
  definition(t) {
    t.nonNull.objectId('brandId');
    t.list.nonNull.url('url');
    t.nonNull.json('nameI18n');
    t.json('descriptionI18n');
    t.boolean('showAsBreadcrumb');
    t.boolean('showAsCatalogueBreadcrumb');
    t.boolean('showInCardTitle');
    t.boolean('showInSnippetTitle');
    t.boolean('showInCatalogueTitle');
  },
});

export const AddCollectionToBrandInput = inputObjectType({
  name: 'AddCollectionToBrandInput',
  definition(t) {
    t.nonNull.objectId('brandId');
    t.nonNull.json('nameI18n');
    t.json('descriptionI18n');
    t.boolean('showAsBreadcrumb');
    t.boolean('showAsCatalogueBreadcrumb');
    t.boolean('showInCardTitle');
    t.boolean('showInSnippetTitle');
    t.boolean('showInCatalogueTitle');
  },
});

export const UpdateCollectionInBrandInput = inputObjectType({
  name: 'UpdateCollectionInBrandInput',
  definition(t) {
    t.nonNull.objectId('brandId');
    t.nonNull.objectId('brandCollectionId');
    t.nonNull.json('nameI18n');
    t.json('descriptionI18n');
    t.boolean('showAsBreadcrumb');
    t.boolean('showAsCatalogueBreadcrumb');
    t.boolean('showInCardTitle');
    t.boolean('showInSnippetTitle');
    t.boolean('showInCatalogueTitle');
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
          const { db } = await getDatabase();
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
          const itemId = await getNextNumberItemId(COL_BRANDS);
          const createdBrandResult = await brandsCollection.insertOne({
            ...args.input,
            url: (args.input.url || []).map((link) => {
              return `${link}`;
            }),
            itemId,
            ...DEFAULT_COUNTERS_OBJECT,
            _id: new ObjectId(),
            createdAt: new Date(),
            updatedAt: new Date(),
          });

          if (!createdBrandResult.acknowledged) {
            return {
              success: false,
              message: await getApiMessage('brands.create.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('brands.create.success'),
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
          const { db } = await getDatabase();
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
          if (!updatedBrandResult.ok || !updatedBrandResult.value) {
            return {
              success: false,
              message: await getApiMessage('brands.update.error'),
            };
          }

          // update product algolia indexes
          execUpdateProductTitles(`brandSlug=${updatedBrandResult.value.itemId}`);

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
          const { db } = await getDatabase();
          const brandsCollection = db.collection<BrandModel>(COL_BRANDS);
          const productsCollection = db.collection<ProductFacetModel>(COL_PRODUCT_FACETS);

          // Check brand availability
          const brand = await brandsCollection.findOne({ _id: args._id });
          if (!brand) {
            return {
              success: false,
              message: await getApiMessage('brands.delete.notFound'),
            };
          }

          // Check if brand is used in products
          const used = await productsCollection.findOne({ brandSlug: brand.itemId });
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
        const { getApiMessage } = await getRequestParams(context);
        const { db, client } = await getDatabase();
        const brandsCollection = db.collection<BrandModel>(COL_BRANDS);
        const brandsCollectionsCollection =
          db.collection<BrandCollectionModel>(COL_BRAND_COLLECTIONS);

        const session = client.startSession();

        let mutationPayload: BrandPayloadModel = {
          success: false,
          message: await getApiMessage('brandCollections.create.error'),
        };

        try {
          await session.withTransaction(async () => {
            // Permission
            const { allow, message } = await getOperationPermission({
              context,
              slug: 'createBrandCollection',
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
              schema: addCollectionToBrandSchema,
            });
            await validationSchema.validate(args.input);

            const { input } = args;
            const { brandId, ...values } = input;

            // Check brand availability
            const brand = await brandsCollection.findOne({ _id: brandId });
            if (!brand) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('brands.update.notFound'),
              };
              await session.abortTransaction();
              return;
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
              mutationPayload = {
                success: false,
                message: await getApiMessage('brandCollections.create.duplicate'),
              };
              await session.abortTransaction();
              return;
            }

            // Create brand collection
            const itemId = await getNextNumberItemId(COL_BRAND_COLLECTIONS);
            const createdBrandCollectionResult = await brandsCollectionsCollection.insertOne({
              ...values,
              _id: new ObjectId(),
              itemId,
              brandId: brand._id,
              brandSlug: brand.itemId,
              ...DEFAULT_COUNTERS_OBJECT,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
            if (!createdBrandCollectionResult.acknowledged) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('brandCollections.create.error'),
              };
              await session.abortTransaction();
              return;
            }

            // Update brand collections list
            const updatedBrandResult = await brandsCollection.findOneAndUpdate(
              { _id: brandId },
              {
                $push: {
                  collectionsIds: createdBrandCollectionResult.insertedId,
                },
                $set: {
                  updatedAt: new Date(),
                },
              },
              {
                returnDocument: 'after',
              },
            );
            const updatedBrand = updatedBrandResult.value;
            if (!updatedBrandResult.ok || !updatedBrand) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('brands.update.error'),
              };
              await session.abortTransaction();
              return;
            }

            mutationPayload = {
              success: true,
              message: await getApiMessage('brandCollections.create.success'),
              payload: updatedBrand,
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
        const { getApiMessage } = await getRequestParams(context);
        const { db, client } = await getDatabase();
        const dbBrandsCollection = db.collection<BrandModel>(COL_BRANDS);
        const dbBrandsCollectionsCollection =
          db.collection<BrandCollectionModel>(COL_BRAND_COLLECTIONS);

        const session = client.startSession();

        let mutationPayload: BrandPayloadModel = {
          success: false,
          message: await getApiMessage('brands.update.error'),
        };

        try {
          await session.withTransaction(async () => {
            // Permission
            const { allow, message } = await getOperationPermission({
              context,
              slug: 'updateBrandCollection',
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
              schema: updateCollectionInBrandSchema,
            });
            await validationSchema.validate(args.input);

            const { input } = args;
            const { brandId, brandCollectionId, ...values } = input;

            // Check brand availability
            const brand = await dbBrandsCollection.findOne({ _id: brandId });
            if (!brand) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('brands.update.notFound'),
              };
              await session.abortTransaction();
              return;
            }

            // Check brand collection availability
            const brandCollection = await dbBrandsCollection.findOne({ _id: brandId });
            if (!brandCollection) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('brandCollections.update.notFound'),
              };
              await session.abortTransaction();
              return;
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
              mutationPayload = {
                success: false,
                message: await getApiMessage('brandCollections.update.duplicate'),
              };
              await session.abortTransaction();
              return;
            }

            // Update brand collection
            const updatedBrandCollectionResult =
              await dbBrandsCollectionsCollection.findOneAndUpdate(
                { _id: brandCollectionId },
                {
                  $set: {
                    ...values,
                    updatedAt: new Date(),
                  },
                },
                {
                  returnDocument: 'after',
                },
              );
            const updatedBrandCollection = updatedBrandCollectionResult.value;
            if (!updatedBrandCollectionResult.ok || !updatedBrandCollection) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('brandCollections.update.error'),
              };
              await session.abortTransaction();
              return;
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
                returnDocument: 'after',
              },
            );
            const updatedBrand = updatedBrandResult.value;
            if (!updatedBrandResult.ok || !updatedBrand) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('brands.update.error'),
              };
              await session.abortTransaction();
              return;
            }

            // update product algolia indexes
            execUpdateProductTitles(`brandCollectionSlug=${updatedBrandCollection.itemId}`);

            mutationPayload = {
              success: true,
              message: await getApiMessage('brandCollections.update.success'),
              payload: updatedBrand,
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
        const { getApiMessage } = await getRequestParams(context);
        const { db, client } = await getDatabase();
        const dbBrandsCollection = db.collection<BrandModel>(COL_BRANDS);
        const dbBrandsCollectionsCollection =
          db.collection<BrandCollectionModel>(COL_BRAND_COLLECTIONS);
        const dbProductsCollection = db.collection<ProductFacetModel>(COL_PRODUCT_FACETS);

        const session = client.startSession();

        let mutationPayload: BrandPayloadModel = {
          success: false,
          message: await getApiMessage('brandCollections.delete.error'),
        };

        try {
          await session.withTransaction(async () => {
            // Permission
            const { allow, message } = await getOperationPermission({
              context,
              slug: 'deleteBrandCollection',
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
              schema: deleteCollectionFromBrandSchema,
            });
            await validationSchema.validate(args.input);

            const { input } = args;
            const { brandId, brandCollectionId } = input;

            // Check brand availability
            const brand = await dbBrandsCollection.findOne({ _id: brandId });
            if (!brand) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('brands.update.notFound'),
              };
              await session.abortTransaction();
              return;
            }

            // Check brand collection availability
            const brandCollection = await dbBrandsCollection.findOne({ _id: brandId });
            if (!brandCollection) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('brandCollections.delete.notFound'),
              };
              await session.abortTransaction();
              return;
            }

            // Check if brand collection is used in products
            const used = await dbProductsCollection.findOne({
              brandCollectionSlug: brandCollection.itemId,
            });
            if (used) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('brandCollections.delete.used'),
              };
              await session.abortTransaction();
              return;
            }

            // Delete brand collection
            const removedBrandCollectionResult =
              await dbBrandsCollectionsCollection.findOneAndDelete({ _id: brandCollectionId });
            if (!removedBrandCollectionResult.ok) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('brandCollections.delete.error'),
              };
              await session.abortTransaction();
              return;
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
                returnDocument: 'after',
              },
            );
            const updatedBrand = updatedBrandResult.value;
            if (!updatedBrandResult.ok || !updatedBrand) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('brands.update.error'),
              };
              await session.abortTransaction();
              return;
            }

            mutationPayload = {
              success: true,
              message: await getApiMessage('brandCollections.delete.success'),
              payload: updatedBrand,
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
