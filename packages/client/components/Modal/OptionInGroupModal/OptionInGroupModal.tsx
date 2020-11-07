import React from 'react';
import ModalFrame from '../ModalFrame';
import ModalTitle from '../ModalTitle';
import ModalButtons from '../ModalButtons';
import FormikInput from '../../FormElements/Input/FormikInput';
import { Form, Formik } from 'formik';
import Button from '../../Buttons/Button';
import { useAppContext } from '../../../context/appContext';
import { optionInGroupSchema } from '@yagu/validation';
import {
  AddOptionToGroupInput,
  GenderEnum,
  useGetGenderOptionsQuery,
  UpdateOptionInGroupInput,
  OptionInGroupFragment,
  OptionsGroupVariantEnum,
} from '../../../generated/apolloComponents';
import {
  GENDER_ENUMS,
  GENDER_HE,
  GENDER_SHE,
  OPTIONS_GROUP_VARIANT_COLOR,
  OPTIONS_GROUP_VARIANT_ICON,
} from '@yagu/config';
import InputLine from '../../FormElements/Input/InputLine';
import RequestError from '../../RequestError/RequestError';
import Spinner from '../../Spinner/Spinner';
import FormikSelect from '../../FormElements/Select/FormikSelect';
import { useLanguageContext } from '../../../context/languageContext';
import FormikTranslationsInput from '../../FormElements/Input/FormikTranslationsInput';
import useValidationSchema from '../../../hooks/useValidationSchema';
import FormikIconSelect from '../../FormElements/IconSelect/FormikIconSelect';

export interface OptionInGroupModalInterface {
  confirm: (
    values:
      | Omit<AddOptionToGroupInput, 'groupId'>
      | Omit<UpdateOptionInGroupInput, 'groupId' | 'optionId'>,
  ) => void;
  option?: OptionInGroupFragment;
  groupVariant: OptionsGroupVariantEnum;
}

const OptionInGroupModal: React.FC<OptionInGroupModalInterface> = ({
  confirm,
  option,
  groupVariant,
}) => {
  const { data, loading, error } = useGetGenderOptionsQuery();
  const { hideModal } = useAppContext();
  const { getLanguageFieldInitialValue, getLanguageFieldInputValue } = useLanguageContext();
  const validationSchema = useValidationSchema({
    schema: optionInGroupSchema,
  });

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
        name: getLanguageFieldInitialValue(option.name),
        color: option.color,
        variants: option.variants
          ? option.variants.map(({ key, value }) => {
              return {
                key,
                value: getLanguageFieldInitialValue(value),
              };
            })
          : [],
        gender: option.gender,
      }
    : {
        name: getLanguageFieldInitialValue(),
        color: '',
        variants: GENDER_ENUMS.map((gender) => {
          return {
            key: gender as GenderEnum,
            value: getLanguageFieldInitialValue(),
          };
        }),
        gender: null,
      };

  return (
    <ModalFrame>
      <ModalTitle>{option ? 'Редактирование опции' : 'Создание опции'}</ModalTitle>

      <Formik
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={(values) => {
          confirm({
            ...values,
            name: getLanguageFieldInputValue(values.name),
            variants: values.variants.map((variant) => ({
              key: variant.key,
              value: getLanguageFieldInputValue(variant.value),
            })),
            color: values.color ? values.color : null,
          });
        }}
      >
        {({ values }) => {
          return (
            <Form>
              <FormikTranslationsInput
                name={'name'}
                testId={'name'}
                showInlineError
                label={'Название'}
                isRequired
              />

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
                disabled={groupVariant !== OPTIONS_GROUP_VARIANT_COLOR}
                isRequired={groupVariant === OPTIONS_GROUP_VARIANT_COLOR}
                showInlineError
              />

              <FormikIconSelect
                label={'Иконка'}
                name={'icon'}
                testId={'option-icon'}
                disabled={groupVariant !== OPTIONS_GROUP_VARIANT_ICON}
                isRequired={groupVariant === OPTIONS_GROUP_VARIANT_ICON}
                showInlineError
              />

              <InputLine name={'variants'} label={'Склонение названия по родам'} labelTag={'div'}>
                {values.variants.map(({ key }, variantIndex) => {
                  return (
                    <FormikTranslationsInput
                      key={key}
                      name={`variants[${variantIndex}].value`}
                      label={getGenderTranslation(key)}
                      testId={`variant-${key}`}
                      showInlineError
                    />
                  );
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
