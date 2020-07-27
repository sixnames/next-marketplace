import * as Yup from 'yup';
import { langStringInputSchema } from './schemaTemplates';
import getValidationFieldMessage, {
  MultiLangSchemaMessagesInterface,
} from './getValidationFieldMessage';

const metricNameSchema = (args: MultiLangSchemaMessagesInterface) =>
  langStringInputSchema({
    ...args,
    requiredMessageKey: 'validation.metrics.name',
  });

export const createMetricInputSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    name: metricNameSchema(args),
  });

export const updateMetricSchema = ({
  lang,
  messages,
  defaultLang,
}: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    id: Yup.string()
      .nullable()
      .required(
        getValidationFieldMessage({
          messages,
          lang,
          key: 'validation.metrics.id',
        }),
      ),
    name: metricNameSchema({ defaultLang, lang, messages }),
  });
