import { Arg, FieldResolver, ID, Query, Resolver, Root } from 'type-graphql';
import { Company, CompanyModel } from '../../entities/Company';
import { User, UserModel } from '../../entities/User';
import { DocumentType } from '@typegoose/typegoose';

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
