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

@ObjectType()
class CompanyPayloadtype extends PayloadType() {
  @Field((_type) => Company, { nullable: true })
  company?: Company;
}

@Resolver((_for) => Company)
export class CompanyResolver {
  @Query((_returns) => Company)
  async getCompany(@Arg('id', (_type) => ID) id: string): Promise<Company> {
    const company = await CompanyModel.findOne({ _id: id });
    if (!company) {
      throw Error('Company not found');
    }
    return company;
  }

  @Query((_returns) => [Company])
  async getAllCompanies(): Promise<Company[]> {
    return CompanyModel.find();
  }

  @Mutation((_returns) => CompanyPayloadtype)
  async createCompany(@Arg('input') input: CreateCompanyInput): Promise<CompanyPayloadtype> {
    const { nameString, logo } = input;
    const exist = await CompanyModel.findOne({ nameString });
    if (exist) {
      return {
        success: false,
        message: '',
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
    });

    if (!company) {
      return {
        success: false,
        message: '',
      };
    }

    return {
      success: true,
      message: '',
      company,
    };
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
}
