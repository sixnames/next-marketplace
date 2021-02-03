import * as React from 'react';
import ModalFrame from '../ModalFrame';
import ModalTitle from '../ModalTitle';
import ModalButtons from '../ModalButtons';
import FormikInput from '../../FormElements/Input/FormikInput';
import { Form, Formik } from 'formik';
import Button from '../../Buttons/Button';
import { useAppContext } from 'context/appContext';
import {
  AddOptionToGroupInput,
  Gender,
  useGetGenderOptionsQuery,
  UpdateOptionInGroupInput,
  OptionInGroupFragment,
  OptionsGroupVariant,
} from 'generated/apolloComponents';
import InputLine from '../../FormElements/Input/InputLine';
import RequestError from '../../RequestError/RequestError';
import Spinner from '../../Spinner/Spinner';
import FormikSelect from '../../FormElements/Select/FormikSelect';
import FormikTranslationsInput from '../../FormElements/Input/FormikTranslationsInput';
import useValidationSchema from '../../../hooks/useValidationSchema';
import FormikIconSelect from '../../FormElements/IconSelect/FormikIconSelect';
import { optionInGroupModalSchema } from 'validation/optionsGroupSchema';
import {
  GENDER_ENUMS,
  OPTIONS_GROUP_VARIANT_COLOR,
  OPTIONS_GROUP_VARIANT_ICON,
} from 'config/common';
import { getFieldTranslation } from 'config/constantTranslations';
import { useLocaleContext } from 'context/localeContext';

type OptionInGroupModalValuesType =
  | Omit<AddOptionToGroupInput, 'optionsGroupId'>
  | Omit<UpdateOptionInGroupInput, 'optionsGroupId' | 'optionId'>;

export interface OptionInGroupModalInterface {
  confirm: (values: OptionInGroupModalValuesType) => void;
  option?: OptionInGroupFragment;
  groupVariant: OptionsGroupVariant;
}

const OptionInGroupModal: React.FC<OptionInGroupModalInterface> = ({
  confirm,
  option,
  groupVariant,
}) => {
  const { locale } = useLocaleContext();
  const { data, loading, error } = useGetGenderOptionsQuery();
  const { hideModal } = useAppContext();
  const validationSchema = useValidationSchema({
    schema: optionInGroupModalSchema,
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

  const initialValues: OptionInGroupModalValuesType = {
    nameI18n: option?.nameI18n || {},
    color: option?.color || null,
    icon: option?.icon || null,
    gender: option?.gender || null,
    variants: GENDER_ENUMS.map((gender) => {
      const currentOptionVariant = option?.variants?.find((variant) => {
        return variant.gender === gender;
      });
      if (currentOptionVariant) {
        return {
          gender: currentOptionVariant.gender,
          value: currentOptionVariant.value,
        };
      }
      return {
        gender: gender as Gender,
        value: {},
      };
    }),
  };

  return (
    <ModalFrame>
      <ModalTitle>{option ? 'Редактирование опции' : 'Создание опции'}</ModalTitle>

      <Formik<OptionInGroupModalValuesType>
        validationSchema={validationSchema}
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
              <FormikTranslationsInput
                name={'nameI18n'}
                testId={'nameI18n'}
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
                showInlineError
                isRequired
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
                {values.variants.map(({ gender }, variantIndex) => {
                  return (
                    <FormikTranslationsInput
                      key={gender}
                      name={`variants[${variantIndex}].value`}
                      label={getFieldTranslation(`selectsOptions.gender.${gender}.${locale}`)}
                      testId={`variant-${gender}`}
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