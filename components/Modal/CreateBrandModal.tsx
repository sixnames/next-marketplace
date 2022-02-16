import { CreateBrandInputInterface } from 'db/dao/brands/createBrand';
import { Form, Formik } from 'formik';
import { useCreateBrand } from 'hooks/mutations/useBrandMutations';
import * as React from 'react';
import { createBrandSchema } from 'validation/brandSchema';
import useValidationSchema from '../../hooks/useValidationSchema';
import WpButton from '../button/WpButton';
import BrandMainFields from '../FormTemplates/BrandMainFields';
import ModalFrame from './ModalFrame';
import ModalTitle from './ModalTitle';

const CreateBrandModal: React.FC = () => {
  const [createBrandMutation] = useCreateBrand();
  const validationSchema = useValidationSchema({
    schema: createBrandSchema,
  });

  const initialValues: CreateBrandInputInterface = {
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
      <Formik<CreateBrandInputInterface>
        enableReinitialize
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={(values) => {
          createBrandMutation({
            ...values,
            url: (values.url || []).reduce((acc: string[], url) => {
              if (!url) {
                return acc;
              }
              return [...acc, url];
            }, []),
          }).catch(console.log);
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
