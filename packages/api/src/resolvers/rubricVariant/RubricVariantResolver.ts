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
import { createRubricVariantInputSchema, updateRubricVariantSchema } from '@rg/validation';
import getResolverErrorMessage from '../../utils/getResolverErrorMessage';
import { CreateRubricVariantInput } from './CreateRubricVariantInput';
import { UpdateRubricVariantInput } from './UpdateRubricVariantInput';
import { RubricModel } from '../../entities/Rubric';
import { ContextInterface } from '../../types/context';
import { DocumentType } from '@typegoose/typegoose';
import getLangField from '../../utils/getLangField';

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
    @Arg('input') input: CreateRubricVariantInput,
  ): Promise<RubricVariantPayloadType> {
    try {
      await createRubricVariantInputSchema.validate(input);

      const nameValues = input.name.map(({ value }) => value);
      const exist = await RubricVariantModel.exists({
        'name.value': {
          $in: nameValues,
        },
      });
      if (exist) {
        return {
          success: false,
          message: 'Типа рубрики с таким именем уже существует.',
        };
      }

      const variant = await RubricVariantModel.create(input);

      if (!variant) {
        return {
          success: false,
          message: 'Ошибка создания типа рубрики.',
        };
      }

      return {
        success: true,
        message: 'Тип рубрики создан.',
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
    @Arg('input') input: UpdateRubricVariantInput,
  ): Promise<RubricVariantPayloadType> {
    try {
      await updateRubricVariantSchema.validate(input);

      const nameValues = input.name.map(({ value }) => value);
      const exist = await RubricVariantModel.exists({
        'name.value': {
          $in: nameValues,
        },
      });
      if (exist) {
        return {
          success: false,
          message: 'Типа рубрики с таким именем уже существует.',
        };
      }

      const { id, ...values } = input;
      const variant = await RubricVariantModel.findByIdAndUpdate(id, values, { new: true });

      if (!variant) {
        return {
          success: false,
          message: 'Тип рубрики не найден.',
        };
      }

      return {
        success: true,
        message: 'Тип рубрики обновлён.',
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
      const city = ctx.req.session!.city;
      const isUsedInRubrics = await RubricModel.exists({
        'cities.key': city,
        'cities.node.variant': id,
      });
      if (isUsedInRubrics) {
        return {
          success: false,
          message: 'Тип рубрики используется в рубриках, его нельзя удалить.',
        };
      }

      const variant = await RubricVariantModel.findByIdAndDelete(id);

      if (!variant) {
        return {
          success: false,
          message: 'Ошибка удаления типа рубрики.',
        };
      }

      return {
        success: true,
        message: 'Тип рубрики удалён.',
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
    return getLangField(variant.name, ctx.req.session!.lang);
  }
}
