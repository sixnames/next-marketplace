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
  AttributeVariantEnum,
  useGetNewAttributeOptionsQuery,
} from '../../../generated/apolloComponents';
import RequestError from '../../RequestError/RequestError';
import { useAppContext } from '../../../context/appContext';
import { attributeInGroupSchema } from '../../../validation';
import { ATTRIBUTE_TYPE_MULTIPLE_SELECT, ATTRIBUTE_TYPE_SELECT, ATTRIBUTE_TYPE_STRING, ATTRIBUTE_TYPE_NUMBER } from '../../../config';

interface AddAttributeToGroupModalInterface {
  attribute?: Attribute;
  confirm: (values: Omit<AddAttributeToGroupInput, 'groupId'>) => void;
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

  const { getAllMetrics, getAllOptionsGroups, getAttributeVariants } = data;

  const initialValues = attribute
    ? {
        name: [
          {
            key: 'ru',
            value: attribute.nameString,
          },
        ],
        variant: attribute.variant,
        metric: attribute.metric ? attribute.metric.id : null,
        options: attribute.options ? attribute.options.id : null,
      }
    : {
        name: [
          {
            key: 'ru',
            value: '',
          },
        ],
        variant: '' as AttributeVariantEnum,
        metric: null,
        options: null,
      };

  return (
    <ModalFrame>
      <ModalTitle>{attribute ? 'Редактирование атрибута' : 'Создание атрибута'}</ModalTitle>

      <Formik
        validationSchema={attributeInGroupSchema}
        initialValues={initialValues}
        onSubmit={(values) => confirm(values)}
      >
        {({ values }) => {
          const { variant } = values;

          return (
            <Form>
              {values.name.map((_, index) => {
                return (
                  <FormikInput
                    key={index}
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

              {(variant === ATTRIBUTE_TYPE_STRING || variant === ATTRIBUTE_TYPE_NUMBER) && (
                <FormikSelect
                  firstOption={'Не выбрано'}
                  label={'Единица измерения'}
                  name={'metric'}
                  options={getAllMetrics || []}
                  testId={'attribute-metrics'}
                />
              )}

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
