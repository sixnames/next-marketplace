import Button from 'components/button/Button';
import FormikMultiLineInput from 'components/FormElements/Input/FormikMultiLineInput';
import FormikTranslationsInput from 'components/FormElements/Input/FormikTranslationsInput';
import { ManufacturerInterface } from 'db/uiInterfaces';
import { ResolverValidationSchema } from 'lib/sessionHelpers';
import * as React from 'react';
import ModalFrame from 'components/Modal/ModalFrame';
import ModalTitle from 'components/Modal/ModalTitle';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import {
  CreateManufacturerInput,
  useCreateManufacturerMutation,
  useUpdateManufacturerMutation,
} from 'generated/apolloComponents';
import { Form, Formik } from 'formik';

export interface ManufacturerModalInterface {
  manufacturer?: ManufacturerInterface;
  validationSchema: ResolverValidationSchema;
}

const ManufacturerModal: React.FC<ManufacturerModalInterface> = ({
  validationSchema,
  manufacturer,
}) => {
  const { onCompleteCallback, onErrorCallback, showLoading } = useMutationCallbacks({
    withModal: true,
    reload: true,
  });
  const [createManufacturerMutation] = useCreateManufacturerMutation({
    onCompleted: (data) => onCompleteCallback(data.createManufacturer),
    onError: onErrorCallback,
  });

  const [updateManufacturerMutation] = useUpdateManufacturerMutation({
    onCompleted: (data) => onCompleteCallback(data.updateManufacturer),
    onError: onErrorCallback,
  });

  const initialValues = {
    nameI18n: manufacturer?.nameI18n || {},
    descriptionI18n: manufacturer?.descriptionI18n || {},
    manufacturerId: manufacturer?._id,
    url: !manufacturer?.url || manufacturer?.url.length < 1 ? [''] : manufacturer.url,
  };

  return (
    <ModalFrame testId={'manufacturer-modal'}>
      <ModalTitle>{manufacturer ? 'Обновление' : 'Создание'} производителя</ModalTitle>
      <Formik<CreateManufacturerInput>
        enableReinitialize
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={(values) => {
          showLoading();
          if (manufacturer) {
            updateManufacturerMutation({
              variables: {
                input: {
                  manufacturerId: manufacturer._id,
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
          createManufacturerMutation({
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
                label={'Ссылка на сайт производителя'}
                showInlineError
              />

              <Button type={'submit'} testId={'submit-manufacturer'}>
                {manufacturer ? 'Сохранить' : 'Создать'}
              </Button>
            </Form>
          );
        }}
      </Formik>
    </ModalFrame>
  );
};

export default ManufacturerModal;
