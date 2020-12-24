import { Arg, FieldResolver, ID, ObjectType, Query, Resolver, Root } from 'type-graphql';
import { Brand, BrandModel } from '../../entities/Brand';
import { BrandCollection, BrandCollectionModel } from '../../entities/BrandCollection';
import { DocumentType } from '@typegoose/typegoose';
import PaginatedAggregationType from '../commonInputs/PaginatedAggregationType';
import {
  PAGE_DEFAULT,
  PAGINATION_DEFAULT_LIMIT,
  SORT_BY_CREATED_AT,
  SORT_BY_ID_DIRECTION,
  SORT_DESC_NUM,
} from '@yagu/shared';
import { SortDirectionNumEnum } from '../commonInputs/PaginateInput';
import { BrandPaginateInput } from './BrandPaginateInput';
import { noNaN } from '../../utils/numbers';

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
      defaultValue: {
        limit: PAGINATION_DEFAULT_LIMIT,
        sortDir: SORT_DESC_NUM,
        sortBy: SORT_BY_CREATED_AT,
        page: PAGE_DEFAULT,
      },
    })
    input: BrandPaginateInput,
  ): Promise<PaginatedBrands> {
    try {
      const {
        page = PAGE_DEFAULT,
        sortDir = SORT_DESC_NUM,
        sortBy = SORT_BY_CREATED_AT,
        limit = PAGINATION_DEFAULT_LIMIT,
      } = input;
      const skip = page ? (page - 1) * limit : 0;

      interface BrandsAggregationInterface {
        docs: Brand[];
        countAllDocs: {
          totalDocs: number;
        }[];
      }

      const aggregated = await BrandModel.aggregate<BrandsAggregationInterface>([
        { $addFields: { id: { $toString: '$_id' } } },
        { $sort: { createdAt: sortDir, _id: SORT_BY_ID_DIRECTION } },
        {
          $facet: {
            docs: [{ $skip: skip }, { $limit: limit }],
            countAllDocs: [{ $count: 'totalDocs' }],
          },
        },
      ]);
      const brandsResult = aggregated[0] ?? { docs: [] };
      const totalDocs = noNaN(brandsResult.countAllDocs[0]?.totalDocs);
      const totalPages = Math.ceil(totalDocs / limit);

      return {
        sortBy,
        sortDir,
        page,
        limit,
        totalDocs,
        totalPages,
        docs: brandsResult.docs,
        hasPrevPage: page > PAGE_DEFAULT,
        hasNextPage: page < totalPages,
      };
    } catch (e) {
      return {
        sortBy: SORT_BY_CREATED_AT,
        sortDir: SORT_DESC_NUM as SortDirectionNumEnum,
        docs: [],
        page: 1,
        limit: 0,
        totalDocs: 0,
        totalPages: 0,
        hasPrevPage: false,
        hasNextPage: false,
      };
    }
  }

  // Mutations

  // Field resolvers
  @FieldResolver((_returns) => [BrandCollection])
  async collections(@Root() brand: DocumentType<Brand>) {
    return BrandCollectionModel.find({ _id: { $in: brand.collections } });
  }
}
