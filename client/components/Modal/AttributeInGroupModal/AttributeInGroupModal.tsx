import React from 'react';
import ModalFrame from '../ModalFrame';
import ModalTitle from '../ModalTitle';
import ModalButtons from '../ModalButtons';
import FormikInput from '../../FormElements/Input/FormikInput';
import { Form, Formik } from 'formik';
import FormikSelect from '../../FormElements/Select/FormikSelect';
import Spinner from '../../Spinner/Spinner';
import Button from '../../Buttons/Button';
import {
  AddAttributeToGroupInput,
  Attribute,
  AttributePositionInTitleEnum,
  AttributeVariantEnum,
  UpdateAttributeInGroupInput,
  useGetNewAttributeOptionsQuery,
} from '../../../generated/apolloComponents';
import RequestError from '../../RequestError/RequestError';
import { useAppContext } from '../../../context/appContext';
import { attributeInGroupSchema } from '../../../validation';
import {
  ATTRIBUTE_TYPE_MULTIPLE_SELECT,
  ATTRIBUTE_TYPE_SELECT,
  DEFAULT_LANG,
} from '../../../config';

export interface AddAttributeToGroupModalInterface {
  attribute?: Attribute;
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
        name: attribute.name.map(({ key, value }) => ({
          key,
          value,
        })),
        variant: attribute.variant,
        metric: attribute.metric ? attribute.metric.id : null,
        options: attribute.options ? attribute.options.id : null,
        positioningInTitle: attribute.positioningInTitle
          ? attribute.positioningInTitle.map(({ key, value }) => ({
              key,
              value,
            }))
          : [
              {
                key: DEFAULT_LANG,
                value: '' as AttributePositionInTitleEnum,
              },
            ],
      }
    : {
        name: [
          {
            key: DEFAULT_LANG,
            value: '',
          },
        ],
        variant: '' as AttributeVariantEnum,
        metric: null,
        options: null,
        positioningInTitle: [
          {
            key: DEFAULT_LANG,
            value: '' as AttributePositionInTitleEnum,
          },
        ],
      };

  return (
    <ModalFrame>
      <ModalTitle>{attribute ? 'Редактирование атрибута' : 'Создание атрибута'}</ModalTitle>

      <Formik
        validationSchema={attributeInGroupSchema}
        initialValues={initialValues}
        onSubmit={(values) => {
          const positioningInTitle =
            values.variant === ATTRIBUTE_TYPE_SELECT ||
            values.variant === ATTRIBUTE_TYPE_MULTIPLE_SELECT
              ? values.positioningInTitle
              : null;

          confirm({
            ...values,
            positioningInTitle,
          });
        }}
      >
        {({ values }) => {
          const { variant, positioningInTitle } = values;

          return (
            <Form>
              {values.name.map(({ key }, index) => {
                return (
                  <FormikInput
                    key={key}
                    isRequired
                    label={'Название'}
                    name={`name[${index}].value`}
                    testId={'attribute-name'}
                    showInlineError
                  />
                );
              })}

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

              {(variant === ATTRIBUTE_TYPE_SELECT ||
                variant === ATTRIBUTE_TYPE_MULTIPLE_SELECT) && (
                <FormikSelect
                  isRequired
                  firstOption={'Не выбрано'}
                  label={'Группа опций'}
                  name={'options'}
                  options={getAllOptionsGroups}
                  testId={'attribute-options'}
                  showInlineError
                />
              )}

              {(variant === ATTRIBUTE_TYPE_SELECT || variant === ATTRIBUTE_TYPE_MULTIPLE_SELECT) &&
                positioningInTitle.map(({ key }, index) => {
                  return (
                    <FormikSelect
                      key={key}
                      isRequired
                      showInlineError
                      firstOption={'Не выбрано'}
                      label={'Позиционирование в заголовке'}
                      name={`positioningInTitle[${index}].value`}
                      options={getAttributePositioningOptions}
                      testId={'attribute-position'}
                    />
                  );
                })}

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
