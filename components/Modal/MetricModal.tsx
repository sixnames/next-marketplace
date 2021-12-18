import FormikTranslationsInput from 'components/FormElements/Input/FormikTranslationsInput';
import { MetricInterface } from 'db/uiInterfaces';
import {
  UpdateMetricInput,
  useCreateMetricMutation,
  useUpdateMetricMutation,
} from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import { ResolverValidationSchema } from 'lib/sessionHelpers';
import * as React from 'react';
import ModalFrame from 'components/Modal/ModalFrame';
import ModalTitle from 'components/Modal/ModalTitle';
import ModalButtons from 'components/Modal/ModalButtons';
import { Form, Formik } from 'formik';
import WpButton from 'components/button/WpButton';

export interface MetricModalInterface {
  metric?: MetricInterface;
  validationSchema: ResolverValidationSchema;
}

const MetricModal: React.FC<MetricModalInterface> = ({ metric, validationSchema }) => {
  const { showLoading, onErrorCallback, onCompleteCallback } = useMutationCallbacks({
    withModal: true,
    reload: true,
  });

  const [updateMetricMutation] = useUpdateMetricMutation({
    onCompleted: (data) => onCompleteCallback(data.updateMetric),
    onError: onErrorCallback,
  });

  const [createMetricMutation] = useCreateMetricMutation({
    onCompleted: (data) => onCompleteCallback(data.createMetric),
    onError: onErrorCallback,
  });

  const initialValues: UpdateMetricInput = {
    metricId: metric ? metric._id : 'null',
    nameI18n: metric?.nameI18n || {},
  };

  return (
    <ModalFrame testId={'metric-modal'}>
      <ModalTitle>{`${metric ? 'Обновление' : 'Создание'} единицы измерения`}</ModalTitle>

      <Formik
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={(values) => {
          showLoading();
          if (metric) {
            updateMetricMutation({
              variables: {
                input: {
                  metricId: `${metric._id}`,
                  nameI18n: values.nameI18n,
                },
              },
            }).catch(console.log);
            return;
          }

          createMetricMutation({
            variables: {
              input: {
                nameI18n: values.nameI18n,
              },
            },
          }).catch(console.log);
        }}
      >
        {() => {
          return (
            <Form>
              <FormikTranslationsInput
                label={'Название'}
                name={'nameI18n'}
                testId={'nameI18n'}
                showInlineError
                isRequired
              />

              <ModalButtons>
                <WpButton type={'submit'} testId={'submit-metric'}>
                  {metric ? 'Обновить' : 'Создать'}
                </WpButton>
              </ModalButtons>
            </Form>
          );
        }}
      </Formik>
    </ModalFrame>
  );
};

export default MetricModal;
