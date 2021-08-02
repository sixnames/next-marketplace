import FormikCheckboxLine from 'components/FormElements/Checkbox/FormikCheckboxLine';
import { AttributeInterface } from 'db/uiInterfaces';
import * as React from 'react';
import ModalFrame from 'components/Modal/ModalFrame';
import ModalTitle from 'components/Modal/ModalTitle';
import ModalButtons from 'components/Modal/ModalButtons';
import { Form, Formik } from 'formik';
import FormikSelect from 'components/FormElements/Select/FormikSelect';
import Spinner from 'components/Spinner';
import Button from 'components/Button';
import {
  AddAttributeToGroupInput,
  AttributeVariant,
  AttributeViewVariant,
  UpdateAttributeInGroupInput,
  useGetNewAttributeOptionsQuery,
} from 'generated/apolloComponents';
import RequestError from 'components/RequestError';
import { useAppContext } from 'context/appContext';
import FormikTranslationsInput from 'components/FormElements/Input/FormikTranslationsInput';
import FormikTranslationsSelect from 'components/FormElements/Select/FormikTranslationsSelect';
import useValidationSchema from 'hooks/useValidationSchema';
import { attributeInGroupModalSchema } from 'validation/attributesGroupSchema';
import {
  ATTRIBUTE_POSITION_IN_TITLE_BEGIN,
  ATTRIBUTE_VARIANT_MULTIPLE_SELECT,
  ATTRIBUTE_VARIANT_SELECT,
  DEFAULT_LOCALE,
} from 'config/common';

type AddAttributeToGroupModalValuesType =
  | Omit<AddAttributeToGroupInput, 'attributesGroupId'>
  | Omit<UpdateAttributeInGroupInput, 'attributesGroupId' | 'attributeId'>;

export interface AddAttributeToGroupModalInterface {
  attribute?: AttributeInterface;
  attributesGroupId: string;
  confirm: (values: AddAttributeToGroupModalValuesType) => void;
}

const AttributeInGroupModal: React.FC<AddAttributeToGroupModalInterface> = ({
  confirm,
  attribute,
}) => {
  const validationSchema = useValidationSchema({
    schema: attributeInGroupModalSchema,
  });
  const { hideModal } = useAppContext();
  const { data, loading, error } = useGetNewAttributeOptionsQuery();

  if (loading) {
    return <Spinner />;
  }

  if (error || !data) {
    return (
      <ModalFrame>
        <RequestError />
      </ModalFrame>
    );
  }

  const {
    getAllMetricsOptions,
    getAllOptionsGroups,
    getAttributeVariantsOptions,
    getAttributePositioningOptions,
    getAttributeViewVariantsOptions,
  } = data;

  const positioningInTitle = {
    [DEFAULT_LOCALE]: ATTRIBUTE_POSITION_IN_TITLE_BEGIN,
  };

  const initialValues: AddAttributeToGroupModalValuesType = attribute
    ? {
        nameI18n: attribute.nameI18n,
        variant: `${attribute.variant}` as AttributeVariant,
        viewVariant: `${attribute.viewVariant}` as AttributeViewVariant,
        metricId: attribute.metric?._id,
        optionsGroupId: attribute.optionsGroupId,
        positioningInTitle: attribute.positioningInTitle || positioningInTitle,
        capitalise: attribute.capitalise,
        notShowAsAlphabet: attribute.notShowAsAlphabet,
        showAsBreadcrumb: attribute.showAsBreadcrumb,
        showAsCatalogueBreadcrumb: attribute.showAsCatalogueBreadcrumb || false,
        showInSnippet: attribute.showInSnippet || false,
        showInCard: attribute.showInCard,
      }
    : {
        nameI18n: {},
        variant: '' as AttributeVariant,
        viewVariant: '' as AttributeViewVariant,
        metricId: null,
        optionsGroupId: null,
        positioningInTitle,
        capitalise: false,
        notShowAsAlphabet: true,
        showAsBreadcrumb: false,
        showAsCatalogueBreadcrumb: false,
        showInSnippet: false,
        showInCard: true,
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
                options={getAttributeViewVariantsOptions || []}
                testId={'attribute-viewVariant'}
                showInlineError
              />

              <FormikSelect
                isRequired
                firstOption
                label={'Тип атрибута'}
                name={'variant'}
                options={getAttributeVariantsOptions || []}
                testId={'attribute-variant'}
                showInlineError
              />

              <FormikSelect
                firstOption
                label={'Единица измерения'}
                name={'metricId'}
                options={getAllMetricsOptions}
                testId={'attribute-metrics'}
              />

              <FormikSelect
                isRequired={
                  variant === ATTRIBUTE_VARIANT_SELECT ||
                  variant === ATTRIBUTE_VARIANT_MULTIPLE_SELECT
                }
                disabled={
                  variant !== ATTRIBUTE_VARIANT_SELECT &&
                  variant !== ATTRIBUTE_VARIANT_MULTIPLE_SELECT
                }
                firstOption
                label={'Группа опций'}
                name={'optionsGroupId'}
                options={getAllOptionsGroups}
                testId={'attribute-options'}
                showInlineError
              />

              <FormikTranslationsSelect
                disabled={
                  variant !== ATTRIBUTE_VARIANT_SELECT &&
                  variant !== ATTRIBUTE_VARIANT_MULTIPLE_SELECT
                }
                name={'positioningInTitle'}
                testId={'positioningInTitle'}
                options={getAttributePositioningOptions}
                label={'Позиционирование в заголовке'}
                showInlineError
              />

              <FormikCheckboxLine label={'С заглавной буквы в заголовке'} name={'capitalise'} />

              <FormikCheckboxLine
                label={'Не показывать опции атрибута сгруппированными по алфавиту'}
                name={'notShowAsAlphabet'}
              />

              <FormikCheckboxLine label={'Показывать в карточке товара'} name={'showInCard'} />

              <FormikCheckboxLine
                label={'Показывать в крошках карточки товара'}
                name={'showAsBreadcrumb'}
              />

              <FormikCheckboxLine
                label={'Показывать в крошках каталога'}
                name={'showAsCatalogueBreadcrumb'}
              />

              <FormikCheckboxLine label={'Показывать в сниппете товара'} name={'showInSnippet'} />

              <ModalButtons>
                <Button type={'submit'} testId={'attribute-submit'}>
                  {attribute ? 'Сохранить' : 'Создать'}
                </Button>

                <Button theme={'secondary'} onClick={hideModal} testId={'attribute-decline'}>
                  Отмена
                </Button>
              </ModalButtons>
            </Form>
          );
        }}
      </Formik>
    </ModalFrame>
  );
};

export default AttributeInGroupModal;
