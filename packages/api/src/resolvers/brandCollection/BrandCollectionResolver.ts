import { Arg, ID, ObjectType, Query, Resolver } from 'type-graphql';
import { BrandCollection, BrandCollectionModel } from '../../entities/BrandCollection';
import { RoleRuleModel } from '../../entities/RoleRule';
import PaginatedAggregationType from '../commonInputs/PaginatedAggregationType';
import { AuthMethod } from '../../decorators/methodDecorators';
import { CustomFilter } from '../../decorators/parameterDecorators';
import { FilterQuery } from 'mongoose';
import { aggregatePagination } from '../../utils/aggregatePagination';
import { PaginatedBrands } from '../brand/BrandResolver';
import { BrandCollectionPaginateInput } from './BrandCollectionPaginateInput';

const { operationConfigRead } = RoleRuleModel.getOperationsConfigs(BrandCollection.name);

@ObjectType()
export class PaginatedBrandCollections extends PaginatedAggregationType(BrandCollection) {}

@Resolver((_for) => BrandCollection)
export class BrandCollectionResolver {
  // Queries
  @Query((_returns) => BrandCollection)
  @AuthMethod(operationConfigRead)
  async getBrandCollection(
    @Arg('id', (_type) => ID) id: string,
    @CustomFilter(operationConfigRead) customFilter: FilterQuery<BrandCollection>,
  ): Promise<BrandCollection> {
    const brandCollection = await BrandCollectionModel.findOne({ _id: id, ...customFilter });
    if (!brandCollection) {
      throw Error('Brand collection not fond by given ID');
    }
    return brandCollection;
  }

  @Query((_returns) => BrandCollection, { nullable: true })
  async getBrandCollectionBySlug(
    @Arg('slug', (_type) => String) slug: string,
  ): Promise<BrandCollection | null> {
    return BrandCollectionModel.findOne({ slug });
  }

  @Query((_returns) => PaginatedBrands)
  @AuthMethod(operationConfigRead)
  async getAllBrandCollections(
    @Arg('input', (_type) => BrandCollectionPaginateInput, {
      nullable: true,
    })
    input: BrandCollectionPaginateInput | null,
    @CustomFilter(operationConfigRead) customFilter: FilterQuery<BrandCollection>,
  ): Promise<PaginatedBrandCollections> {
    return aggregatePagination<BrandCollection, BrandCollectionPaginateInput>({
      input,
      collectionName: 'brands',
      pipeline: [
        {
          $match: customFilter,
        },
      ],
    });
  }
}
