import { getConfigTemplates } from 'lib/configsUtils';
import { arg, extendType, inputObjectType, nonNull, objectType } from 'nexus';
import {
  CompaniesPaginationPayloadModel,
  CompanyModel,
  CompanyPayloadModel,
  ConfigModel,
  ShopModel,
  ShopProductModel,
  ShopsPaginationPayloadModel,
  UserModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import {
  COL_COMPANIES,
  COL_CONFIGS,
  COL_SHOP_PRODUCTS,
  COL_SHOPS,
  COL_USERS,
} from 'db/collectionNames';
import { aggregatePagination } from 'db/aggregatePagination';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import {
  getOperationPermission,
  getRequestParams,
  getResolverValidationSchema,
} from 'lib/sessionHelpers';
import { generateCompanySlug, generateShopSlug } from 'lib/slugUtils';
import { getNextItemId } from 'lib/itemIdUtils';
import {
  addShopToCompanySchema,
  createCompanySchema,
  deleteShopFromCompanySchema,
  updateCompanySchema,
} from 'validation/companySchema';

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
    t.nonNull.field('logo', {
      type: 'Asset',
    });
    t.nonNull.field('contacts', {
      type: 'Contacts',
    });

    // Company owner field resolver
    t.nonNull.field('owner', {
      type: 'User',
      resolve: async (source): Promise<UserModel> => {
        const db = await getDatabase();
        const usersCollection = db.collection<UserModel>(COL_USERS);
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
        const db = await getDatabase();
        const usersCollection = db.collection<UserModel>(COL_USERS);
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
        const { city } = await getRequestParams(context);
        const paginationResult = await aggregatePagination<ShopModel>({
          city,
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

// Company Queries
export const CompanyQueries = extendType({
  type: 'Query',
  definition(t) {
    // Should return company by given id
    t.field('getCompany', {
      type: 'Company',
      description: 'Should return company by given id',
      args: {
        _id: nonNull(
          arg({
            type: 'ObjectId',
          }),
        ),
      },
      resolve: async (_root, args): Promise<CompanyModel> => {
        const db = await getDatabase();
        const companiesCollection = db.collection<CompanyModel>(COL_COMPANIES);
        const company = await companiesCollection.findOne({ _id: args._id });
        if (!company) {
          throw Error('Company not found by given id');
        }
        return company;
      },
    });

    // Should return paginated companies
    t.field('getAllCompanies', {
      type: 'CompaniesPaginationPayload',
      description: 'Should return paginated companies',
      args: {
        input: arg({
          type: 'PaginationInput',
        }),
      },
      resolve: async (_root, args, context): Promise<CompaniesPaginationPayloadModel> => {
        const { city } = await getRequestParams(context);
        const paginationResult = await aggregatePagination<CompanyModel>({
          collectionName: COL_COMPANIES,
          input: args.input,
          city,
        });
        return paginationResult;
      },
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
        try {
          // Permission
          const { allow, message } = await getOperationPermission({
            context,
            slug: 'createCompany',
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
            schema: createCompanySchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
          const companiesCollection = db.collection<CompanyModel>(COL_COMPANIES);
          const configsCollection = db.collection<ConfigModel>(COL_CONFIGS);
          const { input } = args;

          // Check if company already exist
          const exist = await companiesCollection.findOne({
            name: input.name,
          });
          if (exist) {
            return {
              success: false,
              message: await getApiMessage('companies.create.duplicate'),
            };
          }

          // Store company logo
          const itemId = await getNextItemId(COL_COMPANIES);

          // Create company
          const slug = generateCompanySlug({
            name: input.name,
            itemId,
          });
          const createdCompanyResult = await companiesCollection.insertOne({
            ...input,
            itemId,
            slug,
            logo: {
              index: 1,
              url: `${process.env.OBJECT_STORAGE_IMAGE_FALLBACK}`,
            },
            shopsIds: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          });

          const createdCompany = createdCompanyResult.ops[0];
          if (!createdCompanyResult.result.ok || !createdCompany) {
            return {
              success: false,
              message: await getApiMessage('companies.create.error'),
            };
          }

          // Create company configs
          const configTemplates = getConfigTemplates({
            companySlug: slug,
            phone: input.contacts.phones,
            email: input.contacts.emails,
            siteName: input.name,
          });
          const createdCompanyConfigsResult = await configsCollection.insertMany(configTemplates);
          if (!createdCompanyConfigsResult.result.ok) {
            return {
              success: false,
              message: await getApiMessage('companies.create.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('companies.create.success'),
            payload: createdCompany,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
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

          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
          const companiesCollection = db.collection<CompanyModel>(COL_COMPANIES);
          const { input } = args;
          const { companyId, ...values } = input;

          // Check company availability
          const company = await companiesCollection.findOne({ _id: companyId });
          if (!company) {
            return {
              success: false,
              message: await getApiMessage('companies.update.notFound'),
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
              returnOriginal: false,
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
        try {
          // Permission
          const { allow, message } = await getOperationPermission({
            context,
            slug: 'deleteCompany',
          });
          if (!allow) {
            return {
              success: false,
              message,
            };
          }

          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
          const companiesCollection = db.collection<CompanyModel>(COL_COMPANIES);
          const shopsCollection = db.collection<ShopModel>(COL_SHOPS);
          const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
          const configsCollection = db.collection<ConfigModel>(COL_CONFIGS);
          const { _id } = args;

          // Check company availability
          const company = await companiesCollection.findOne({ _id });
          if (!company) {
            return {
              success: false,
              message: await getApiMessage('companies.delete.notFound'),
            };
          }

          // Delete company configs
          const removedConfigs = await configsCollection.deleteMany({
            companySlug: company.slug,
          });
          if (!removedConfigs.result.ok) {
            return {
              success: false,
              message: await getApiMessage('configs.delete.error'),
            };
          }

          // Delete shop products
          const removedShopsProducts = await shopProductsCollection.deleteMany({
            shopsId: { $in: company.shopsIds },
          });
          if (!removedShopsProducts.result.ok) {
            return {
              success: false,
              message: await getApiMessage('shopProducts.delete.error'),
            };
          }

          // Delete shops
          const removedShops = await shopsCollection.deleteMany({ _id: { $in: company.shopsIds } });
          if (!removedShops.result.ok) {
            return {
              success: false,
              message: await getApiMessage('companies.shopsDelete.error'),
            };
          }

          // Set company as archived
          const removedCompanyResult = await companiesCollection.findOneAndDelete({ _id });
          if (!removedCompanyResult.ok) {
            return {
              success: false,
              message: await getApiMessage('companies.delete.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('companies.delete.success'),
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
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
        try {
          // Permission
          const { allow, message } = await getOperationPermission({
            context,
            slug: 'createShop',
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
            schema: addShopToCompanySchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
          const companiesCollection = db.collection<CompanyModel>(COL_COMPANIES);
          const shopsCollection = db.collection<ShopModel>(COL_SHOPS);
          const { input } = args;
          const { companyId, ...values } = input;

          // Check company availability
          const company = await companiesCollection.findOne({ _id: companyId });
          if (!company) {
            return {
              success: false,
              message: await getApiMessage('companies.update.notFound'),
            };
          }

          // Check if shop already exist in the company
          const exist = await shopsCollection.findOne({ name: values.name });
          if (exist) {
            return {
              success: false,
              message: await getApiMessage('shops.create.duplicate'),
            };
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
            logo: {
              index: 1,
              url: `${process.env.OBJECT_STORAGE_IMAGE_FALLBACK}`,
            },
            assets: [],
            mainImage: `${process.env.OBJECT_STORAGE_IMAGE_FALLBACK}`,
            companyId: companyId,
            createdAt: new Date(),
            updatedAt: new Date(),
            address: {
              formattedAddress: values.address.formattedAddress,
              point: {
                type: 'Point',
                coordinates: [values.address.point.lng, values.address.point.lat],
              },
            },
          });
          const createdShop = createdShopResult.ops[0];
          if (!createdShopResult.result.ok || !createdShop) {
            return {
              success: false,
              message: await getApiMessage('shops.create.error'),
            };
          }

          // Update company shops list and update timestamps
          const updatedCompanyResult = await companiesCollection.findOneAndUpdate(
            {
              _id: companyId,
            },
            {
              $push: {
                shopsIds: createdShop._id,
              },
              $set: {
                updatedAt: new Date(),
              },
            },
            {
              returnOriginal: false,
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
            message: await getApiMessage('shops.create.success'),
            payload: updatedCompany,
          };
        } catch (e) {
          console.log(e);
          console.log(JSON.stringify(e, null, 2));
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
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
        try {
          // Permission
          const { allow, message } = await getOperationPermission({
            context,
            slug: 'deleteShop',
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
            schema: deleteShopFromCompanySchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
          const companiesCollection = db.collection<CompanyModel>(COL_COMPANIES);
          const shopsCollection = db.collection<ShopModel>(COL_SHOPS);
          const shopProductsCollection = db.collection<CompanyModel>(COL_SHOP_PRODUCTS);
          const { input } = args;
          const { companyId, shopId } = input;

          // Check company availability
          const company = await companiesCollection.findOne({ _id: companyId });
          if (!company) {
            return {
              success: false,
              message: await getApiMessage('companies.update.notFound'),
            };
          }

          // Check shop availability
          const shop = await shopsCollection.findOne({ _id: shopId });
          if (!shop) {
            return {
              success: false,
              message: await getApiMessage('shops.delete.notFound'),
            };
          }

          // Set shop products as archived
          const removedShopProducts = await shopProductsCollection.deleteMany({
            shopId: shop._id,
          });
          if (!removedShopProducts.result.ok) {
            return {
              success: false,
              message: await getApiMessage('shopProducts.delete.error'),
            };
          }

          // Set shop as archived
          const removedShopResult = await shopsCollection.findOneAndDelete({ _id: shopId });
          if (!removedShopResult.ok) {
            return {
              success: false,
              message: await getApiMessage('companies.shopsDelete.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('shops.delete.success'),
            payload: company,
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
