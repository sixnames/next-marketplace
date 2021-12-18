import WpButton from 'components/button/WpButton';
import FormikCheckboxLine from 'components/FormElements/Checkbox/FormikCheckboxLine';
import FormikTranslationsInput from 'components/FormElements/Input/FormikTranslationsInput';
import { BrandCollectionInterface } from 'db/uiInterfaces';
import { ResolverValidationSchema } from 'lib/sessionHelpers';
import * as React from 'react';
import ModalFrame from 'components/Modal/ModalFrame';
import ModalTitle from 'components/Modal/ModalTitle';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import {
  CreateBrandInput,
  useAddCollectionToBrandMutation,
  useUpdateCollectionInBrandMutation,
} from 'generated/apolloComponents';
import { Form, Formik } from 'formik';

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
  const { onCompleteCallback, onErrorCallback, showLoading } = useMutationCallbacks({
    withModal: true,
    reload: true,
  });
  const [addCollectionToBrandMutation] = useAddCollectionToBrandMutation({
    onCompleted: (data) => onCompleteCallback(data.addCollectionToBrand),
    onError: onErrorCallback,
  });
  const [updateCollectionInBrandMutation] = useUpdateCollectionInBrandMutation({
    onCompleted: (data) => onCompleteCallback(data.updateCollectionInBrand),
    onError: onErrorCallback,
  });

  const initialValues = {
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
      <Formik<CreateBrandInput>
        enableReinitialize
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={(values) => {
          showLoading();
          if (brandCollection) {
            updateCollectionInBrandMutation({
              variables: {
                input: {
                  brandCollectionId: brandCollection._id,
                  brandId,
                  nameI18n: values.nameI18n,
                  descriptionI18n: values.descriptionI18n,
                  showAsBreadcrumb: values?.showAsBreadcrumb,
                  showAsCatalogueBreadcrumb: values?.showAsCatalogueBreadcrumb,
                  showInCardTitle: values?.showInCardTitle,
                  showInSnippetTitle: values?.showInSnippetTitle,
                  showInCatalogueTitle: values?.showInCatalogueTitle,
                },
              },
            }).catch(console.log);
            return;
          }
          addCollectionToBrandMutation({
            variables: {
              input: {
                brandId,
                nameI18n: values.nameI18n,
                descriptionI18n: values.descriptionI18n,
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
