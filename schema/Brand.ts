import { arg, extendType, nonNull } from 'nexus';
import { COL_BRAND_COLLECTIONS, COL_BRANDS, COL_PRODUCT_FACETS } from 'db/collectionNames';
import {
  BrandCollectionModel,
  BrandModel,
  BrandPayloadModel,
  ProductFacetModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import getResolverErrorMessage from '../lib/getResolverErrorMessage';
import { getOperationPermission, getRequestParams } from 'lib/sessionHelpers';

// Brand mutations
export const BrandMutations = extendType({
  type: 'Mutation',
  definition(t) {
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
