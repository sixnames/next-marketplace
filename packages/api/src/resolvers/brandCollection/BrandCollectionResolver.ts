import { Arg, Field, ID, Mutation, ObjectType, Query, Resolver } from 'type-graphql';
import { BrandCollection, BrandCollectionModel } from '../../entities/BrandCollection';
import { RoleRuleModel } from '../../entities/RoleRule';
import PaginatedAggregationType from '../commonInputs/PaginatedAggregationType';
import { AuthMethod, ValidateMethod } from '../../decorators/methodDecorators';
import {
  CustomFilter,
  Localization,
  LocalizationPayloadInterface,
} from '../../decorators/parameterDecorators';
import { FilterQuery } from 'mongoose';
import { aggregatePagination } from '../../utils/aggregatePagination';
import { PaginatedBrands } from '../brand/BrandResolver';
import { BrandCollectionPaginateInput } from './BrandCollectionPaginateInput';
import PayloadType from '../commonInputs/PayloadType';
import { UpdateBrandCollectionInput } from './UpdateBrandCollectionInput';
import getResolverErrorMessage from '../../utils/getResolverErrorMessage';
import { updateBrandCollectionSchema } from '@yagu/shared';

const { operationConfigRead, operationConfigUpdate } = RoleRuleModel.getOperationsConfigs(
  BrandCollection.name,
);

@ObjectType()
export class PaginatedBrandCollections extends PaginatedAggregationType(BrandCollection) {}

@ObjectType()
export class BrandCollectionPayloadType extends PayloadType() {
  @Field((_type) => BrandCollection, { nullable: true })
  collection?: BrandCollection | null;
}

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

  // Mutations
  @Mutation((_returns) => BrandCollectionPayloadType)
  @AuthMethod(operationConfigUpdate)
  @ValidateMethod({ schema: updateBrandCollectionSchema })
  async updateBrandCollection(
    @Arg('input', (_type) => UpdateBrandCollectionInput)
    input: UpdateBrandCollectionInput,
    @CustomFilter(operationConfigUpdate) customFilter: FilterQuery<BrandCollection>,
    @Localization() { getApiMessage }: LocalizationPayloadInterface,
  ): Promise<BrandCollectionPayloadType> {
    try {
      const { id, nameString, description } = input;
      const collection = await BrandCollectionModel.findOne({ _id: id, ...customFilter });
      if (!collection) {
        return {
          success: false,
          message: await getApiMessage('brandCollections.update.notFound'),
        };
      }

      const exist = await BrandCollectionModel.exists({ _id: { $ne: id }, nameString });
      if (exist) {
        return {
          success: false,
          message: await getApiMessage('brandCollections.update.duplicate'),
        };
      }

      const updatedCollection = await BrandCollectionModel.findByIdAndUpdate(
        id,
        {
          nameString,
          description,
        },
        {
          new: true,
        },
      );
      if (!updatedCollection) {
        return {
          success: false,
          message: await getApiMessage('brandCollections.update.error'),
        };
      }

      return {
        success: true,
        message: await getApiMessage('brandCollections.update.success'),
        collection: updatedCollection,
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }
}
