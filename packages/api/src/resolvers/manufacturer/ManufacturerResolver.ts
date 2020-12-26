import { Arg, Field, ID, Mutation, ObjectType, Query, Resolver } from 'type-graphql';
import { Manufacturer, ManufacturerModel } from '../../entities/Manufacturer';
import { RoleRuleModel } from '../../entities/RoleRule';
import { AuthMethod, ValidateMethod } from '../../decorators/methodDecorators';
import PaginatedAggregationType from '../commonInputs/PaginatedAggregationType';
import PayloadType from '../commonInputs/PayloadType';
import {
  CustomFilter,
  Localization,
  LocalizationPayloadInterface,
} from '../../decorators/parameterDecorators';
import { FilterQuery } from 'mongoose';
import { aggregatePagination } from '../../utils/aggregatePagination';
import { ManufacturerPaginateInput } from './ManufacturerPaginateInput';
import { generateSlug } from '../../utils/slug';
import getResolverErrorMessage from '../../utils/getResolverErrorMessage';
import { createManufacturerSchema } from '@yagu/shared';
import { CreateManufacturerInput } from './CreateManufacturerInput';

const {
  operationConfigCreate,
  operationConfigRead,
  // operationConfigUpdate,
  // operationConfigDelete,
} = RoleRuleModel.getOperationsConfigs(Manufacturer.name);

@ObjectType()
export class PaginatedManufacturers extends PaginatedAggregationType(Manufacturer) {}

@ObjectType()
export class ManufacturerPayloadType extends PayloadType() {
  @Field((_type) => Manufacturer, { nullable: true })
  manufacturer?: Manufacturer | null;
}

@Resolver((_for) => Manufacturer)
export class ManufacturerResolver {
  // Queries
  @Query((_returns) => Manufacturer)
  @AuthMethod(operationConfigRead)
  async getManufacturer(
    @Arg('id', (_type) => ID) id: string,
    @CustomFilter(operationConfigRead) customFilter: FilterQuery<Manufacturer>,
  ): Promise<Manufacturer> {
    const manufacturer = await ManufacturerModel.findOne({ _id: id, ...customFilter });
    if (!manufacturer) {
      throw Error('Manufacturer not found by given ID');
    }
    return manufacturer;
  }

  @Query((_returns) => Manufacturer)
  async getManufacturerBySlug(
    @Arg('slug', (_type) => String) slug: string,
  ): Promise<Manufacturer | null> {
    return ManufacturerModel.findOne({ slug });
  }

  @Query((_returns) => PaginatedManufacturers)
  @AuthMethod(operationConfigRead)
  async getAllManufacturers(
    @Arg('input', (_type) => ManufacturerPaginateInput, {
      nullable: true,
    })
    input: ManufacturerPaginateInput | null,
    @CustomFilter(operationConfigRead) customFilter: FilterQuery<Manufacturer>,
  ): Promise<PaginatedManufacturers> {
    return aggregatePagination<Manufacturer, ManufacturerPaginateInput>({
      input,
      collectionName: 'manufacturers',
      pipeline: [
        {
          $match: customFilter,
        },
      ],
    });
  }

  // Mutations
  @Mutation((_returns) => ManufacturerPayloadType)
  @AuthMethod(operationConfigCreate)
  @ValidateMethod({ schema: createManufacturerSchema })
  async createManufacturer(
    @Arg('input') input: CreateManufacturerInput,
    @Localization() { getApiMessage }: LocalizationPayloadInterface,
  ): Promise<ManufacturerPayloadType> {
    try {
      const { nameString, ...values } = input;
      const slug = generateSlug(nameString);

      const exist = await ManufacturerModel.exists({ nameString });
      if (exist) {
        return {
          success: false,
          message: await getApiMessage('manufacturers.create.duplicate'),
        };
      }

      const manufacturer = await ManufacturerModel.create({
        ...values,
        nameString,
        slug,
      });

      if (!manufacturer) {
        return {
          success: false,
          message: await getApiMessage('manufacturers.create.error'),
        };
      }

      return {
        success: true,
        message: await getApiMessage('manufacturers.create.success'),
        manufacturer,
      };
    } catch (e) {
      console.log(e);
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }
}
