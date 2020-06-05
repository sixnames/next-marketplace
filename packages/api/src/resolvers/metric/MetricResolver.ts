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
import { getMessageTranslation } from '../../config/translations';

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
  async createMetric(
    @Ctx() ctx: ContextInterface,
    @Arg('input') input: CreateMetricInput,
  ): Promise<MetricPayloadType> {
    try {
      const lang = ctx.req.session!.lang;
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
          message: getMessageTranslation(`metric.create.duplicate.${lang}`),
        };
      }

      const metric = await MetricModel.create(input);

      if (!metric) {
        return {
          success: false,
          message: getMessageTranslation(`metric.create.error.${lang}`),
        };
      }

      return {
        success: true,
        message: getMessageTranslation(`metric.create.success.${lang}`),
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
  async updateMetric(
    @Ctx() ctx: ContextInterface,
    @Arg('input') input: UpdateMetricInput,
  ): Promise<MetricPayloadType> {
    try {
      const lang = ctx.req.session!.lang;
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
          message: getMessageTranslation(`metric.update.duplicate.${lang}`),
        };
      }

      const { id, ...values } = input;
      const metric = await MetricModel.findByIdAndUpdate(id, values, { new: true });

      if (!metric) {
        return {
          success: false,
          message: getMessageTranslation(`metric.update.error.${lang}`),
        };
      }

      return {
        success: true,
        message: getMessageTranslation(`metric.update.success.${lang}`),
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
  async deleteMetric(
    @Ctx() ctx: ContextInterface,
    @Arg('id', (_type) => ID) id: string,
  ): Promise<MetricPayloadType> {
    try {
      const lang = ctx.req.session!.lang;
      const isUsedInAttributes = await AttributeModel.exists({ metric: id });
      if (isUsedInAttributes) {
        return {
          success: false,
          message: getMessageTranslation(`metric.delete.used.${lang}`),
        };
      }

      const metric = await MetricModel.findByIdAndDelete(id);

      if (!metric) {
        return {
          success: false,
          message: getMessageTranslation(`metric.delete.error.${lang}`),
        };
      }

      return {
        success: true,
        message: getMessageTranslation(`metric.delete.success.${lang}`),
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
    @Root() metric: DocumentType<Metric>,
    @Ctx() ctx: ContextInterface,
  ): Promise<string> {
    return getLangField(metric.name, ctx.req.session!.lang);
  }
}
