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
import { UpdateMetricInput } from './UpdateMetricInput';
import { AttributeModel } from '../../entities/Attribute';
import { DocumentType } from '@typegoose/typegoose';
import { ContextInterface } from '../../types/context';
import getLangField from '../../utils/translations/getLangField';
import { createMetricInputSchema, updateMetricSchema } from '../../validation';
import getApiMessage from '../../utils/translations/getApiMessage';

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
      const lang = ctx.req.lang;
      const defaultLang = ctx.req.defaultLang;
      await createMetricInputSchema(defaultLang).validate(input);

      const nameValues = input.name.map(({ value }) => value);
      const exist = await MetricModel.exists({
        'name.value': {
          $in: nameValues,
        },
      });
      if (exist) {
        return {
          success: false,
          message: await getApiMessage({ key: `metrics.create.duplicate`, lang }),
        };
      }

      const metric = await MetricModel.create(input);

      if (!metric) {
        return {
          success: false,
          message: await getApiMessage({ key: `metrics.create.error`, lang }),
        };
      }

      return {
        success: true,
        message: await getApiMessage({ key: `metrics.create.success`, lang }),
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
      const lang = ctx.req.lang;
      const defaultLang = ctx.req.defaultLang;
      await updateMetricSchema(defaultLang).validate(input);

      const nameValues = input.name.map(({ value }) => value);
      const exist = await MetricModel.exists({
        'name.value': {
          $in: nameValues,
        },
      });
      if (exist) {
        return {
          success: false,
          message: await getApiMessage({ key: `metrics.update.duplicate`, lang }),
        };
      }

      const { id, ...values } = input;
      const metric = await MetricModel.findByIdAndUpdate(id, values, { new: true });

      if (!metric) {
        return {
          success: false,
          message: await getApiMessage({ key: `metrics.update.error`, lang }),
        };
      }

      return {
        success: true,
        message: await getApiMessage({ key: `metrics.update.success`, lang }),
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
      const lang = ctx.req.lang;
      const isUsedInAttributes = await AttributeModel.exists({ metric: id });
      if (isUsedInAttributes) {
        return {
          success: false,
          message: await getApiMessage({ key: `metrics.delete.used`, lang }),
        };
      }

      const metric = await MetricModel.findByIdAndDelete(id);

      if (!metric) {
        return {
          success: false,
          message: await getApiMessage({ key: `metrics.delete.error`, lang }),
        };
      }

      return {
        success: true,
        message: await getApiMessage({ key: `metrics.delete.success`, lang }),
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
    return getLangField(metric.name, ctx.req.lang);
  }
}
