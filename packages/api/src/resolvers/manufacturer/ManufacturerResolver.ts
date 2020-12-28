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
import { CreateManufacturerInput } from './CreateManufacturerInput';
import { ProductModel } from '../../entities/Product';
import { UpdateManufacturerInput } from './UpdateManufacturerInput';
import { createManufacturerSchema, updateManufacturerSchema } from '@yagu/shared';

const {
  operationConfigCreate,
  operationConfigRead,
  operationConfigUpdate,
  operationConfigDelete,
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

  @Mutation((_returns) => ManufacturerPayloadType)
  @AuthMethod(operationConfigUpdate)
  @ValidateMethod({ schema: updateManufacturerSchema })
  async updateManufacturer(
    @Arg('input') input: UpdateManufacturerInput,
    @Localization() { getApiMessage }: LocalizationPayloadInterface,
    @CustomFilter(operationConfigUpdate) customFilter: FilterQuery<Manufacturer>,
  ): Promise<ManufacturerPayloadType> {
    try {
      const { id, nameString, ...values } = input;
      const manufacturer = await ManufacturerModel.findOne({ _id: id, ...customFilter });
      if (!manufacturer) {
        return {
          success: false,
          message: await getApiMessage('manufacturers.update.notFound'),
        };
      }

      const exist = await ManufacturerModel.exists({ _id: { $ne: id }, nameString });
      if (exist) {
        return {
          success: false,
          message: await getApiMessage('manufacturers.update.duplicate'),
        };
      }

      const updatedManufacturer = await ManufacturerModel.findByIdAndUpdate(
        id,
        {
          ...values,
          nameString,
          collections: [],
        },
        {
          new: true,
        },
      );

      if (!updatedManufacturer) {
        return {
          success: false,
          message: await getApiMessage('manufacturers.update.error'),
        };
      }

      return {
        success: true,
        message: await getApiMessage('manufacturers.update.success'),
        manufacturer: updatedManufacturer,
      };
    } catch (e) {
      console.log(e);
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  @Mutation((_returns) => ManufacturerPayloadType)
  @AuthMethod(operationConfigDelete)
  async deleteManufacturer(
    @Arg('id', () => ID) id: string,
    @Localization() { getApiMessage }: LocalizationPayloadInterface,
    @CustomFilter(operationConfigDelete) customFilter: FilterQuery<Manufacturer>,
  ): Promise<ManufacturerPayloadType> {
    try {
      const manufacturer = await ManufacturerModel.findOne({ _id: id, ...customFilter });
      if (!manufacturer) {
        return {
          success: false,
          message: await getApiMessage('manufacturers.delete.notFound'),
        };
      }

      const used = await ProductModel.exists({ manufacturer: manufacturer.slug });
      if (used) {
        return {
          success: false,
          message: await getApiMessage('manufacturers.delete.used'),
        };
      }

      const removedManufacturer = await ManufacturerModel.findByIdAndDelete(id);

      if (!removedManufacturer) {
        return {
          success: false,
          message: await getApiMessage('manufacturers.delete.error'),
        };
      }

      return {
        success: true,
        message: await getApiMessage('manufacturers.delete.success'),
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
