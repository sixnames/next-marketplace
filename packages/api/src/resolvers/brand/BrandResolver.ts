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
import {
  CustomFilter,
  Localization,
  LocalizationPayloadInterface,
} from '../../decorators/parameterDecorators';
import { AuthMethod, ValidateMethod } from '../../decorators/methodDecorators';
import { createBrandSchema, updateBrandSchema } from '@yagu/shared';
import { RoleRuleModel } from '../../entities/RoleRule';
import { UpdateBrandInput } from './UpdateBrandInput';
import { FilterQuery } from 'mongoose';
import { ProductModel } from '../../entities/Product';

const {
  operationConfigCreate,
  operationConfigRead,
  operationConfigUpdate,
  operationConfigDelete,
} = RoleRuleModel.getOperationsConfigs(Brand.name);

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
  @AuthMethod(operationConfigRead)
  async getBrand(
    @Arg('id', (_type) => ID) id: string,
    @CustomFilter(operationConfigRead) customFilter: FilterQuery<Brand>,
  ): Promise<Brand> {
    const brand = await BrandModel.findOne({ _id: id, ...customFilter });
    if (!brand) {
      throw Error('Brand not fond by given ID');
    }
    return brand;
  }

  @Query((_returns) => Brand, { nullable: true })
  async getBrandBySlug(@Arg('slug', (_type) => String) slug: string): Promise<Brand | null> {
    return BrandModel.findOne({ slug });
  }

  @AuthMethod(operationConfigRead)
  @Query((_returns) => PaginatedBrands)
  async getAllBrands(
    @Arg('input', (_type) => BrandPaginateInput, {
      nullable: true,
    })
    input: BrandPaginateInput | null,
    @CustomFilter(operationConfigRead) customFilter: FilterQuery<Brand>,
  ): Promise<PaginatedBrands> {
    return aggregatePagination<Brand, BrandPaginateInput>({
      input,
      collectionName: 'brands',
      pipeline: [
        {
          $match: customFilter,
        },
      ],
    });
  }

  // Mutations
  @Mutation((_returns) => BrandPayloadType)
  @AuthMethod(operationConfigCreate)
  @ValidateMethod({ schema: createBrandSchema })
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

  @Mutation((_returns) => BrandPayloadType)
  @AuthMethod(operationConfigUpdate)
  @ValidateMethod({ schema: updateBrandSchema })
  async updateBrand(
    @Arg('input') input: UpdateBrandInput,
    @Localization() { getApiMessage }: LocalizationPayloadInterface,
    @CustomFilter(operationConfigUpdate) customFilter: FilterQuery<Brand>,
  ): Promise<BrandPayloadType> {
    try {
      const { id, nameString, ...values } = input;
      const brand = await BrandModel.findOne({ _id: id, ...customFilter });
      if (!brand) {
        return {
          success: false,
          message: await getApiMessage('brands.update.notFound'),
        };
      }

      const slug = generateSlug(nameString);

      const exist = await BrandModel.exists({ _id: { $ne: id }, nameString });
      if (exist) {
        return {
          success: false,
          message: await getApiMessage('brands.update.duplicate'),
        };
      }

      const updatedBrand = await BrandModel.findByIdAndUpdate(
        id,
        {
          ...values,
          nameString,
          slug,
          collections: [],
        },
        {
          new: true,
        },
      );

      if (!updatedBrand) {
        return {
          success: false,
          message: await getApiMessage('brands.update.error'),
        };
      }

      return {
        success: true,
        message: await getApiMessage('brands.update.success'),
        brand: updatedBrand,
      };
    } catch (e) {
      console.log(e);
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  @Mutation((_returns) => BrandPayloadType)
  @AuthMethod(operationConfigDelete)
  async deleteBrand(
    @Arg('id', () => ID) id: string,
    @Localization() { getApiMessage }: LocalizationPayloadInterface,
    @CustomFilter(operationConfigDelete) customFilter: FilterQuery<Brand>,
  ): Promise<BrandPayloadType> {
    try {
      const brand = await BrandModel.findOne({ _id: id, ...customFilter });
      if (!brand) {
        return {
          success: false,
          message: await getApiMessage('brands.delete.notFound'),
        };
      }

      const used = await ProductModel.exists({ brand: id });
      if (used) {
        return {
          success: false,
          message: await getApiMessage('brands.delete.used'),
        };
      }

      const removedBrand = await BrandModel.findByIdAndDelete(id);

      if (!removedBrand) {
        return {
          success: false,
          message: await getApiMessage('brands.delete.error'),
        };
      }

      return {
        success: true,
        message: await getApiMessage('brands.delete.success'),
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
