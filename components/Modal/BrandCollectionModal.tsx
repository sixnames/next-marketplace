import { CreateBrandInputInterface } from 'db/dao/brands/createBrand';
import { Form, Formik } from 'formik';
import {
  useCreateBrandCollection,
  useUpdateBrandCollection,
} from 'hooks/mutations/useBrandMutations';
import * as React from 'react';
import { BrandCollectionInterface } from 'db/uiInterfaces';
import { ResolverValidationSchema } from 'lib/sessionHelpers';
import WpButton from '../button/WpButton';
import FormikCheckboxLine from '../FormElements/Checkbox/FormikCheckboxLine';
import FormikTranslationsInput from '../FormElements/Input/FormikTranslationsInput';
import ModalFrame from './ModalFrame';
import ModalTitle from './ModalTitle';

export interface BrandCollectionModalInterface {
  brandCollection?: BrandCollectionInterface;
  validationSchema: ResolverValidationSchema;
  brandId: string;
}

const BrandCollectionModal: React.FC<BrandCollectionModalInterface> = ({
  validationSchema,
  brandCollection,
  brandId,
}) => {
  const [createBrandCollectionMutation] = useCreateBrandCollection();
  const [updateBrandCollectionMutation] = useUpdateBrandCollection();

  const initialValues = {
    _id: brandCollection?._id,
    nameI18n: brandCollection?.nameI18n || {},
    descriptionI18n: brandCollection?.descriptionI18n || {},
    brandCollectionId: brandCollection?._id,
    showAsBreadcrumb: brandCollection?.showAsBreadcrumb || false,
    showAsCatalogueBreadcrumb: brandCollection?.showAsCatalogueBreadcrumb || false,
    showInCardTitle: brandCollection?.showInCardTitle || false,
    showInSnippetTitle: brandCollection?.showInSnippetTitle || false,
    showInCatalogueTitle: brandCollection?.showInCatalogueTitle || false,
    brandId,
  };

  return (
    <ModalFrame testId={'brand-collection-modal'}>
      <ModalTitle>{brandCollection ? 'Обновление' : 'Создание'} коллекции бренда</ModalTitle>
      <Formik<CreateBrandInputInterface>
        enableReinitialize
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={(values) => {
          if (brandCollection) {
            updateBrandCollectionMutation({
              _id: `${brandCollection._id}`,
              nameI18n: values.nameI18n,
              descriptionI18n: values.descriptionI18n,
              showAsBreadcrumb: values?.showAsBreadcrumb,
              showAsCatalogueBreadcrumb: values?.showAsCatalogueBreadcrumb,
              showInCardTitle: values?.showInCardTitle,
              showInSnippetTitle: values?.showInSnippetTitle,
              showInCatalogueTitle: values?.showInCatalogueTitle,
            }).catch(console.log);
            return;
          }
          createBrandCollectionMutation({
            brandId,
            nameI18n: values.nameI18n,
            descriptionI18n: values.descriptionI18n,
            showAsBreadcrumb: values?.showAsBreadcrumb,
            showAsCatalogueBreadcrumb: values?.showAsCatalogueBreadcrumb,
            showInCardTitle: values?.showInCardTitle,
            showInSnippetTitle: values?.showInSnippetTitle,
            showInCatalogueTitle: values?.showInCatalogueTitle,
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

              <FormikCheckboxLine
                label={'Показывать в крошках карточки'}
                name={'showAsBreadcrumb'}
              />

              <FormikCheckboxLine
                label={'Показывать в крошках каталога'}
                name={'showAsCatalogueBreadcrumb'}
              />

              <FormikCheckboxLine
                label={'Показывать в заголовке каталога'}
                name={'showInCatalogueTitle'}
              />

              <FormikCheckboxLine
                label={'Показывать в заголовке карточки'}
                name={'showInCardTitle'}
              />

              <FormikCheckboxLine
                label={'Показывать в заголовке сниппета'}
                name={'showInSnippetTitle'}
              />

              <WpButton type={'submit'} testId={'submit-brand-collection'}>
                {brandCollection ? 'Сохранить' : 'Создать'}
              </WpButton>
            </Form>
          );
        }}
      </Formik>
    </ModalFrame>
  );
};

export default BrandCollectionModal;
