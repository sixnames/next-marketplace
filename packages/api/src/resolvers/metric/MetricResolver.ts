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
} from 'type-graphql';
import PayloadType from '../commonInputs/PayloadType';
import { Metric, MetricModel } from '../../entities/Metric';
import getResolverErrorMessage from '../../utils/getResolverErrorMessage';
import { CreateMetricInput } from './CreateMetricInput';
import { UpdateMetricInput } from './UpdateMetricInput';
import { AttributeModel } from '../../entities/Attribute';
import { DocumentType } from '@typegoose/typegoose';
import { createMetricInputSchema, updateMetricSchema } from '@yagu/validation';
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
} = RoleRuleModel.getOperationsConfigs(Metric.name);

@ObjectType()
class MetricPayloadType extends PayloadType() {
  @Field((_type) => Metric, { nullable: true })
  metric?: Metric;
}

@Resolver((_of) => Metric)
export class MetricResolver {
  @Query(() => Metric, { nullable: true })
  @AuthMethod(operationConfigRead)
  async getMetric(
    @CustomFilter(operationConfigRead) customFilter: FilterQuery<Metric>,
    @Arg('id', (_type) => ID) id: string,
  ): Promise<Metric | null> {
    return MetricModel.findOne({ _id: id, ...customFilter });
  }

  @Query(() => [Metric], { nullable: true })
  @AuthMethod(operationConfigRead)
  async getAllMetrics(
    @CustomFilter(operationConfigRead) customFilter: FilterQuery<Metric>,
  ): Promise<Metric[]> {
    return MetricModel.find(customFilter);
  }

  @Mutation(() => MetricPayloadType)
  @AuthMethod(operationConfigCreate)
  @ValidateMethod({ schema: createMetricInputSchema })
  async createMetric(
    @Localization() { getApiMessage }: LocalizationPayloadInterface,
    @Arg('input') input: CreateMetricInput,
  ): Promise<MetricPayloadType> {
    try {
      const nameValues = input.name.map(({ value }) => value);
      const exist = await MetricModel.exists({
        'name.value': {
          $in: nameValues,
        },
      });
      if (exist) {
        return {
          success: false,
          message: await getApiMessage(`metrics.create.duplicate`),
        };
      }

      const metric = await MetricModel.create(input);

      if (!metric) {
        return {
          success: false,
          message: await getApiMessage(`metrics.create.error`),
        };
      }

      return {
        success: true,
        message: await getApiMessage(`metrics.create.success`),
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
  @AuthMethod(operationConfigUpdate)
  @ValidateMethod({ schema: updateMetricSchema })
  async updateMetric(
    @Localization() { getApiMessage }: LocalizationPayloadInterface,
    @CustomFilter(operationConfigUpdate) customFilter: FilterQuery<Metric>,
    @Arg('input') input: UpdateMetricInput,
  ): Promise<MetricPayloadType> {
    try {
      const nameValues = input.name.map(({ value }) => value);
      const exist = await MetricModel.exists({
        'name.value': {
          $in: nameValues,
        },
      });
      if (exist) {
        return {
          success: false,
          message: await getApiMessage(`metrics.update.duplicate`),
        };
      }

      const { id, ...values } = input;
      const metric = await MetricModel.findOneAndUpdate({ _id: id, ...customFilter }, values, {
        new: true,
      });

      if (!metric) {
        return {
          success: false,
          message: await getApiMessage(`metrics.update.error`),
        };
      }

      return {
        success: true,
        message: await getApiMessage(`metrics.update.success`),
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
  @AuthMethod(operationConfigDelete)
  async deleteMetric(
    @Localization() { getApiMessage }: LocalizationPayloadInterface,
    @Arg('id', (_type) => ID) id: string,
  ): Promise<MetricPayloadType> {
    try {
      const isUsedInAttributes = await AttributeModel.exists({ metric: id });
      if (isUsedInAttributes) {
        return {
          success: false,
          message: await getApiMessage(`metrics.delete.used`),
        };
      }

      const metric = await MetricModel.findByIdAndDelete(id);

      if (!metric) {
        return {
          success: false,
          message: await getApiMessage(`metrics.delete.error`),
        };
      }

      return {
        success: true,
        message: await getApiMessage(`metrics.delete.success`),
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
    @Localization() { getLangField }: LocalizationPayloadInterface,
  ): Promise<string> {
    return getLangField(metric.name);
  }
}
