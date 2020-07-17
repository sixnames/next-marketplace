import React from 'react';
import ModalFrame from '../ModalFrame';
import ModalTitle from '../ModalTitle';
import ModalButtons from '../ModalButtons';
import FormikInput from '../../FormElements/Input/FormikInput';
import { Form, Formik } from 'formik';
import Button from '../../Buttons/Button';
import { useAppContext } from '../../../context/appContext';
import { optionInGroupSchema } from '../../../validation';
import {
  AddOptionToGroupInput,
  GenderEnum,
  useGetGenderOptionsQuery,
  UpdateOptionInGroupInput,
} from '../../../generated/apolloComponents';
import { DEFAULT_LANG, GENDER_ENUMS, GENDER_HE, GENDER_SHE } from '../../../config';
import InputLine from '../../FormElements/Input/InputLine';
import RequestError from '../../RequestError/RequestError';
import Spinner from '../../Spinner/Spinner';
import FormikSelect from '../../FormElements/Select/FormikSelect';
import { OptionInGroupType } from '../../../routes/OptionsGroups/OptionsGroupsContent';

export interface OptionInGroupModalInterface {
  confirm: (
    values:
      | Omit<AddOptionToGroupInput, 'groupId'>
      | Omit<UpdateOptionInGroupInput, 'groupId' | 'optionId'>,
  ) => void;
  option?: OptionInGroupType;
}

const OptionInGroupModal: React.FC<OptionInGroupModalInterface> = ({ confirm, option }) => {
  const { data, loading, error } = useGetGenderOptionsQuery();
  const { hideModal } = useAppContext();

  if (error || (!loading && !data)) {
    return (
      <ModalFrame>
        <RequestError />
      </ModalFrame>
    );
  }

  if (loading) {
    return <Spinner isTransparent />;
  }

  const { getGenderOptions } = data!;

  const variantsTemplate = GENDER_ENUMS.map((gender) => {
    return {
      key: gender as GenderEnum,
      value: [{ key: DEFAULT_LANG, value: '' }],
    };
  });

  function getGenderTranslation(gender: string) {
    if (gender === GENDER_HE) {
      return 'Мужской род';
    }
    if (gender === GENDER_SHE) {
      return 'Женский род';
    }
    return 'Средний род';
  }

  const initialValues = option
    ? {
        name: option.name.map(({ key, value }) => ({
          key,
          value,
        })),
        color: option.color,
        variants: option.variants
          ? option.variants.map(({ key, value }) => {
              return {
                key,
                value: value.map(({ key, value }) => ({
                  key,
                  value,
                })),
              };
            })
          : [],
        gender: option.gender,
      }
    : {
        name: [
          {
            key: DEFAULT_LANG,
            value: '',
          },
        ],
        color: '',
        variants: variantsTemplate,
        gender: null,
      };

  return (
    <ModalFrame>
      <ModalTitle>{option ? 'Редактирование опции' : 'Создание опции'}</ModalTitle>

      <Formik
        validationSchema={optionInGroupSchema}
        initialValues={initialValues}
        onSubmit={(values) => {
          confirm({
            ...values,
            color: values.color ? values.color : null,
          });
        }}
      >
        {({ values }) => {
          return (
            <Form>
              {values.name.map((_, index) => {
                return (
                  <FormikInput
                    key={index}
                    name={`name[${index}].value`}
                    testId={'option-name'}
                    showInlineError
                    label={'Название'}
                  />
                );
              })}

              <FormikSelect
                name={'gender'}
                firstOption={'Не выбрано'}
                options={getGenderOptions}
                testId={`option-gender`}
                label={'Род названия'}
              />

              <FormikInput
                label={'Цвет'}
                name={'color'}
                testId={'option-color'}
                prefix={'hash'}
                showInlineError
              />

              <InputLine name={'variants'} label={'Склонение названия по родам'} labelTag={'div'}>
                {values.variants.map(({ key, value }, variantIndex) => {
                  return value.map((_, langIndex) => {
                    return (
                      <FormikInput
                        key={`${key}-${langIndex}`}
                        label={getGenderTranslation(key)}
                        name={`variants[${variantIndex}].value[${langIndex}].value`}
                        testId={`option-${key}`}
                        showInlineError
                      />
                    );
                  });
                })}
              </InputLine>

              <ModalButtons>
                <Button type={'submit'} testId={'option-submit'}>
                  {option ? 'Сохранить' : 'Создать'}
                </Button>

                <Button theme={'secondary'} onClick={hideModal} testId={'option-decline'}>
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

export default OptionInGroupModal;
