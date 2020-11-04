import React from 'react';
import ModalFrame from '../ModalFrame';
import ModalTitle from '../ModalTitle';
import ModalButtons from '../ModalButtons';
import { Form, Formik } from 'formik';
import FormikSelect from '../../FormElements/Select/FormikSelect';
import Spinner from '../../Spinner/Spinner';
import Button from '../../Buttons/Button';
import {
  AddAttributeToGroupInput,
  AttributeInGroupFragment,
  AttributeVariantEnum,
  UpdateAttributeInGroupInput,
  useGetNewAttributeOptionsQuery,
} from '../../../generated/apolloComponents';
import RequestError from '../../RequestError/RequestError';
import { useAppContext } from '../../../context/appContext';
import { attributeInGroupSchema } from '@yagu/validation';
import { ATTRIBUTE_VARIANT_MULTIPLE_SELECT, ATTRIBUTE_VARIANT_SELECT } from '@yagu/config';
import { useLanguageContext } from '../../../context/languageContext';
import FormikTranslationsInput from '../../FormElements/Input/FormikTranslationsInput';
import FormikTranslationsSelect from '../../FormElements/Select/FormikTranslationsSelect';
import useValidationSchema from '../../../hooks/useValidationSchema';

export interface AddAttributeToGroupModalInterface {
  attribute?: AttributeInGroupFragment;
  confirm: (
    values:
      | Omit<AddAttributeToGroupInput, 'groupId'>
      | Omit<UpdateAttributeInGroupInput, 'groupId' | 'attributeId'>,
  ) => void;
}

const AttributeInGroupModal: React.FC<AddAttributeToGroupModalInterface> = ({
  confirm,
  attribute,
}) => {
  const {
    getLanguageFieldInitialValue,
    getLanguageFieldInputValue,
    getAttributePositionInTitleInitialValue,
    getAttributePositionInTitleInputValue,
  } = useLanguageContext();
  const validationSchema = useValidationSchema({
    schema: attributeInGroupSchema,
  });
  const { hideModal } = useAppContext();
  const { data, loading, error } = useGetNewAttributeOptionsQuery();

  if (loading) return <Spinner />;

  if (error || !data) {
    return (
      <ModalFrame>
        <RequestError />
      </ModalFrame>
    );
  }

  const {
    getAllMetrics,
    getAllOptionsGroups,
    getAttributeVariants,
    getAttributePositioningOptions,
  } = data;

  const initialValues = attribute
    ? {
        name: getLanguageFieldInitialValue(attribute.name),
        variant: attribute.variant,
        metric: attribute.metric ? attribute.metric.id : null,
        options: attribute.options ? attribute.options.id : null,
        positioningInTitle: attribute.positioningInTitle
          ? getAttributePositionInTitleInitialValue(attribute.positioningInTitle)
          : getAttributePositionInTitleInitialValue(),
      }
    : {
        name: getLanguageFieldInitialValue(),
        variant: '' as AttributeVariantEnum,
        metric: null,
        options: null,
        positioningInTitle: getAttributePositionInTitleInitialValue(),
      };

  return (
    <ModalFrame>
      <ModalTitle>{attribute ? 'Редактирование атрибута' : 'Создание атрибута'}</ModalTitle>

      <Formik
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={(values) => {
          confirm({
            ...values,
            name: getLanguageFieldInputValue(values.name),
            positioningInTitle: getAttributePositionInTitleInputValue(values.positioningInTitle),
          });
        }}
      >
        {({ values }) => {
          const { variant } = values;

          return (
            <Form>
              <FormikTranslationsInput
                label={'Название'}
                name={'name'}
                testId={'name'}
                showInlineError
                isRequired
              />

              <FormikSelect
                isRequired
                firstOption={'Не выбрано'}
                label={'Тип атрибута'}
                name={'variant'}
                options={getAttributeVariants || []}
                testId={'attribute-variant'}
                showInlineError
              />

              <FormikSelect
                firstOption={'Не выбрано'}
                label={'Единица измерения'}
                name={'metric'}
                options={getAllMetrics || []}
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
                firstOption={'Не выбрано'}
                label={'Группа опций'}
                name={'options'}
                options={getAllOptionsGroups}
                testId={'attribute-options'}
                showInlineError
              />

              <FormikTranslationsSelect
                disabled={variant !== ATTRIBUTE_VARIANT_SELECT}
                isRequired={variant === ATTRIBUTE_VARIANT_SELECT}
                name={'positioningInTitle'}
                testId={'positioningInTitle'}
                options={getAttributePositioningOptions}
                label={'Позиционирование в заголовке'}
                showInlineError
                firstOption={'Не выбрано'}
              />

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
