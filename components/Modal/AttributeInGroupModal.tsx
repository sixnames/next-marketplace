import { Form, Formik } from 'formik';
import * as React from 'react';
import { UpdateAttributeInputInterface } from '../../db/dao/attributes/updateAttribute';
import { AttributeInterface, MetricInterface, OptionsGroupInterface } from '../../db/uiInterfaces';
import { useConstantOptions } from '../../hooks/useConstantOptions';
import useValidationSchema from '../../hooks/useValidationSchema';
import {
  ATTRIBUTE_POSITION_IN_TITLE_BEGIN,
  ATTRIBUTE_VARIANT_MULTIPLE_SELECT,
  ATTRIBUTE_VARIANT_SELECT,
  ATTRIBUTE_VIEW_VARIANT_LIST,
  DEFAULT_LOCALE,
} from '../../lib/config/common';
import { attributeInGroupModalSchema } from '../../validation/attributesGroupSchema';
import WpButton from '../button/WpButton';
import { useAppContext } from '../context/appContext';
import FormikCheckboxLine from '../FormElements/Checkbox/FormikCheckboxLine';
import FormikTranslationsInput from '../FormElements/Input/FormikTranslationsInput';
import FormikSelect from '../FormElements/Select/FormikSelect';
import FormikTranslationsSelect from '../FormElements/Select/FormikTranslationsSelect';
import ModalButtons from './ModalButtons';
import ModalFrame from './ModalFrame';
import ModalTitle from './ModalTitle';

type AddAttributeToGroupModalValuesType = Omit<
  UpdateAttributeInputInterface,
  'attributesGroupId' | 'attributeId'
>;

export interface AddAttributeToGroupModalInterface {
  attribute?: AttributeInterface;
  attributesGroupId: string;
  metrics: MetricInterface[];
  optionGroups: OptionsGroupInterface[];
  confirm: (values: AddAttributeToGroupModalValuesType) => void;
}

const AttributeInGroupModal: React.FC<AddAttributeToGroupModalInterface> = ({
  confirm,
  attribute,
  metrics,
  optionGroups,
}) => {
  const validationSchema = useValidationSchema({
    schema: attributeInGroupModalSchema,
  });
  const { hideModal } = useAppContext();
  const { attributePositioningOptions, attributeVariantOptions, attributeViewVariantOptions } =
    useConstantOptions();

  const positioningInTitle = {
    [DEFAULT_LOCALE]: ATTRIBUTE_POSITION_IN_TITLE_BEGIN,
  };

  // @ts-ignore
  const initialValues: AddAttributeToGroupModalValuesType = {
    nameI18n: attribute?.nameI18n || {},
    variant: attribute?.variant || ATTRIBUTE_VARIANT_SELECT,
    viewVariant: attribute?.viewVariant || ATTRIBUTE_VIEW_VARIANT_LIST,
    metricId: attribute?.metric ? `${attribute.metric._id}` : null,
    optionsGroupId: attribute?.optionsGroupId ? `${attribute?.optionsGroupId}` : null,
    positioningInTitle: attribute?.positioningInTitle || positioningInTitle,
    positioningInCardTitle: attribute?.positioningInCardTitle || positioningInTitle,
    capitalise: attribute?.capitalise || false,
    notShowAsAlphabet: attribute?.notShowAsAlphabet || false,
    showAsBreadcrumb: attribute?.showAsBreadcrumb || false,
    showNameInTitle: attribute?.showNameInTitle || false,
    showNameInSelectedAttributes: attribute?.showNameInSelectedAttributes || false,
    showNameInSnippetTitle: attribute?.showNameInSnippetTitle || false,
    showAsCatalogueBreadcrumb: attribute?.showAsCatalogueBreadcrumb || false,
    showInSnippet: attribute?.showInSnippet || false,
    showInCard: attribute?.showInCard || false,
    showInCardTitle: attribute?.showInCardTitle || false,
    showInCatalogueFilter: attribute?.showInCatalogueFilter || false,
    showInCatalogueNav: attribute?.showInCatalogueNav || false,
    showInCatalogueTitle: attribute?.showInCatalogueTitle || false,
    showInSnippetTitle: attribute?.showInSnippetTitle || false,
    showNameInCardTitle: attribute?.showNameInCardTitle || false,
    showAsLinkInFilter: attribute?.showAsLinkInFilter || false,
    showAsAccordionInFilter: attribute?.showAsAccordionInFilter || false,
  };

  return (
    <ModalFrame>
      <ModalTitle>{attribute ? 'Редактирование атрибута' : 'Создание атрибута'}</ModalTitle>

      <Formik<AddAttributeToGroupModalValuesType>
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={(values) => {
          confirm(values);
        }}
      >
        {({ values }) => {
          const { variant } = values;
          return (
            <Form>
              <FormikTranslationsInput
                label={'Название'}
                name={'nameI18n'}
                testId={'nameI18n'}
                showInlineError
                isRequired
              />

              <FormikSelect
                isRequired
                firstOption
                label={'Тип отображения атрибута'}
                name={'viewVariant'}
                options={attributeViewVariantOptions || []}
                testId={'attribute-viewVariant'}
                showInlineError
              />

              <FormikSelect
                isRequired
                firstOption
                label={'Тип атрибута'}
                name={'variant'}
                options={attributeVariantOptions || []}
                testId={'attribute-variant'}
                showInlineError
              />

              <FormikSelect
                firstOption
                label={'Единица измерения'}
                name={'metricId'}
                options={metrics}
                testId={'attribute-metrics'}
              />

              <FormikSelect
                isRequired={
                  // @ts-ignore
                  variant === ATTRIBUTE_VARIANT_SELECT ||
                  // @ts-ignore
                  variant === ATTRIBUTE_VARIANT_MULTIPLE_SELECT
                }
                disabled={
                  // @ts-ignore
                  variant !== ATTRIBUTE_VARIANT_SELECT &&
                  // @ts-ignore
                  variant !== ATTRIBUTE_VARIANT_MULTIPLE_SELECT
                }
                firstOption
                label={'Группа опций'}
                name={'optionsGroupId'}
                options={optionGroups}
                testId={'attribute-options'}
                showInlineError
              />

              <FormikTranslationsSelect
                disabled={
                  // @ts-ignore
                  variant !== ATTRIBUTE_VARIANT_SELECT &&
                  // @ts-ignore
                  variant !== ATTRIBUTE_VARIANT_MULTIPLE_SELECT
                }
                name={'positioningInTitle'}
                testId={'positioningInTitle'}
                options={attributePositioningOptions}
                label={'Позиционирование в заголовке каталога'}
                showInlineError
              />

              <FormikTranslationsSelect
                disabled={
                  // @ts-ignore
                  variant !== ATTRIBUTE_VARIANT_SELECT &&
                  // @ts-ignore
                  variant !== ATTRIBUTE_VARIANT_MULTIPLE_SELECT
                }
                name={'positioningInCardTitle'}
                testId={'positioningInCardTitle'}
                options={attributePositioningOptions}
                label={'Позиционирование в заголовке товара'}
                showInlineError
              />

              <FormikCheckboxLine label={'С заглавной буквы в заголовке'} name={'capitalise'} />

              <FormikCheckboxLine
                label={'Показывать в заголовке каталога'}
                name={'showInCatalogueTitle'}
              />

              <FormikCheckboxLine
                label={'Показывать в заголовке карточки товара'}
                name={'showInCardTitle'}
              />

              <FormikCheckboxLine
                label={'Показывать в заголовке сниппета товара'}
                name={'showInSnippetTitle'}
              />

              <FormikCheckboxLine
                label={'Показывать название атрибута в заголовке товара'}
                name={'showNameInCardTitle'}
              />

              <FormikCheckboxLine
                label={'Показывать название атрибута в заголовке каталога'}
                name={'showNameInTitle'}
              />

              <FormikCheckboxLine
                label={'Показывать название атрибута в заголовке сниппета товара'}
                name={'showNameInSnippetTitle'}
              />

              <FormikCheckboxLine
                label={'Показывать в фильтре каталога'}
                name={'showInCatalogueFilter'}
              />

              <FormikCheckboxLine
                label={'Показывать название атрибута в выбраных фильтрах каталога'}
                name={'showNameInSelectedAttributes'}
              />

              <FormikCheckboxLine
                label={'Показывать в навигации сайта'}
                name={'showInCatalogueNav'}
              />

              <FormikCheckboxLine
                label={'Показывать опции атрибута в виде ссылки в фильтре'}
                name={'showAsLinkInFilter'}
              />

              <FormikCheckboxLine
                label={'Показывать атрибут в виде аккордеона в фильтре'}
                name={'showAsAccordionInFilter'}
              />

              <FormikCheckboxLine label={'Показывать в карточке товара'} name={'showInCard'} />

              <FormikCheckboxLine label={'Показывать в сниппете товара'} name={'showInSnippet'} />

              <FormikCheckboxLine
                label={'Показывать в крошках карточки товара'}
                name={'showAsBreadcrumb'}
              />

              <FormikCheckboxLine
                label={'Показывать в крошках каталога'}
                name={'showAsCatalogueBreadcrumb'}
              />

              <FormikCheckboxLine
                label={'Не показывать опции атрибута сгруппированными по алфавиту'}
                name={'notShowAsAlphabet'}
              />

              <ModalButtons>
                <WpButton type={'submit'} testId={'attribute-submit'}>
                  {attribute ? 'Сохранить' : 'Создать'}
                </WpButton>

                <WpButton theme={'secondary'} onClick={hideModal} testId={'attribute-decline'}>
                  Отмена
                </WpButton>
              </ModalButtons>
            </Form>
          );
        }}
      </Formik>
    </ModalFrame>
  );
};

export default AttributeInGroupModal;
