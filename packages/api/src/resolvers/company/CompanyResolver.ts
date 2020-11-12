import {
  Arg,
  Field,
  FieldResolver,
  ID,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
} from 'type-graphql';
import { Company, CompanyModel, PaginatedCompaniesResponse } from '../../entities/Company';
import { User, UserModel } from '../../entities/User';
import { DocumentType } from '@typegoose/typegoose';
import PayloadType from '../common/PayloadType';
import { CreateCompanyInput } from './CreateCompanyInput';
import { generateSlug } from '../../utils/slug';
import storeUploads from '../../utils/assets/storeUploads';
import { ASSETS_DIST_COMPANIES, ASSETS_DIST_SHOPS_LOGOS, ASSETS_DIST_SHOPS } from '../../config';
import { RoleRuleModel } from '../../entities/RoleRule';
import { AuthMethod, ValidateMethod } from '../../decorators/methodDecorators';
import {
  CustomFilter,
  Localization,
  LocalizationPayloadInterface,
} from '../../decorators/parameterDecorators';
import { FilterQuery } from 'mongoose';
import {
  addShopToCompanySchema,
  createCompanySchema,
  updateCompanySchema,
  updateShopInCompanySchema,
} from '@yagu/validation';
import getResolverErrorMessage from '../../utils/getResolverErrorMessage';
import { UpdateCompanyInput } from './UpdateCompanyInput';
import { Shop, ShopModel } from '../../entities/Shop';
import { ShopProductModel } from '../../entities/ShopProduct';
import { AddShopToCompanyInput } from './AddShopToCompanyInput';
import del from 'del';
import { UpdateShopInCompanyInput } from './UpdateShopInCompanyInput';
import { DeleteShopFromCompanyInput } from './DeleteShopFromCompanyInput';
import { CompanyPaginateInput } from './CompanyPaginateInput';
import generatePaginationOptions from '../../utils/generatePaginationOptions';

const {
  operationConfigCreate,
  operationConfigRead,
  operationConfigUpdate,
  operationConfigDelete,
} = RoleRuleModel.getOperationsConfigs(Company.name);

const {
  operationConfigCreate: operationConfigShopCreate,
  operationConfigUpdate: operationConfigShopUpdate,
  operationConfigDelete: operationConfigShopDelete,
} = RoleRuleModel.getOperationsConfigs(Shop.name);

@ObjectType()
class CompanyPayloadtype extends PayloadType() {
  @Field((_type) => Company, { nullable: true })
  company?: Company;
}

@Resolver((_for) => Company)
export class CompanyResolver {
  @Query((_returns) => Company)
  @AuthMethod(operationConfigRead)
  async getCompany(
    @CustomFilter(operationConfigRead) customFiler: FilterQuery<Company>,
    @Arg('id', (_type) => ID) id: string,
  ): Promise<Company> {
    const company = await CompanyModel.findOne({ _id: id, ...customFiler });
    if (!company) {
      throw Error('Company not found');
    }
    return company;
  }

  @Query((_returns) => PaginatedCompaniesResponse)
  @AuthMethod(operationConfigRead)
  async getAllCompanies(
    @CustomFilter(operationConfigRead) customFilter: FilterQuery<Shop>,
    @Arg('input', { nullable: true, defaultValue: {} })
    input: CompanyPaginateInput,
  ): Promise<PaginatedCompaniesResponse> {
    const { limit = 100, page = 1, sortBy = 'createdAt', sortDir = 'desc' } = input;
    const { options } = generatePaginationOptions({
      limit,
      page,
      sortDir,
      sortBy,
    });
    return CompanyModel.paginate({ ...customFilter }, options);
  }

  @Mutation((_returns) => CompanyPayloadtype)
  @ValidateMethod({ schema: createCompanySchema })
  @AuthMethod(operationConfigCreate)
  async createCompany(
    @Localization() { getApiMessage }: LocalizationPayloadInterface,
    @Arg('input') input: CreateCompanyInput,
  ): Promise<CompanyPayloadtype> {
    try {
      const { nameString, logo } = input;
      const exist = await CompanyModel.findOne({ nameString });
      if (exist) {
        return {
          success: false,
          message: await getApiMessage('companies.create.duplicate'),
        };
      }

      const slug = generateSlug(nameString);
      const [assetsResult] = await storeUploads({
        files: [logo[0]],
        slug,
        dist: ASSETS_DIST_COMPANIES,
      });
      const company = await CompanyModel.create({
        ...input,
        logo: assetsResult,
        slug,
        shops: [],
      });

      if (!company) {
        return {
          success: false,
          message: await getApiMessage('companies.create.error'),
        };
      }

      return {
        success: true,
        message: await getApiMessage('companies.create.success'),
        company,
      };
    } catch (e) {
      return {
        success: false,
        message: await getResolverErrorMessage(e),
      };
    }
  }

  @Mutation((_returns) => CompanyPayloadtype)
  @ValidateMethod({ schema: updateCompanySchema })
  @AuthMethod(operationConfigUpdate)
  async updateCompany(
    @Localization() { getApiMessage }: LocalizationPayloadInterface,
    @CustomFilter(operationConfigRead) customFiler: FilterQuery<Company>,
    @Arg('input') input: UpdateCompanyInput,
  ): Promise<CompanyPayloadtype> {
    try {
      const { nameString, logo, id } = input;
      const company = await CompanyModel.findOne({ _id: id, ...customFiler });
      if (!company) {
        return {
          success: false,
          message: await getApiMessage('companies.update.notFound'),
        };
      }

      const exist = await CompanyModel.findOne({ nameString });
      if (exist) {
        return {
          success: false,
          message: await getApiMessage('companies.update.duplicate'),
        };
      }

      // Remove old assets
      const filesPath = `./assets/${ASSETS_DIST_COMPANIES}/${company.slug}`;
      const removedAssets = await del(filesPath);

      const slug = generateSlug(nameString);
      const [assetsResult] = await storeUploads({
        files: [logo[0]],
        slug,
        dist: ASSETS_DIST_COMPANIES,
      });
      const updatedCompany = await CompanyModel.findOneAndUpdate(
        {
          _id: id,
        },
        {
          ...input,
          logo: assetsResult,
          slug,
        },
        {
          new: true,
        },
      );

      if (!updatedCompany || !removedAssets) {
        return {
          success: false,
          message: await getApiMessage('companies.update.error'),
        };
      }

      return {
        success: true,
        message: await getApiMessage('companies.update.success'),
        company: updatedCompany,
      };
    } catch (e) {
      return {
        success: false,
        message: await getResolverErrorMessage(e),
      };
    }
  }

  @Mutation((_returns) => CompanyPayloadtype)
  @AuthMethod(operationConfigDelete)
  async deleteCompany(
    @Localization() { getApiMessage }: LocalizationPayloadInterface,
    @CustomFilter(operationConfigRead) customFiler: FilterQuery<Company>,
    @Arg('id', (_type) => ID) id: string,
  ): Promise<CompanyPayloadtype> {
    try {
      const company = await CompanyModel.findOne({ _id: id, ...customFiler });
      if (!company) {
        return {
          success: false,
          message: await getApiMessage('companies.delete.notFound'),
        };
      }

      // Remove all shops and products
      const shops = await ShopModel.find({ _id: { $in: company.shops } });

      // remove shops assets
      for await (const shop of shops) {
        const assetsPath = `./assets/${ASSETS_DIST_SHOPS}/${shop.slug}`;
        const logoPath = `./assets/${ASSETS_DIST_SHOPS_LOGOS}/${shop.slug}`;
        await del(assetsPath);
        await del(logoPath);
      }

      // remove shops products
      const shopsProductsIds = shops.reduce((acc: string[], { products }) => {
        return [...acc, ...products];
      }, []);
      const removedShopsProducts = await ShopProductModel.deleteMany({
        _id: { $in: shopsProductsIds },
      });
      if (!removedShopsProducts.ok) {
        return {
          success: false,
          message: await getApiMessage('shopProducts.delete.error'),
        };
      }

      // remove shops
      const removedShops = await ShopModel.deleteMany({ _id: { $in: company.shops } });
      if (!removedShops.ok) {
        return {
          success: false,
          message: await getApiMessage('companies.shopsDelete.error'),
        };
      }

      // remove company and company assets
      const filesPath = `./assets/${ASSETS_DIST_COMPANIES}/${company.slug}`;
      const removedAssets = await del(filesPath);
      const removedCompany = await CompanyModel.findOneAndDelete({
        _id: id,
      });

      if (!removedCompany || !removedAssets) {
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
        message: await getResolverErrorMessage(e),
      };
    }
  }

  @Mutation((_returns) => CompanyPayloadtype)
  @ValidateMethod({ schema: addShopToCompanySchema })
  @AuthMethod(operationConfigShopCreate)
  async addShopToCompany(
    @Localization() { getApiMessage }: LocalizationPayloadInterface,
    @CustomFilter(operationConfigShopCreate) customFilter: FilterQuery<Shop>,
    @Arg('input') input: AddShopToCompanyInput,
  ): Promise<CompanyPayloadtype> {
    try {
      const { companyId, ...values } = input;
      const company = await CompanyModel.findOne({ _id: companyId, ...customFilter });
      if (!company) {
        return {
          success: false,
          message: await getApiMessage('companies.update.notFound'),
        };
      }

      const exist = await ShopModel.findOne({ nameString: values.nameString });
      if (exist) {
        return {
          success: false,
          message: await getApiMessage('shops.create.duplicate'),
        };
      }

      // crate shop
      const slug = generateSlug(values.nameString);
      const [logoAsset] = await storeUploads({
        files: [values.logo[0]],
        slug,
        dist: ASSETS_DIST_SHOPS_LOGOS,
      });
      const photosAssets = await storeUploads({
        files: values.assets,
        slug,
        dist: ASSETS_DIST_SHOPS,
      });

      const createdShop = await ShopModel.create({
        ...values,
        slug,
        address: {
          coordinates: values.address,
        },
        logo: logoAsset,
        assets: photosAssets,
        products: [],
      });
      if (!createdShop) {
        return {
          success: false,
          message: await getApiMessage('shops.create.error'),
        };
      }

      // add created shop to the company
      const updatedCompany = await CompanyModel.findByIdAndUpdate(
        companyId,
        {
          $push: {
            shops: createdShop.id,
          },
        },
        {
          new: true,
        },
      );
      if (!updatedCompany) {
        return {
          success: false,
          message: await getApiMessage('shops.create.error'),
        };
      }

      return {
        success: true,
        message: await getApiMessage('shops.create.success'),
        company: updatedCompany,
      };
    } catch (e) {
      return {
        success: false,
        message: await getResolverErrorMessage(e),
      };
    }
  }

  @Mutation((_returns) => CompanyPayloadtype)
  @ValidateMethod({ schema: updateShopInCompanySchema })
  @AuthMethod(operationConfigShopUpdate)
  async updateShopInCompany(
    @Localization() { getApiMessage }: LocalizationPayloadInterface,
    @CustomFilter(operationConfigShopUpdate) customFilter: FilterQuery<Shop>,
    @Arg('input') input: UpdateShopInCompanyInput,
  ): Promise<CompanyPayloadtype> {
    try {
      const { companyId, shopId, ...values } = input;
      const company = await CompanyModel.findOne({ _id: companyId, ...customFilter });
      if (!company) {
        return {
          success: false,
          message: await getApiMessage('companies.update.notFound'),
        };
      }

      const shop = await ShopModel.findOne({ _id: shopId });
      if (!shop) {
        return {
          success: false,
          message: await getApiMessage('shops.update.notFound'),
        };
      }

      const exist = await ShopModel.findOne({ nameString: values.nameString });
      if (exist) {
        return {
          success: false,
          message: await getApiMessage('shops.update.duplicate'),
        };
      }

      // remove shop assets
      const assetsPath = `./assets/${ASSETS_DIST_SHOPS}/${shop.slug}`;
      const logoPath = `./assets/${ASSETS_DIST_SHOPS_LOGOS}/${shop.slug}`;
      await del(assetsPath);
      await del(logoPath);

      // update shop
      const slug = generateSlug(values.nameString);
      const [logoAsset] = await storeUploads({
        files: [values.logo[0]],
        slug,
        dist: ASSETS_DIST_SHOPS_LOGOS,
      });
      const photosAssets = await storeUploads({
        files: values.assets,
        slug,
        dist: ASSETS_DIST_SHOPS,
      });

      const updatedShop = await ShopModel.findByIdAndUpdate(shopId, {
        ...values,
        slug,
        address: {
          coordinates: values.address,
        },
        logo: logoAsset,
        assets: photosAssets,
      });

      if (!updatedShop) {
        return {
          success: false,
          message: await getApiMessage('shops.update.error'),
        };
      }

      return {
        success: true,
        message: await getApiMessage('shops.update.success'),
        company,
      };
    } catch (e) {
      return {
        success: false,
        message: await getResolverErrorMessage(e),
      };
    }
  }

  @Mutation((_returns) => CompanyPayloadtype)
  @AuthMethod(operationConfigShopDelete)
  async deleteShopFromCompany(
    @Localization() { getApiMessage }: LocalizationPayloadInterface,
    @CustomFilter(operationConfigShopDelete) customFilter: FilterQuery<Shop>,
    @Arg('input') input: DeleteShopFromCompanyInput,
  ): Promise<CompanyPayloadtype> {
    try {
      const { companyId, shopId } = input;
      const company = await CompanyModel.findOne({ _id: companyId, ...customFilter });
      if (!company) {
        return {
          success: false,
          message: await getApiMessage('companies.update.notFound'),
        };
      }

      const shop = await ShopModel.findOne({ _id: shopId });
      if (!shop) {
        return {
          success: false,
          message: await getApiMessage('shops.delete.notFound'),
        };
      }

      // remove shop assets
      const assetsPath = `./assets/${ASSETS_DIST_SHOPS}/${shop.slug}`;
      const logoPath = `./assets/${ASSETS_DIST_SHOPS_LOGOS}/${shop.slug}`;
      await del(assetsPath);
      await del(logoPath);

      // remove shops products
      const removedShopsProducts = await ShopProductModel.deleteMany({
        _id: { $in: shop.products },
      });
      if (!removedShopsProducts.ok) {
        return {
          success: false,
          message: await getApiMessage('shopProducts.delete.error'),
        };
      }

      // update shop
      const removedShop = await ShopModel.findByIdAndDelete(shopId);
      if (!removedShop) {
        return {
          success: false,
          message: await getApiMessage('shops.delete.error'),
        };
      }

      return {
        success: true,
        message: await getApiMessage('shops.delete.success'),
        company,
      };
    } catch (e) {
      return {
        success: false,
        message: await getResolverErrorMessage(e),
      };
    }
  }

  // Field resolvers
  @FieldResolver((_returns) => User)
  async owner(@Root() company: DocumentType<Company>): Promise<User> {
    const user = await UserModel.findOne({ _id: company.owner });
    if (!user) {
      throw Error('User on company owner not found');
    }
    return user;
  }

  @FieldResolver((_returns) => [User])
  async staff(@Root() company: DocumentType<Company>): Promise<User[]> {
    return UserModel.find({ _id: { $in: company.staff } });
  }

  @FieldResolver((_returns) => [Shop])
  async shops(@Root() company: DocumentType<Company>): Promise<Shop[]> {
    return ShopModel.find({ _id: { $in: company.shops } });
  }
}
