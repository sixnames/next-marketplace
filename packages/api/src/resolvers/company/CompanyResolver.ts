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
import { Company, CompanyModel } from '../../entities/Company';
import { User, UserModel } from '../../entities/User';
import { DocumentType } from '@typegoose/typegoose';
import PayloadType from '../common/PayloadType';
import { CreateCompanyInput } from './CreateCompanyInput';
import { generateSlug } from '../../utils/slug';
import storeUploads from '../../utils/assets/storeUploads';
import { ASSETS_DIST_COMPANIES } from '../../config';
import { RoleRuleModel } from '../../entities/RoleRule';
import { AuthMethod, ValidateMethod } from '../../decorators/methodDecorators';
import {
  CustomFilter,
  Localization,
  LocalizationPayloadInterface,
} from '../../decorators/parameterDecorators';
import { FilterQuery } from 'mongoose';
import { createCompanySchema, updateCompanySchema } from '@yagu/validation';
import getApiMessage from '../../utils/translations/getApiMessage';
import getResolverErrorMessage from '../../utils/getResolverErrorMessage';
import { UpdateCompanyInput } from './UpdateCompanyInput';
import { Shop, ShopModel } from '../../entities/Shop';

const {
  operationConfigCreate,
  operationConfigRead,
  operationConfigUpdate,
  operationConfigDelete,
} = RoleRuleModel.getOperationsConfigs(Company.name);

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

  @Query((_returns) => [Company])
  @AuthMethod(operationConfigRead)
  async getAllCompanies(): Promise<Company[]> {
    return CompanyModel.find();
  }

  @Mutation((_returns) => CompanyPayloadtype)
  @ValidateMethod({ schema: createCompanySchema })
  @AuthMethod(operationConfigCreate)
  async createCompany(
    @Localization() { lang }: LocalizationPayloadInterface,
    @Arg('input') input: CreateCompanyInput,
  ): Promise<CompanyPayloadtype> {
    try {
      const { nameString, logo } = input;
      const exist = await CompanyModel.findOne({ nameString });
      if (exist) {
        return {
          success: false,
          message: await getApiMessage({ key: 'companies.create.duplicate', lang }),
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
          message: await getApiMessage({ key: 'companies.create.error', lang }),
        };
      }

      return {
        success: true,
        message: await getApiMessage({ key: 'companies.create.success', lang }),
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
    @Localization() { lang }: LocalizationPayloadInterface,
    @CustomFilter(operationConfigRead) customFiler: FilterQuery<Company>,
    @Arg('input') input: UpdateCompanyInput,
  ): Promise<CompanyPayloadtype> {
    try {
      const { nameString, logo, id } = input;
      const company = await CompanyModel.findOne({ _id: id, ...customFiler });
      if (!company) {
        return {
          success: false,
          message: await getApiMessage({ key: 'companies.update.notFound', lang }),
        };
      }

      const exist = await CompanyModel.findOne({ nameString });
      if (exist) {
        return {
          success: false,
          message: await getApiMessage({ key: 'companies.update.duplicate', lang }),
        };
      }

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

      if (!updatedCompany) {
        return {
          success: false,
          message: await getApiMessage({ key: 'companies.update.error', lang }),
        };
      }

      return {
        success: true,
        message: await getApiMessage({ key: 'companies.update.success', lang }),
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
    @Localization() { lang }: LocalizationPayloadInterface,
    @CustomFilter(operationConfigRead) customFiler: FilterQuery<Company>,
    @Arg('id', (_type) => ID) id: string,
  ): Promise<CompanyPayloadtype> {
    try {
      const company = await CompanyModel.findOne({ _id: id, ...customFiler });
      if (!company) {
        return {
          success: false,
          message: await getApiMessage({ key: 'companies.delete.notFound', lang }),
        };
      }

      // Remove all shops
      const removedShops = await ShopModel.deleteMany({ _id: { $in: company.shops } });
      if (!removedShops) {
        return {
          success: false,
          message: await getApiMessage({ key: 'companies.shopsDelete.error', lang }),
        };
      }

      const removedCompany = await CompanyModel.findOneAndDelete({
        _id: id,
      });

      if (!removedCompany) {
        return {
          success: false,
          message: await getApiMessage({ key: 'companies.delete.error', lang }),
        };
      }

      return {
        success: true,
        message: await getApiMessage({ key: 'companies.delete.success', lang }),
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
