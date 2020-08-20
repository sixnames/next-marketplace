import * as Yup from 'yup';
import { langStringInputSchema } from './schemaTemplates';
import getFieldValidationMessage, {
  MultiLangSchemaMessagesInterface,
} from './getFieldValidationMessage';

const metricNameSchema = (args: MultiLangSchemaMessagesInterface) =>
  langStringInputSchema({
    ...args,
    requiredMessageKey: 'validation.metrics.name',
  });

export const createMetricInputSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    name: metricNameSchema(args),
  });

export const updateMetricSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    id: Yup.string()
      .nullable()
      .required(
        getFieldValidationMessage({
          ...args,
          key: 'validation.metrics.id',
        }),
      ),
    name: metricNameSchema(args),
  });
