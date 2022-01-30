import { Form, Formik } from 'formik';
import * as React from 'react';
import { UpdateTaskVariantInputInterface } from '../../db/dao/tasks/updateTaskVariant';
import { TaskVariantPriceModel } from '../../db/dbModels';
import { TaskVariantInterface } from '../../db/uiInterfaces';
import { useUpdateTaskVariant } from '../../hooks/mutations/useTaskMutations';
import useValidationSchema from '../../hooks/useValidationSchema';
import { createTaskVariantSchema } from '../../validation/taskVariantSchema';
import FixedButtons from '../button/FixedButtons';
import WpButton from '../button/WpButton';
import TaskVariantMainFields from '../FormTemplates/TaskVariantMainFields';
import Inner from '../Inner';
import WpTitle from '../WpTitle';

export interface UpdateTaskVariantFormInterface {
  taskVariant: TaskVariantInterface;
}

const UpdateTaskVariantForm: React.FC<UpdateTaskVariantFormInterface> = ({ taskVariant }) => {
  const validationSchema = useValidationSchema({
    schema: createTaskVariantSchema,
  });
  const initialValues: UpdateTaskVariantInputInterface = {
    _id: `${taskVariant._id}`,
    nameI18n: taskVariant.nameI18n,
    prices: taskVariant.prices,
    companySlug: taskVariant.companySlug,
    slug: taskVariant.slug,
  };
  const [updateTaskVariantMutation] = useUpdateTaskVariant();

  return (
    <Inner testId={'create-task-variant-page'}>
      <WpTitle>Обновление типа задачи</WpTitle>
      <Formik<UpdateTaskVariantInputInterface>
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          updateTaskVariantMutation(values).catch(console.log);
        }}
      >
        {({ values }) => {
          return (
            <Form>
              <TaskVariantMainFields
                onPriceCreateHandler={(price) => {
                  const newPrices = [...values.prices, price];
                  updateTaskVariantMutation({
                    ...values,
                    prices: newPrices,
                  }).catch(console.log);
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
                  updateTaskVariantMutation({
                    ...values,
                    prices: newPrices,
                  }).catch(console.log);
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
                  updateTaskVariantMutation({
                    ...values,
                    prices: newPrices,
                  }).catch(console.log);
                }}
              />
              <FixedButtons>
                <WpButton type={'submit'} size={'small'} testId={'task-variant-submit'}>
                  Обновить
                </WpButton>
              </FixedButtons>
            </Form>
          );
        }}
      </Formik>
    </Inner>
  );
};

export default UpdateTaskVariantForm;
