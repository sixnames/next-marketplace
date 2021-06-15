import Button from 'components/Buttons/Button';
import FormikInput from 'components/FormElements/Input/FormikInput';
import FormikTranslationsInput from 'components/FormElements/Input/FormikTranslationsInput';
import ModalButtons from 'components/Modal/ModalButtons';
import ModalFrame from 'components/Modal/ModalFrame';
import ModalTitle from 'components/Modal/ModalTitle';
import { DEFAULT_LOCALE } from 'config/common';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useValidationSchema from 'hooks/useValidationSchema';
import { noNaN } from 'lib/numbers';
import * as React from 'react';
import { createPageSchema } from 'validation/pagesSchema';
import { Form, Formik } from 'formik';
import { useCreatePageMutation } from 'generated/apolloComponents';

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

  const [createUserMutation] = useCreatePageMutation({
    onCompleted: (data) => onCompleteCallback(data.createPage),
    onError: onErrorCallback,
  });

  return (
    <ModalFrame testId={'create-user-modal'}>
      <ModalTitle>Создание старницы</ModalTitle>

      <Formik
        validationSchema={validationSchema}
        initialValues={{
          index: null,
          nameI18n: {
            [DEFAULT_LOCALE]: '',
          },
        }}
        onSubmit={(values) => {
          showLoading();
          createUserMutation({
            variables: {
              input: {
                ...values,
                index: noNaN(values.index),
                pagesGroupId,
              },
            },
          }).catch(console.log);
        }}
      >
        {() => {
          return (
            <Form>
              <ModalButtons>
                <FormikTranslationsInput name={'nameI18n'} testId={'name'} />
                <FormikInput name={'index'} testId={'index'} />

                <Button type={'submit'} testId={'submit-user'}>
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
