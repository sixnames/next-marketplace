import * as React from 'react';
import { Form, Formik } from 'formik';
import { CreateBrandInput, useCreateBrandMutation } from '../../generated/apolloComponents';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import useValidationSchema from '../../hooks/useValidationSchema';
import { createBrandSchema } from '../../validation/brandSchema';
import WpButton from '../button/WpButton';
import BrandMainFields from '../FormTemplates/BrandMainFields';
import ModalFrame from './ModalFrame';
import ModalTitle from './ModalTitle';

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
    showAsBreadcrumb: true,
    showAsCatalogueBreadcrumb: true,
    showInCardTitle: true,
    showInSnippetTitle: true,
    showInCatalogueTitle: true,
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

              <WpButton type={'submit'} testId={'submit-brand'}>
                Создать
              </WpButton>
            </Form>
          );
        }}
      </Formik>
    </ModalFrame>
  );
};

export default CreateBrandModal;
