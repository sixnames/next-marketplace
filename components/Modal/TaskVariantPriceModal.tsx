import { Form, Formik } from 'formik';
import * as React from 'react';
import { TaskVariantPriceModel } from '../../db/dbModels';
import {
  TASK_PRICE_ACTION_ADDED,
  TASK_PRICE_ACTIONS,
  TASK_PRICE_SLUG_PRODUCT_ATTRIBUTE_SELECT,
  TASK_PRICE_SLUGS,
  TASK_PRICE_TARGET_TASK,
  TASK_PRICE_TARGETS,
} from '../../lib/config/constantSelects';
import WpButton from '../button/WpButton';
import { useAppContext } from '../context/appContext';
import FormikInput from '../FormElements/Input/FormikInput';
import FormikSelect from '../FormElements/Select/FormikSelect';
import ModalButtons from './ModalButtons';
import ModalFrame from './ModalFrame';
import ModalTitle from './ModalTitle';

export interface TaskVariantPriceModalInterface {
  taskVariantPrice?: TaskVariantPriceModel | null;
  onSubmit: (taskVariantPrice: TaskVariantPriceModel) => void;
}

const TaskVariantPriceModal: React.FC<TaskVariantPriceModalInterface> = ({
  taskVariantPrice,
  onSubmit,
}) => {
  const { hideModal } = useAppContext();
  const initialValues: TaskVariantPriceModel = {
    price: taskVariantPrice?.price || 0,
    target: taskVariantPrice?.target || TASK_PRICE_TARGET_TASK,
    slug: taskVariantPrice?.slug || TASK_PRICE_SLUG_PRODUCT_ATTRIBUTE_SELECT,
    action: taskVariantPrice?.action || TASK_PRICE_ACTION_ADDED,
  };

  return (
    <ModalFrame testId={'task-variant-price-modal'}>
      <ModalTitle>Цена типа задачи</ModalTitle>

      <Formik
        initialValues={initialValues}
        onSubmit={(values) => {
          onSubmit(values);
          hideModal();
        }}
      >
        {() => {
          return (
            <Form>
              <FormikInput name={'price'} testId={'price'} label={'Цена'} type={'number'} />

              <FormikSelect
                name={'target'}
                testId={'target'}
                label={'Цель'}
                options={TASK_PRICE_TARGETS}
              />

              <FormikSelect
                name={'slug'}
                testId={'slug'}
                label={'Slug'}
                options={TASK_PRICE_SLUGS}
              />

              <FormikSelect
                name={'action'}
                testId={'action'}
                label={'Действие'}
                options={TASK_PRICE_ACTIONS}
              />
              <ModalButtons>
                <WpButton testId={'task-variant-price-submit'} type={'submit'}>
                  Сохранить
                </WpButton>
              </ModalButtons>
            </Form>
          );
        }}
      </Formik>
    </ModalFrame>
  );
};

export default TaskVariantPriceModal;
