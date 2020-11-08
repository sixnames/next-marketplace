import { Query, Resolver } from 'type-graphql';
import { Company, CompanyModel } from '../../entities/Company';

@Resolver((_for) => Company)
export class CompanyResolver {
  @Query((_returns) => [Company])
  async getAllCompanies(): Promise<Company[]> {
    return CompanyModel.find();
  }
}
