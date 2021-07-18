import Button from 'components/Button';
import BrandMainFields from 'components/FormTemplates/BrandMainFields';
import * as React from 'react';
import ModalFrame from 'components/Modal/ModalFrame';
import ModalTitle from 'components/Modal/ModalTitle';
import useValidationSchema from 'hooks/useValidationSchema';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import { CreateBrandInput, useCreateBrandMutation } from 'generated/apolloComponents';
import { createBrandSchema } from 'validation/brandSchema';
import { Form, Formik } from 'formik';

const CreateBrandModal: React.FC = () => {
  const { onCompleteCallback, onErrorCallback, showLoading, showErrorNotification } =
    useMutationCallbacks({ withModal: true, reload: true });
  const [createBrandMutation] = useCreateBrandMutation({
    onCompleted: (data) => onCompleteCallback(data.createBrand),
    onError: onErrorCallback,
  });
  const validationSchema = useValidationSchema({
    schema: createBrandSchema,
  });

  const initialValues: CreateBrandInput = {
    descriptionI18n: {},
    nameI18n: {},
    url: [''],
  };

  return (
    <ModalFrame testId={'create-brand-modal'}>
      <ModalTitle>Создание бренда</ModalTitle>
      <Formik<CreateBrandInput>
        enableReinitialize
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={(values) => {
          showLoading();
          createBrandMutation({
            variables: {
              input: {
                ...values,
                url: (values.url || []).reduce((acc: string[], url) => {
                  if (!url) {
                    return acc;
                  }
                  return [...acc, url];
                }, []),
              },
            },
          }).catch(() => {
            showErrorNotification();
          });
        }}
      >
        {() => {
          return (
            <Form>
              <BrandMainFields />

              <Button type={'submit'} testId={'shop-submit'}>
                Создать
              </Button>
            </Form>
          );
        }}
      </Formik>
    </ModalFrame>
  );
};

export default CreateBrandModal;
