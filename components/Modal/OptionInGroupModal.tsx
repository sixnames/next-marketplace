import { OptionVariantsModel } from 'db/dbModels';
import { OptionInterface } from 'db/uiInterfaces';
import * as React from 'react';
import ModalFrame from 'components/Modal/ModalFrame';
import ModalTitle from 'components/Modal/ModalTitle';
import ModalButtons from 'components/Modal/ModalButtons';
import FormikInput from 'components/FormElements/Input/FormikInput';
import { Form, Formik } from 'formik';
import Button from 'components/Button';
import { useAppContext } from 'context/appContext';
import {
  AddOptionToGroupInput,
  useGetGenderOptionsQuery,
  UpdateOptionInGroupInput,
  OptionsGroupVariant,
  Gender,
} from 'generated/apolloComponents';
import InputLine from 'components/FormElements/Input/InputLine';
import RequestError from 'components/RequestError';
import Spinner from 'components/Spinner';
import FormikSelect from 'components/FormElements/Select/FormikSelect';
import FormikTranslationsInput from 'components/FormElements/Input/FormikTranslationsInput';
import useValidationSchema from 'hooks/useValidationSchema';
import FormikIconSelect from 'components/FormElements/FormikIconSelect';
import { optionInGroupModalSchema } from 'validation/optionsGroupSchema';
import {
  GENDER_ENUMS,
  OPTIONS_GROUP_VARIANT_COLOR,
  OPTIONS_GROUP_VARIANT_ICON,
} from 'config/common';
import { getConstantTranslation } from 'config/constantTranslations';
import { useLocaleContext } from 'context/localeContext';

type OptionInGroupModalValuesType =
  | Omit<AddOptionToGroupInput, 'optionsGroupId'>
  | Omit<UpdateOptionInGroupInput, 'optionsGroupId' | 'optionId'>;

export interface OptionInGroupModalInterface {
  confirm: (values: OptionInGroupModalValuesType) => void;
  option?: OptionInterface;
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
    color: option?.color || '#000000',
    icon: option?.icon || null,
    gender: option?.gender ? (`${option?.gender}` as Gender) : null,
    variants: GENDER_ENUMS.reduce((acc: OptionVariantsModel, gender) => {
      const currentOptionVariant = option?.variants[gender];
      if (currentOptionVariant) {
        acc[gender] = currentOptionVariant;
        return acc;
      }

      acc[gender] = {};
      return acc;
    }, {}),
  };

  return (
    <ModalFrame testId={'option-in-group-modal'}>
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
              />

              <FormikInput
                label={'Цвет'}
                name={'color'}
                testId={'option-color'}
                type={'color'}
                disabled={groupVariant !== OPTIONS_GROUP_VARIANT_COLOR}
                isRequired={groupVariant === OPTIONS_GROUP_VARIANT_COLOR}
                showInlineError
              />

              <FormikIconSelect
                label={'Иконка'}
                name={'icon'}
                testId={'option-icon'}
                firstOption={'Не назначена'}
                disabled={groupVariant !== OPTIONS_GROUP_VARIANT_ICON}
                isRequired={groupVariant === OPTIONS_GROUP_VARIANT_ICON}
                showInlineError
              />

              <InputLine name={'variants'} label={'Склонение названия по родам'} labelTag={'div'}>
                {Object.keys(values.variants).map((gender) => {
                  return (
                    <FormikTranslationsInput
                      key={gender}
                      name={`variants.${gender}`}
                      label={getConstantTranslation(`selectsOptions.gender.${gender}.${locale}`)}
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
