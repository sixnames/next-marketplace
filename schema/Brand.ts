import { ObjectId } from 'mongodb';
import { arg, extendType, inputObjectType, nonNull } from 'nexus';
import { DEFAULT_COUNTERS_OBJECT } from 'config/common';
import { COL_BRAND_COLLECTIONS, COL_BRANDS, COL_PRODUCT_FACETS } from 'db/collectionNames';
import { findDocumentByI18nField } from 'db/dao/findDocumentByI18nField';
import {
  BrandCollectionModel,
  BrandModel,
  BrandPayloadModel,
  ProductFacetModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import getResolverErrorMessage from '../lib/getResolverErrorMessage';
import { getNextNumberItemId } from 'lib/itemIdUtils';
import {
  getOperationPermission,
  getRequestParams,
  getResolverValidationSchema,
} from 'lib/sessionHelpers';
import { execUpdateProductTitles } from 'lib/updateProductTitles';
import { addCollectionToBrandSchema, updateCollectionInBrandSchema } from 'validation/brandSchema';

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

// Brand mutations
export const BrandMutations = extendType({
  type: 'Mutation',
  definition(t) {
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
