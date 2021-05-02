import FormikCheckboxLine from 'components/FormElements/Checkbox/FormikCheckboxLine';
import * as React from 'react';
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
  AttributeVariant,
  AttributeViewVariant,
  UpdateAttributeInGroupInput,
  useGetNewAttributeOptionsQuery,
} from 'generated/apolloComponents';
import RequestError from '../../RequestError/RequestError';
import { useAppContext } from 'context/appContext';
import FormikTranslationsInput from '../../FormElements/Input/FormikTranslationsInput';
import FormikTranslationsSelect from '../../FormElements/Select/FormikTranslationsSelect';
import useValidationSchema from '../../../hooks/useValidationSchema';
import { attributeInGroupModalSchema } from 'validation/attributesGroupSchema';
import { ATTRIBUTE_VARIANT_MULTIPLE_SELECT, ATTRIBUTE_VARIANT_SELECT } from 'config/common';

type AddAttributeToGroupModalValuesType =
  | Omit<AddAttributeToGroupInput, 'attributesGroupId'>
  | Omit<UpdateAttributeInGroupInput, 'attributesGroupId' | 'attributeId'>;

export interface AddAttributeToGroupModalInterface {
  attribute?: AttributeInGroupFragment;
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

  const initialValues: AddAttributeToGroupModalValuesType = attribute
    ? {
        nameI18n: attribute.nameI18n,
        variant: attribute.variant,
        viewVariant: attribute.viewVariant,
        metricId: attribute.metric?._id,
        optionsGroupId: attribute.optionsGroupId,
        positioningInTitle: attribute.positioningInTitle,
        capitalise: attribute.capitalise,
        notShowAsAlphabet: attribute.notShowAsAlphabet,
      }
    : {
        nameI18n: {},
        variant: '' as AttributeVariant,
        viewVariant: '' as AttributeViewVariant,
        metricId: null,
        optionsGroupId: null,
        positioningInTitle: {},
        capitalise: false,
        notShowAsAlphabet: true,
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
                firstOption={'Не выбрано'}
                label={'Тип отображения атрибута'}
                name={'viewVariant'}
                options={getAttributeViewVariantsOptions || []}
                testId={'attribute-viewVariant'}
                showInlineError
              />

              <FormikSelect
                isRequired
                firstOption={'Не выбрано'}
                label={'Тип атрибута'}
                name={'variant'}
                options={getAttributeVariantsOptions || []}
                testId={'attribute-variant'}
                showInlineError
              />

              <FormikSelect
                firstOption={'Не выбрано'}
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
                firstOption={'Не выбрано'}
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
                firstOption={'Не выбрано'}
              />

              <FormikCheckboxLine label={'С заглавной буквы в заголовке'} name={'capitalise'} />

              <FormikCheckboxLine
                label={'Не показывать опции атрибута сгруппированными по алфавиту'}
                name={'notShowAsAlphabet'}
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
