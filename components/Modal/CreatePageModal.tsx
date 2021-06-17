import Button from 'components/Buttons/Button';
import FormikInput from 'components/FormElements/Input/FormikInput';
import FormikTranslationsInput from 'components/FormElements/Input/FormikTranslationsInput';
import FormikSelect from 'components/FormElements/Select/FormikSelect';
import ModalButtons from 'components/Modal/ModalButtons';
import ModalFrame from 'components/Modal/ModalFrame';
import ModalTitle from 'components/Modal/ModalTitle';
import RequestError from 'components/RequestError';
import Spinner from 'components/Spinner/Spinner';
import { DEFAULT_LOCALE } from 'config/common';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useValidationSchema from 'hooks/useValidationSchema';
import { noNaN } from 'lib/numbers';
import * as React from 'react';
import { createPageSchema } from 'validation/pagesSchema';
import { Form, Formik } from 'formik';
import { useCreatePageMutation, useGetSessionCitiesQuery } from 'generated/apolloComponents';

export interface CreatePageModalInterface {
  pagesGroupId: string;
}

const CreatePageModal: React.FC<CreatePageModalInterface> = ({ pagesGroupId }) => {
  const { showLoading, hideModal, onCompleteCallback, onErrorCallback } = useMutationCallbacks({
    reload: true,
  });
  const validationSchema = useValidationSchema({
    schema: createPageSchema,
  });

  const [createPageMutation] = useCreatePageMutation({
    onCompleted: (data) => onCompleteCallback(data.createPage),
    onError: onErrorCallback,
  });

  const { data, loading, error } = useGetSessionCitiesQuery();

  if (loading) {
    return (
      <ModalFrame>
        <Spinner isNested isTransparent />
      </ModalFrame>
    );
  }

  if (error || !data) {
    return (
      <ModalFrame>
        <RequestError />
      </ModalFrame>
    );
  }

  return (
    <ModalFrame testId={'create-page-modal'}>
      <ModalTitle>Создание старницы</ModalTitle>

      <Formik
        validationSchema={validationSchema}
        initialValues={{
          index: null,
          pagesGroupId,
          citySlug: '',
          nameI18n: {
            [DEFAULT_LOCALE]: '',
          },
          descriptionI18n: {
            [DEFAULT_LOCALE]: '',
          },
        }}
        onSubmit={(values) => {
          showLoading();
          createPageMutation({
            variables: {
              input: {
                ...values,
                citySlug: `${values.citySlug}`,
                index: noNaN(values.index),
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
                testId={'name'}
                showInlineError
                isRequired
              />
              <FormikTranslationsInput
                label={'Описание'}
                name={'descriptionI18n'}
                testId={'description'}
                showInlineError
                isRequired
              />
              <FormikInput
                label={'Порядковый номер'}
                name={'index'}
                testId={'index'}
                showInlineError
                isRequired
              />
              <FormikSelect
                firstOption={'Не назначен'}
                label={'Город'}
                name={'citySlug'}
                testId={'citySlug'}
                options={data?.getSessionCities || []}
                isRequired
                showInlineError
              />

              <ModalButtons>
                <Button type={'submit'} testId={'submit-page'}>
                  Создать
                </Button>
                <Button theme={'secondary'} onClick={hideModal}>
                  Закрыть
                </Button>
              </ModalButtons>
            </Form>
          );
        }}
      </Formik>
    </ModalFrame>
  );
};

export default CreatePageModal;
