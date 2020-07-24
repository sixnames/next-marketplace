import {
  Arg,
  Ctx,
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
import { ContextInterface } from '../../types/context';
import { DocumentType } from '@typegoose/typegoose';
import getLangField from '../../utils/getLangField';
import { getMessageTranslation } from '../../config/translations';
import { createRubricVariantInputSchema, updateRubricVariantSchema } from '../../validation';

@ObjectType()
class RubricVariantPayloadType extends PayloadType() {
  @Field((_type) => RubricVariant, { nullable: true })
  variant?: RubricVariant;
}

@Resolver((_of) => RubricVariant)
export class RubricVariantResolver {
  @Query(() => RubricVariant, { nullable: true })
  async getRubricVariant(@Arg('id', (_type) => ID) id: string): Promise<RubricVariant | null> {
    return RubricVariantModel.findById(id);
  }

  @Query(() => [RubricVariant], { nullable: true })
  async getAllRubricVariants(): Promise<RubricVariant[]> {
    return RubricVariantModel.find();
  }

  @Mutation(() => RubricVariantPayloadType)
  async createRubricVariant(
    @Ctx() ctx: ContextInterface,
    @Arg('input') input: CreateRubricVariantInput,
  ): Promise<RubricVariantPayloadType> {
    try {
      const lang = ctx.req.lang;
      const defaultLang = ctx.req.defaultLang;
      await createRubricVariantInputSchema(defaultLang).validate(input);

      const nameValues = input.name.map(({ value }) => value);
      const exist = await RubricVariantModel.exists({
        'name.value': {
          $in: nameValues,
        },
      });
      if (exist) {
        return {
          success: false,
          message: getMessageTranslation(`rubricVariant.create.duplicate.${lang}`),
        };
      }

      const variant = await RubricVariantModel.create(input);

      if (!variant) {
        return {
          success: false,
          message: getMessageTranslation(`rubricVariant.create.error.${lang}`),
        };
      }

      return {
        success: true,
        message: getMessageTranslation(`rubricVariant.create.success.${lang}`),
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
  async updateRubricVariant(
    @Ctx() ctx: ContextInterface,
    @Arg('input') input: UpdateRubricVariantInput,
  ): Promise<RubricVariantPayloadType> {
    try {
      const lang = ctx.req.lang;
      const defaultLang = ctx.req.defaultLang;
      await updateRubricVariantSchema(defaultLang).validate(input);

      const nameValues = input.name.map(({ value }) => value);
      const exist = await RubricVariantModel.exists({
        'name.value': {
          $in: nameValues,
        },
      });
      if (exist) {
        return {
          success: false,
          message: getMessageTranslation(`rubricVariant.update.duplicate.${lang}`),
        };
      }

      const { id, ...values } = input;
      const variant = await RubricVariantModel.findByIdAndUpdate(id, values, { new: true });

      if (!variant) {
        return {
          success: false,
          message: getMessageTranslation(`rubricVariant.update.error.${lang}`),
        };
      }

      return {
        success: true,
        message: getMessageTranslation(`rubricVariant.update.success.${lang}`),
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
  async deleteRubricVariant(
    @Ctx() ctx: ContextInterface,
    @Arg('id', (_type) => ID) id: string,
  ): Promise<RubricVariantPayloadType> {
    try {
      const city = ctx.req.city;
      const lang = ctx.req.lang;

      const isUsedInRubrics = await RubricModel.exists({
        'cities.key': city,
        'cities.node.variant': id,
      });
      if (isUsedInRubrics) {
        return {
          success: false,
          message: getMessageTranslation(`rubricVariant.delete.used.${lang}`),
        };
      }

      const variant = await RubricVariantModel.findByIdAndDelete(id);

      if (!variant) {
        return {
          success: false,
          message: getMessageTranslation(`rubricVariant.delete.error.${lang}`),
        };
      }

      return {
        success: true,
        message: getMessageTranslation(`rubricVariant.delete.success.${lang}`),
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
    @Ctx() ctx: ContextInterface,
  ): Promise<string> {
    return getLangField(variant.name, ctx.req.lang);
  }
}
