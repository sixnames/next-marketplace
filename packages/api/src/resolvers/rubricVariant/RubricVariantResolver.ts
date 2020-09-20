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
import getLangField from '../../utils/translations/getLangField';
import getApiMessage from '../../utils/translations/getApiMessage';
import { createRubricVariantInputSchema, updateRubricVariantSchema } from '@yagu/validation';
import { getOperationsConfigs } from '../../utils/auth/auth';
import { AuthMethod, ValidateMethod } from '../../decorators/methodDecorators';
import {
  CustomFilter,
  Localization,
  LocalizationPayloadInterface,
} from '../../decorators/parameterDecorators';
import { FilterQuery } from 'mongoose';

const {
  operationConfigCreate,
  operationConfigRead,
  operationConfigUpdate,
  operationConfigDelete,
} = getOperationsConfigs(RubricVariant.name);

@ObjectType()
class RubricVariantPayloadType extends PayloadType() {
  @Field((_type) => RubricVariant, { nullable: true })
  variant?: RubricVariant;
}

@Resolver((_of) => RubricVariant)
export class RubricVariantResolver {
  @Query(() => RubricVariant, { nullable: true })
  @AuthMethod(operationConfigRead)
  async getRubricVariant(
    @CustomFilter(operationConfigRead) customFilter: FilterQuery<RubricVariant>,
    @Arg('id', (_type) => ID) id: string,
  ): Promise<RubricVariant | null> {
    return RubricVariantModel.findOne({ _id: id, ...customFilter });
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
    @Localization() { lang }: LocalizationPayloadInterface,
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
          message: await getApiMessage({ key: `rubricVariants.create.duplicate`, lang }),
        };
      }

      const variant = await RubricVariantModel.create(input);

      if (!variant) {
        return {
          success: false,
          message: await getApiMessage({ key: `rubricVariants.create.error`, lang }),
        };
      }

      return {
        success: true,
        message: await getApiMessage({ key: `rubricVariants.create.success`, lang }),
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
    @Localization() { lang }: LocalizationPayloadInterface,
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
          message: await getApiMessage({ key: `rubricVariants.update.duplicate`, lang }),
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
          message: await getApiMessage({ key: `rubricVariants.update.error`, lang }),
        };
      }

      return {
        success: true,
        message: await getApiMessage({ key: `rubricVariants.update.success`, lang }),
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
    @Localization() { lang }: LocalizationPayloadInterface,
    @Arg('id', (_type) => ID) id: string,
  ): Promise<RubricVariantPayloadType> {
    try {
      const isUsedInRubrics = await RubricModel.exists({
        variant: id,
      });
      if (isUsedInRubrics) {
        return {
          success: false,
          message: await getApiMessage({ key: `rubricVariants.delete.used`, lang }),
        };
      }

      const variant = await RubricVariantModel.findByIdAndDelete(id);

      if (!variant) {
        return {
          success: false,
          message: await getApiMessage({ key: `rubricVariants.delete.error`, lang }),
        };
      }

      return {
        success: true,
        message: await getApiMessage({ key: `rubricVariants.delete.success`, lang }),
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
    @Localization() { lang }: LocalizationPayloadInterface,
  ): Promise<string> {
    return getLangField(variant.name, lang);
  }
}
