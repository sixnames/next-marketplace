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
import { RubricVariant, RubricVariantModel } from '../../entities/RubricVariant';
import PayloadType from '../common/PayloadType';
import getResolverErrorMessage from '../../utils/getResolverErrorMessage';
import { CreateRubricVariantInput } from './CreateRubricVariantInput';
import { UpdateRubricVariantInput } from './UpdateRubricVariantInput';
import { RubricModel } from '../../entities/Rubric';
import { DocumentType } from '@typegoose/typegoose';
import { createRubricVariantInputSchema, updateRubricVariantSchema } from '@yagu/validation';
import { AuthMethod, ValidateMethod } from '../../decorators/methodDecorators';
import {
  CustomFilter,
  Localization,
  LocalizationPayloadInterface,
} from '../../decorators/parameterDecorators';
import { FilterQuery } from 'mongoose';
import { RoleRuleModel } from '../../entities/RoleRule';

const {
  operationConfigCreate,
  operationConfigRead,
  operationConfigUpdate,
  operationConfigDelete,
} = RoleRuleModel.getOperationsConfigs(RubricVariant.name);

@ObjectType()
class RubricVariantPayloadType extends PayloadType() {
  @Field((_type) => RubricVariant, { nullable: true })
  variant?: RubricVariant;
}

@Resolver((_of) => RubricVariant)
export class RubricVariantResolver {
  @Query(() => RubricVariant)
  @AuthMethod(operationConfigRead)
  async getRubricVariant(
    @CustomFilter(operationConfigRead) customFilter: FilterQuery<RubricVariant>,
    @Arg('id', (_type) => ID) id: string,
  ): Promise<RubricVariant> {
    const rubricVariant = await RubricVariantModel.findOne({ _id: id, ...customFilter });
    if (!rubricVariant) {
      throw Error('RubricVariant not found by given ID');
    }
    return rubricVariant;
  }

  @Query(() => [RubricVariant], { nullable: true })
  @AuthMethod(operationConfigRead)
  async getAllRubricVariants(
    @CustomFilter(operationConfigRead) customFilter: FilterQuery<RubricVariant>,
  ): Promise<RubricVariant[]> {
    return RubricVariantModel.find(customFilter);
  }

  @Mutation(() => RubricVariantPayloadType)
  @AuthMethod(operationConfigCreate)
  @ValidateMethod({ schema: createRubricVariantInputSchema })
  async createRubricVariant(
    @Localization() { getApiMessage }: LocalizationPayloadInterface,
    @Arg('input') input: CreateRubricVariantInput,
  ): Promise<RubricVariantPayloadType> {
    try {
      const nameValues = input.name.map(({ value }) => value);
      const exist = await RubricVariantModel.exists({
        'name.value': {
          $in: nameValues,
        },
      });
      if (exist) {
        return {
          success: false,
          message: await getApiMessage(`rubricVariants.create.duplicate`),
        };
      }

      const variant = await RubricVariantModel.create(input);

      if (!variant) {
        return {
          success: false,
          message: await getApiMessage(`rubricVariants.create.error`),
        };
      }

      return {
        success: true,
        message: await getApiMessage(`rubricVariants.create.success`),
        variant,
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  @Mutation(() => RubricVariantPayloadType)
  @AuthMethod(operationConfigUpdate)
  @ValidateMethod({ schema: updateRubricVariantSchema })
  async updateRubricVariant(
    @Localization() { getApiMessage }: LocalizationPayloadInterface,
    @CustomFilter(operationConfigUpdate) customFilter: FilterQuery<RubricVariant>,
    @Arg('input') input: UpdateRubricVariantInput,
  ): Promise<RubricVariantPayloadType> {
    try {
      const nameValues = input.name.map(({ value }) => value);
      const exist = await RubricVariantModel.exists({
        'name.value': {
          $in: nameValues,
        },
      });
      if (exist) {
        return {
          success: false,
          message: await getApiMessage(`rubricVariants.update.duplicate`),
        };
      }

      const { id, ...values } = input;
      const variant = await RubricVariantModel.findOneAndUpdate(
        { _id: id, ...customFilter },
        values,
        { new: true },
      );

      if (!variant) {
        return {
          success: false,
          message: await getApiMessage(`rubricVariants.update.error`),
        };
      }

      return {
        success: true,
        message: await getApiMessage(`rubricVariants.update.success`),
        variant,
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  @Mutation(() => RubricVariantPayloadType)
  @AuthMethod(operationConfigDelete)
  async deleteRubricVariant(
    @Localization() { getApiMessage }: LocalizationPayloadInterface,
    @Arg('id', (_type) => ID) id: string,
  ): Promise<RubricVariantPayloadType> {
    try {
      const isUsedInRubrics = await RubricModel.exists({
        variant: id,
      });
      if (isUsedInRubrics) {
        return {
          success: false,
          message: await getApiMessage(`rubricVariants.delete.used`),
        };
      }

      const variant = await RubricVariantModel.findByIdAndDelete(id);

      if (!variant) {
        return {
          success: false,
          message: await getApiMessage(`rubricVariants.delete.error`),
        };
      }

      return {
        success: true,
        message: await getApiMessage(`rubricVariants.delete.success`),
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  @FieldResolver()
  async nameString(
    @Root() variant: DocumentType<RubricVariant>,
    @Localization() { getLangField }: LocalizationPayloadInterface,
  ): Promise<string> {
    return getLangField(variant.name);
  }
}
