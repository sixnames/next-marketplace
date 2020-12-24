import { Arg, FieldResolver, ID, ObjectType, Query, Resolver, Root } from 'type-graphql';
import { Brand, BrandModel } from '../../entities/Brand';
import { BrandCollection, BrandCollectionModel } from '../../entities/BrandCollection';
import { DocumentType } from '@typegoose/typegoose';
import PaginatedAggregationType from '../commonInputs/PaginatedAggregationType';
import { BrandPaginateInput } from './BrandPaginateInput';
import { aggregatePagination } from '../../utils/aggregatePagination';

@ObjectType()
export class PaginatedBrands extends PaginatedAggregationType(Brand) {}

@Resolver((_for) => Brand)
export class BrandResolver {
  // Queries
  @Query((_returns) => Brand)
  async getBrand(@Arg('id', (_type) => ID) id: string): Promise<Brand> {
    const brand = await BrandModel.findOne({ _id: id });
    if (!brand) {
      throw Error('Brand not fond by given ID');
    }
    return brand;
  }

  @Query((_returns) => Brand, { nullable: true })
  async getBrandBySlug(@Arg('slug', (_type) => String) slug: string): Promise<Brand | null> {
    return BrandModel.findOne({ slug });
  }

  @Query((_returns) => PaginatedBrands)
  async getAllBrands(
    @Arg('input', (_type) => BrandPaginateInput, {
      nullable: true,
    })
    input: BrandPaginateInput | null,
  ): Promise<PaginatedBrands> {
    return aggregatePagination<Brand, BrandPaginateInput>({
      input,
      collectionName: 'brands',
    });
  }

  // Mutations

  // Field resolvers
  @FieldResolver((_returns) => [BrandCollection])
  async collections(@Root() brand: DocumentType<Brand>) {
    return BrandCollectionModel.find({ _id: { $in: brand.collections } });
  }
}
