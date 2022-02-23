import { CreateTaskVariantInputInterface } from 'db/dao/tasks/createTaskVariant';
import { TaskVariantPriceModel } from 'db/dbModels';
import { Form, Formik } from 'formik';
import { useCreateTaskVariant } from 'hooks/mutations/useTaskMutations';
import { DEFAULT_COMPANY_SLUG } from 'lib/config/common';
import { TASK_VARIANT_SLUG_PRODUCT_ATTRIBUTES } from 'lib/config/constantSelects';
import * as React from 'react';
import { createTaskVariantSchema } from 'validation/taskSchema';
import useValidationSchema from '../../hooks/useValidationSchema';
import FixedButtons from '../button/FixedButtons';
import WpButton from '../button/WpButton';
import TaskVariantMainFields from '../FormTemplates/TaskVariantMainFields';
import Inner from '../Inner';
import WpTitle from '../WpTitle';

export interface CreateTaskVariantFormInterface {
  companySlug?: string;
}

const CreateTaskVariantForm: React.FC<CreateTaskVariantFormInterface> = ({ companySlug }) => {
  const validationSchema = useValidationSchema({
    schema: createTaskVariantSchema,
  });
  const initialValues: CreateTaskVariantInputInterface = {
    nameI18n: {},
    prices: [],
    companySlug: companySlug || DEFAULT_COMPANY_SLUG,
    slug: TASK_VARIANT_SLUG_PRODUCT_ATTRIBUTES,
  };
  const [createTaskVariantMutation] = useCreateTaskVariant();

  return (
    <Inner testId={'create-task-variant-page'}>
      <WpTitle>Создание типа задачи</WpTitle>

      <Formik<CreateTaskVariantInputInterface>
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          createTaskVariantMutation(values).catch(console.log);
        }}
      >
        {({ values, setFieldValue }) => {
          return (
            <Form>
              <TaskVariantMainFields
                onPriceCreateHandler={(price) => {
                  const newPrices = [...values.prices, price];
                  setFieldValue('prices', newPrices);
                }}
                onPriceDeleteHandler={(priceIndex) => {
                  const newPrices = values.prices.reduce(
                    (acc: TaskVariantPriceModel[], price, index) => {
                      if (priceIndex === index) {
                        return acc;
                      }
                      return [...acc, price];
                    },
                    [],
                  );
                  setFieldValue('prices', newPrices);
                }}
                onPriceUpdateHandler={(taskVariantPrice, priceIndex) => {
                  const newPrices = values.prices.reduce(
                    (acc: TaskVariantPriceModel[], price, index) => {
                      if (priceIndex === index) {
                        return [...acc, taskVariantPrice];
                      }
                      return [...acc, price];
                    },
                    [],
                  );
                  setFieldValue('prices', newPrices);
                }}
              />
              <FixedButtons>
                <WpButton type={'submit'} size={'small'} testId={'task-variant-submit'}>
                  Создать
                </WpButton>
              </FixedButtons>
            </Form>
          );
        }}
      </Formik>
    </Inner>
  );
};

export default CreateTaskVariantForm;
