import { Form, Formik } from 'formik';
import * as React from 'react';
import { SupplierInterface } from '../../db/uiInterfaces';
import {
  CreateSupplierInput,
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
} from '../../generated/apolloComponents';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import { ResolverValidationSchema } from '../../lib/sessionHelpers';
import WpButton from '../button/WpButton';
import FormikMultiLineInput from '../FormElements/Input/FormikMultiLineInput';
import FormikTranslationsInput from '../FormElements/Input/FormikTranslationsInput';
import ModalFrame from './ModalFrame';
import ModalTitle from './ModalTitle';

export interface SupplierModalInterface {
  supplier?: SupplierInterface;
  validationSchema: ResolverValidationSchema;
}

const SupplierModal: React.FC<SupplierModalInterface> = ({ validationSchema, supplier }) => {
  const { onCompleteCallback, onErrorCallback, showLoading } = useMutationCallbacks({
    withModal: true,
    reload: true,
  });
  const [createSupplierMutation] = useCreateSupplierMutation({
    onCompleted: (data) => onCompleteCallback(data.createSupplier),
    onError: onErrorCallback,
  });

  const [updateSupplierMutation] = useUpdateSupplierMutation({
    onCompleted: (data) => onCompleteCallback(data.updateSupplier),
    onError: onErrorCallback,
  });

  const initialValues = {
    nameI18n: supplier?.nameI18n || {},
    descriptionI18n: supplier?.descriptionI18n || {},
    supplierId: supplier?._id,
    url: !supplier?.url || supplier?.url.length < 1 ? [''] : supplier.url,
  };

  return (
    <ModalFrame testId={'supplier-modal'}>
      <ModalTitle>{supplier ? 'Обновление' : 'Создание'} поставщика</ModalTitle>
      <Formik<CreateSupplierInput>
        enableReinitialize
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={(values) => {
          showLoading();
          if (supplier) {
            updateSupplierMutation({
              variables: {
                input: {
                  supplierId: supplier._id,
                  nameI18n: values.nameI18n,
                  descriptionI18n: values.descriptionI18n,
                  url: (values.url || []).reduce((acc: string[], url) => {
                    if (!url) {
                      return acc;
                    }
                    return [...acc, url];
                  }, []),
                },
              },
            }).catch(console.log);
            return;
          }
          createSupplierMutation({
            variables: {
              input: {
                nameI18n: values.nameI18n,
                descriptionI18n: values.descriptionI18n,
                url: (values.url || []).reduce((acc: string[], url) => {
                  if (!url) {
                    return acc;
                  }
                  return [...acc, url];
                }, []),
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
                isRequired
                showInlineError
              />

              <FormikTranslationsInput
                label={'Описание'}
                name={'descriptionI18n'}
                testId={'descriptionI18n'}
                showInlineError
              />

              <FormikMultiLineInput
                name={'url'}
                testId={'url'}
                label={'Ссылка на сайт поставщика'}
                showInlineError
              />

              <WpButton type={'submit'} testId={'submit-supplier'}>
                {supplier ? 'Сохранить' : 'Создать'}
              </WpButton>
            </Form>
          );
        }}
      </Formik>
    </ModalFrame>
  );
};

export default SupplierModal;
