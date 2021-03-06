import { COL_COMPANIES, COL_SHOPS } from 'db/collectionNames';
import {
  CompanyPayloadModel,
  ShopModel,
  ShopsPaginationPayloadModel,
  UserModel,
} from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import { aggregatePagination } from 'db/utils/aggregatePagination';
import { getConfigTemplates } from 'db/utils/getConfigTemplates';
import { getReadableAddress } from 'lib/addressUtils';
import { deleteUpload } from 'lib/assetUtils/assetUtils';
import { updateCompanyDomain } from 'lib/companyUtils';
import { GEO_POINT_TYPE, IMAGE_FALLBACK } from 'lib/config/common';
import { getNextItemId, getNextNumberItemId } from 'lib/itemIdUtils';
import {
  getOperationPermission,
  getRequestParams,
  getResolverValidationSchema,
  getSessionUser,
} from 'lib/sessionHelpers';
import { generateShopSlug } from 'lib/slugUtils';
import { ObjectId } from 'mongodb';
import { arg, extendType, inputObjectType, nonNull, objectType } from 'nexus';
import {
  addShopToCompanySchema,
  createCompanySchema,
  deleteShopFromCompanySchema,
  updateCompanySchema,
} from 'validation/companySchema';
import getResolverErrorMessage from '../lib/getResolverErrorMessage';

export const Company = objectType({
  name: 'Company',
  definition(t) {
    t.implements('Base');
    t.implements('Timestamp');
    t.nonNull.string('name');
    t.nonNull.string('slug');
    t.nonNull.objectId('ownerId');
    t.string('domain');
    t.nonNull.list.nonNull.objectId('staffIds');
    t.nonNull.list.nonNull.objectId('shopsIds');
    t.nonNull.string('logo');
    t.nonNull.field('contacts', {
      type: 'Contacts',
    });

    // Company owner field resolver
    t.nonNull.field('owner', {
      type: 'User',
      resolve: async (source): Promise<UserModel> => {
        const collections = await getDbCollections();
        const usersCollection = collections.usersCollection();
        const user = await usersCollection.findOne({ _id: source.ownerId });
        if (!user) {
          throw Error('Owner not found in Company');
        }
        return user;
      },
    });

    // Company staff list resolver
    t.nonNull.list.nonNull.field('staff', {
      type: 'User',
      resolve: async (source): Promise<UserModel[]> => {
        const collections = await getDbCollections();
        const usersCollection = collections.usersCollection();
        const users = await usersCollection.find({ _id: { $in: source.staffIds } }).toArray();
        return users;
      },
    });

    // Company paginated shops resolver
    t.nonNull.field('shops', {
      type: 'ShopsPaginationPayload',
      args: {
        input: arg({
          type: 'PaginationInput',
        }),
      },
      resolve: async (source, args, context): Promise<ShopsPaginationPayloadModel> => {
        const { citySlug } = await getRequestParams(context);
        const paginationResult = await aggregatePagination<ShopModel>({
          citySlug,
          input: args.input,
          collectionName: COL_SHOPS,
          pipeline: [{ $match: { companyId: source._id } }],
        });
        return paginationResult;
      },
    });
  },
});

export const CompaniesPaginationPayload = objectType({
  name: 'CompaniesPaginationPayload',
  definition(t) {
    t.implements('PaginationPayload');
    t.nonNull.list.nonNull.field('docs', {
      type: 'Company',
    });
  },
});

export const CreateCompanyInput = inputObjectType({
  name: 'CreateCompanyInput',
  definition(t) {
    t.nonNull.string('name');
    t.nonNull.objectId('ownerId');
    t.nonNull.list.nonNull.objectId('staffIds');
    t.string('domain');
    t.nonNull.field('contacts', {
      type: 'ContactsInput',
    });
  },
});

export const UpdateCompanyInput = inputObjectType({
  name: 'UpdateCompanyInput',
  definition(t) {
    t.nonNull.objectId('companyId');
    t.nonNull.string('name');
    t.nonNull.objectId('ownerId');
    t.nonNull.list.nonNull.objectId('staffIds');
    t.string('domain');
    t.nonNull.field('contacts', {
      type: 'ContactsInput',
    });
  },
});

export const AddShopToCompanyInput = inputObjectType({
  name: 'AddShopToCompanyInput',
  definition(t) {
    t.nonNull.objectId('companyId');
    t.nonNull.string('name');
    t.nonNull.string('citySlug');
    t.string('license');
    t.nonNull.field('contacts', {
      type: 'ContactsInput',
    });
    t.nonNull.field('address', {
      type: 'AddressInput',
    });
  },
});

export const DeleteShopFromCompanyInput = inputObjectType({
  name: 'DeleteShopFromCompanyInput',
  definition(t) {
    t.nonNull.objectId('companyId');
    t.nonNull.objectId('shopId');
  },
});

export const CompanyPayload = objectType({
  name: 'CompanyPayload',
  definition(t) {
    t.implements('Payload');
    t.field('payload', {
      type: 'Company',
    });
  },
});

// Company Mutations
export const CompanyMutations = extendType({
  type: 'Mutation',
  definition(t) {
    // Should create company
    t.nonNull.field('createCompany', {
      type: 'CompanyPayload',
      description: 'Should create company',
      args: {
        input: nonNull(
          arg({
            type: 'CreateCompanyInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<CompanyPayloadModel> => {
        const { getApiMessage } = await getRequestParams(context);
        const collections = await getDbCollections();
        const sessionUser = await getSessionUser(context);
        const companiesCollection = collections.companiesCollection();
        const configsCollection = collections.configsCollection();
        const pagesCollection = collections.pagesCollection();
        const pagesGroupsCollection = collections.pagesGroupsCollection();
        const pageTemplatesCollection = collections.pageTemplatesCollection();
        const pagesGroupTemplatesCollection = collections.pagesGroupTemplatesCollection();

        const session = collections.client.startSession();

        let mutationPayload: CompanyPayloadModel = {
          success: false,
          message: await getApiMessage('companies.create.error'),
        };

        try {
          await session.withTransaction(async () => {
            // Permission
            const { allow, message } = await getOperationPermission({
              context,
              slug: 'createCompany',
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
              schema: createCompanySchema,
            });
            await validationSchema.validate(args.input);

            const { input } = args;

            // Check if company already exist
            const exist = await companiesCollection.findOne({
              name: input.name,
            });
            if (exist) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('companies.create.duplicate'),
              };
              await session.abortTransaction();
              return;
            }

            // Store company logo
            const itemId = await getNextItemId(COL_COMPANIES);
            const slug = await getNextNumberItemId(COL_COMPANIES);
            // Create company
            const createdCompanyResult = await companiesCollection.insertOne({
              ...input,
              itemId,
              slug,
              logo: IMAGE_FALLBACK,
              shopsIds: [],
              createdAt: new Date(),
              updatedAt: new Date(),
            });
            if (!createdCompanyResult.acknowledged) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('companies.create.error'),
              };
              await session.abortTransaction();
              return;
            }

            // Create company domain
            if (!sessionUser) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('companies.create.error'),
              };
              await session.abortTransaction();
              return;
            }
            const createdCompany = await companiesCollection.findOne({
              _id: createdCompanyResult.insertedId,
            });
            if (!createdCompany) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('companies.create.error'),
              };
              await session.abortTransaction();
              return;
            }
            const updatedDomainResult = await updateCompanyDomain({
              company: createdCompany,
              isNewCompany: true,
              sessionUser,
            });
            if (!updatedDomainResult) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('companies.create.error'),
              };
              await session.abortTransaction();
              return;
            }

            // Create company configs
            const configTemplates = getConfigTemplates({
              companySlug: slug,
              phone: input.contacts.phones,
              email: input.contacts.emails,
              siteName: input.name,
            });
            const createdCompanyConfigsResult = await configsCollection.insertMany(configTemplates);
            if (!createdCompanyConfigsResult.acknowledged) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('companies.create.error'),
              };
              await session.abortTransaction();
              return;
            }

            // Create company pages
            const pagesGroupTemplates = await pagesGroupTemplatesCollection.find({}).toArray();
            for await (const pagesGroupTemplate of pagesGroupTemplates) {
              const pageTemplates = await pageTemplatesCollection
                .find({
                  pagesGroupId: pagesGroupTemplate._id,
                })
                .toArray();

              if (pageTemplates.length > 0) {
                // insert group
                const createdPagesGroupResult = await pagesGroupsCollection.insertOne({
                  ...pagesGroupTemplate,
                  _id: new ObjectId(),
                  companySlug: createdCompany.slug,
                });
                if (!createdPagesGroupResult.acknowledged) {
                  continue;
                }

                // insert each page
                for await (const pageTemplate of pageTemplates) {
                  await pagesCollection.insertOne({
                    ...pageTemplate,
                    _id: new ObjectId(),
                    pagesGroupId: createdPagesGroupResult.insertedId,
                    companySlug: createdCompany.slug,
                    assetKeys: [],
                    mainBanner: null,
                    secondaryBanner: null,
                    showAsMainBanner: false,
                    showAsSecondaryBanner: false,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                  });
                }
              }
            }

            mutationPayload = {
              success: true,
              message: await getApiMessage('companies.create.success'),
              payload: createdCompany,
            };
          });

          return mutationPayload;
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        } finally {
          await session.endSession();
        }
      },
    });

    // Should update company
    t.nonNull.field('updateCompany', {
      type: 'CompanyPayload',
      description: 'Should update company',
      args: {
        input: nonNull(
          arg({
            type: 'UpdateCompanyInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<CompanyPayloadModel> => {
        try {
          // Permission
          const { allow, message } = await getOperationPermission({
            context,
            slug: 'updateCompany',
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
            schema: updateCompanySchema,
          });
          await validationSchema.validate(args.input);

          const sessionUser = await getSessionUser(context);
          const { getApiMessage } = await getRequestParams(context);
          const collections = await getDbCollections();
          const companiesCollection = collections.companiesCollection();
          const { input } = args;
          const { companyId, ...values } = input;

          if (!sessionUser) {
            return {
              success: false,
              message: await getApiMessage('companies.update.error'),
            };
          }

          // Check company availability
          const company = await companiesCollection.findOne({ _id: companyId });
          if (!company) {
            return {
              success: false,
              message: await getApiMessage('companies.update.notFound'),
            };
          }

          // Update company domain
          const updatedDomainResult = await updateCompanyDomain({
            company,
            newDomain: values.domain,
            sessionUser,
          });
          if (!updatedDomainResult) {
            return {
              success: false,
              message: await getApiMessage('companies.update.error'),
            };
          }

          // Check if company already exist
          const exist = await companiesCollection.findOne({
            name: input.name,

            _id: { $ne: companyId },
          });
          if (exist) {
            return {
              success: false,
              message: await getApiMessage('companies.update.duplicate'),
            };
          }

          // Update company
          const updatedCompanyResult = await companiesCollection.findOneAndUpdate(
            { _id: companyId },
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

          const updatedCompany = updatedCompanyResult.value;
          if (!updatedCompanyResult.ok || !updatedCompany) {
            return {
              success: false,
              message: await getApiMessage('companies.update.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('companies.update.success'),
            payload: updatedCompany,
          };
        } catch (e) {
          console.log(e);
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should delete company
    t.nonNull.field('deleteCompany', {
      type: 'CompanyPayload',
      description: 'Should delete company',
      args: {
        _id: nonNull(
          arg({
            type: 'ObjectId',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<CompanyPayloadModel> => {
        const { getApiMessage } = await getRequestParams(context);
        const collections = await getDbCollections();
        const companiesCollection = collections.companiesCollection();
        const shopsCollection = collections.shopsCollection();
        const shopProductsCollection = collections.shopProductsCollection();
        const configsCollection = collections.configsCollection();
        const pagesCollection = collections.pagesCollection();
        const pagesGroupsCollection = collections.pagesGroupsCollection();

        const session = collections.client.startSession();

        let mutationPayload: CompanyPayloadModel = {
          success: false,
          message: await getApiMessage('companies.delete.error'),
        };

        try {
          await session.withTransaction(async () => {
            // Permission
            const { allow, message } = await getOperationPermission({
              context,
              slug: 'deleteCompany',
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

            // Check company availability
            const company = await companiesCollection.findOne({ _id });
            if (!company) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('companies.delete.notFound'),
              };
              await session.abortTransaction();
              return;
            }

            // Delete company configs
            const removedConfigs = await configsCollection.deleteMany({
              companySlug: company.slug,
            });
            if (!removedConfigs.acknowledged) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('configs.delete.error'),
              };
              await session.abortTransaction();
              return;
            }

            // Delete shop products
            const removedShopsProducts = await shopProductsCollection.deleteMany({
              shopsId: { $in: company.shopsIds },
            });
            if (!removedShopsProducts.acknowledged) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('shopProducts.delete.error'),
              };
              await session.abortTransaction();
              return;
            }

            // Delete shops
            const removedShops = await shopsCollection.deleteMany({
              _id: { $in: company.shopsIds },
            });
            if (!removedShops.acknowledged) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('companies.shopsDelete.error'),
              };
              await session.abortTransaction();
              return;
            }

            // Set delete company
            const removedCompanyResult = await companiesCollection.findOneAndDelete({ _id });
            if (!removedCompanyResult.ok) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('companies.delete.error'),
              };
              await session.abortTransaction();
              return;
            }

            // Delete company page groups
            const removedPageGroupsResult = await pagesGroupsCollection.deleteMany({
              companySlug: company.slug,
            });
            if (!removedPageGroupsResult.acknowledged) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('companies.delete.error'),
              };
              await session.abortTransaction();
              return;
            }

            // Delete company pages
            const pages = await pagesCollection.find({ companySlug: company.slug }).toArray();
            for await (const page of pages) {
              // Delete page assets from cloud
              for await (const filePath of page.assetKeys) {
                await deleteUpload(filePath);
              }
              await pagesCollection.findOneAndDelete({
                _id: page._id,
              });
            }

            mutationPayload = {
              success: true,
              message: await getApiMessage('companies.delete.success'),
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

    // Should create shop and add it to the company
    t.nonNull.field('addShopToCompany', {
      type: 'CompanyPayload',
      description: 'Should create shop and add it to the company',
      args: {
        input: nonNull(
          arg({
            type: 'AddShopToCompanyInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<CompanyPayloadModel> => {
        const { getApiMessage } = await getRequestParams(context);
        const collections = await getDbCollections();
        const companiesCollection = collections.companiesCollection();
        const shopsCollection = collections.shopsCollection();

        const session = collections.client.startSession();

        let mutationPayload: CompanyPayloadModel = {
          success: false,
          message: await getApiMessage('shops.create.error'),
        };

        try {
          await session.withTransaction(async () => {
            // Permission
            const { allow, message } = await getOperationPermission({
              context,
              slug: 'createShop',
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
              schema: addShopToCompanySchema,
            });
            await validationSchema.validate(args.input);

            const { input } = args;
            const { companyId, ...values } = input;

            // Check company availability
            const company = await companiesCollection.findOne({ _id: companyId });
            if (!company) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('companies.update.notFound'),
              };
              await session.abortTransaction();
              return;
            }

            // Check if shop already exist in the company
            const exist = await shopsCollection.findOne({ name: values.name });
            if (exist) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('shops.create.duplicate'),
              };
              await session.abortTransaction();
              return;
            }

            // Store shop assets
            const itemId = await getNextItemId(COL_SHOPS);

            // Create shop
            const slug = generateShopSlug({
              name: values.name,
              itemId,
            });

            const createdShopResult = await shopsCollection.insertOne({
              ...values,
              slug,
              itemId,
              logo: IMAGE_FALLBACK,
              assets: [],
              mainImage: IMAGE_FALLBACK,
              companyId: companyId,
              companySlug: company.slug,
              rating: 0,
              createdAt: new Date(),
              updatedAt: new Date(),
              address: {
                readableAddress: getReadableAddress(values.address.addressComponents),
                addressComponents: values.address.addressComponents,
                formattedAddress: values.address.formattedAddress,
                mapCoordinates: {
                  lat: values.address.point.lat,
                  lng: values.address.point.lng,
                },
                point: {
                  type: GEO_POINT_TYPE,
                  coordinates: [values.address.point.lng, values.address.point.lat],
                },
              },
            });
            if (!createdShopResult.acknowledged) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('shops.create.error'),
              };
              await session.abortTransaction();
              return;
            }

            // Update company shops list and update timestamps
            const updatedCompanyResult = await companiesCollection.findOneAndUpdate(
              {
                _id: companyId,
              },
              {
                $push: {
                  shopsIds: createdShopResult.insertedId,
                },
                $set: {
                  updatedAt: new Date(),
                },
              },
              {
                returnDocument: 'after',
              },
            );
            const updatedCompany = updatedCompanyResult.value;
            if (!updatedCompanyResult.ok || !updatedCompany) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('companies.update.error'),
              };
              await session.abortTransaction();
              return;
            }

            mutationPayload = {
              success: true,
              message: await getApiMessage('shops.create.success'),
              payload: updatedCompany,
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

    // Should delete shop from company and db
    t.nonNull.field('deleteShopFromCompany', {
      type: 'CompanyPayload',
      description: 'Should delete shop from company and db',
      args: {
        input: nonNull(
          arg({
            type: 'DeleteShopFromCompanyInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<CompanyPayloadModel> => {
        const { getApiMessage } = await getRequestParams(context);
        const collections = await getDbCollections();
        const companiesCollection = collections.companiesCollection();
        const shopsCollection = collections.shopsCollection();
        const shopProductsCollection = collections.shopProductsCollection();

        const session = collections.client.startSession();

        let mutationPayload: CompanyPayloadModel = {
          success: false,
          message: await getApiMessage('companies.shopsDelete.error'),
        };

        try {
          await session.withTransaction(async () => {
            // Permission
            const { allow, message } = await getOperationPermission({
              context,
              slug: 'deleteShop',
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
              schema: deleteShopFromCompanySchema,
            });
            await validationSchema.validate(args.input);

            const { input } = args;
            const { companyId, shopId } = input;

            // Check company availability
            const updatedCompanyResult = await companiesCollection.findOneAndUpdate(
              { _id: companyId },
              {
                $pull: {
                  shopsIds: shopId,
                },
                $set: {
                  updatedAt: new Date(),
                },
              },
              {
                returnDocument: 'after',
              },
            );
            const updatedCompany = updatedCompanyResult.value;
            if (!updatedCompanyResult.ok || !updatedCompany) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('companies.update.notFound'),
              };
              await session.abortTransaction();
              return;
            }

            // Check shop availability
            const shop = await shopsCollection.findOne({ _id: shopId });
            if (!shop) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('shops.delete.notFound'),
              };
              await session.abortTransaction();
              return;
            }

            // Set shop products as archived
            const removedShopProducts = await shopProductsCollection.deleteMany({
              shopId: shop._id,
            });
            if (!removedShopProducts.acknowledged) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('shopProducts.delete.error'),
              };
              await session.abortTransaction();
              return;
            }

            // Set shop as archived
            const removedShopResult = await shopsCollection.findOneAndDelete({ _id: shopId });
            if (!removedShopResult.ok) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('companies.shopsDelete.error'),
              };
              await session.abortTransaction();
              return;
            }

            mutationPayload = {
              success: true,
              message: await getApiMessage('shops.delete.success'),
              payload: updatedCompany,
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
