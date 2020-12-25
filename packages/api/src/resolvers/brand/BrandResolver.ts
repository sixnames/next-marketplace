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
import { Brand, BrandModel } from '../../entities/Brand';
import { BrandCollection, BrandCollectionModel } from '../../entities/BrandCollection';
import { DocumentType } from '@typegoose/typegoose';
import PaginatedAggregationType from '../commonInputs/PaginatedAggregationType';
import { BrandPaginateInput } from './BrandPaginateInput';
import { aggregatePagination } from '../../utils/aggregatePagination';
import { CreateBrandInput } from './CreateBrandInput';
import PayloadType from '../commonInputs/PayloadType';
import getResolverErrorMessage from '../../utils/getResolverErrorMessage';
import { generateSlug } from '../../utils/slug';
import { Localization, LocalizationPayloadInterface } from '../../decorators/parameterDecorators';

@ObjectType()
export class PaginatedBrands extends PaginatedAggregationType(Brand) {}

@ObjectType()
export class BrandPayloadType extends PayloadType() {
  @Field((_type) => Brand, { nullable: true })
  brand?: Brand | null;
}

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
  @Mutation((_returns) => BrandPayloadType)
  async createBrand(
    @Arg('input') input: CreateBrandInput,
    @Localization() { getApiMessage }: LocalizationPayloadInterface,
  ): Promise<BrandPayloadType> {
    try {
      const { nameString, ...values } = input;
      const slug = generateSlug(nameString);

      const exist = await BrandModel.exists({ nameString });
      if (exist) {
        return {
          success: false,
          message: await getApiMessage('brands.create.duplicate'),
        };
      }

      const brand = await BrandModel.create({
        ...values,
        nameString,
        slug,
        collections: [],
      });

      if (!brand) {
        return {
          success: false,
          message: await getApiMessage('brands.create.error'),
        };
      }

      return {
        success: true,
        message: await getApiMessage('brands.create.success'),
        brand,
      };
    } catch (e) {
      console.log(e);
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  // Field resolvers
  @FieldResolver((_returns) => [BrandCollection])
  async collections(@Root() brand: DocumentType<Brand>) {
    return BrandCollectionModel.find({ _id: { $in: brand.collections } });
  }
}
