import {
  Arg,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  ID,
  FieldResolver,
  Root,
  Ctx,
} from 'type-graphql';
import PayloadType from '../common/PayloadType';
import { Metric, MetricModel } from '../../entities/Metric';
import getResolverErrorMessage from '../../utils/getResolverErrorMessage';
import { CreateMetricInput } from './CreateMetricInput';
import { createMetricInputSchema, updateMetricSchema } from '@rg/validation';
import { UpdateMetricInput } from './UpdateMetricInput';
import { AttributeModel } from '../../entities/Attribute';
import { DocumentType } from '@typegoose/typegoose';
import { ContextInterface } from '../../types/context';
import getLangField from '../../utils/getLangField';

@ObjectType()
class MetricPayloadType extends PayloadType() {
  @Field((_type) => Metric, { nullable: true })
  metric?: Metric;
}

@Resolver((_of) => Metric)
export class MetricResolver {
  @Query(() => Metric, { nullable: true })
  async getMetric(@Arg('id', (_type) => ID) id: string): Promise<Metric | null> {
    return MetricModel.findById(id);
  }

  @Query(() => [Metric], { nullable: true })
  async getAllMetrics(): Promise<Metric[]> {
    return MetricModel.find();
  }

  @Mutation(() => MetricPayloadType)
  async createMetric(@Arg('input') input: CreateMetricInput): Promise<MetricPayloadType> {
    try {
      await createMetricInputSchema.validate(input);

      const nameValues = input.name.map(({ value }) => value);
      const exist = await MetricModel.exists({
        'name.value': {
          $in: nameValues,
        },
      });
      if (exist) {
        return {
          success: false,
          message: 'Тип измерения с таким именем уже существует.',
        };
      }

      const metric = await MetricModel.create(input);

      if (!metric) {
        return {
          success: false,
          message: 'Ошибка создания типа измерения.',
        };
      }

      return {
        success: true,
        message: 'Тип измерения создан.',
        metric,
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  @Mutation(() => MetricPayloadType)
  async updateMetric(@Arg('input') input: UpdateMetricInput): Promise<MetricPayloadType> {
    try {
      await updateMetricSchema.validate(input);

      const nameValues = input.name.map(({ value }) => value);
      const exist = await MetricModel.exists({
        'name.value': {
          $in: nameValues,
        },
      });
      if (exist) {
        return {
          success: false,
          message: 'Тип измерения с таким именем уже существует.',
        };
      }

      const { id, ...values } = input;
      const metric = await MetricModel.findByIdAndUpdate(id, values, { new: true });

      if (!metric) {
        return {
          success: false,
          message: 'Тип измерения не найден.',
        };
      }

      return {
        success: true,
        message: 'Тип измерения обновлён.',
        metric,
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  @Mutation(() => MetricPayloadType)
  async deleteMetric(@Arg('id', (_type) => ID) id: string): Promise<MetricPayloadType> {
    try {
      const isUsedInAttributes = await AttributeModel.exists({ metric: id });
      if (isUsedInAttributes) {
        return {
          success: false,
          message: 'Тип измерения используется в атрибутах, его нельзя удалить.',
        };
      }

      const metric = await MetricModel.findByIdAndDelete(id);

      if (!metric) {
        return {
          success: false,
          message: 'Ошибка удаления типа измерения.',
        };
      }

      return {
        success: true,
        message: 'Тип измерения удалён.',
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
    @Root() option: DocumentType<Metric>,
    @Ctx() ctx: ContextInterface,
  ): Promise<string> {
    return getLangField(option.name, ctx.req.session!.lang);
  }
}
