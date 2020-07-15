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
  OptionVariantInput,
} from '../../../generated/apolloComponents';
import { DEFAULT_LANG, GENDER_ENUMS, GENDER_HE, GENDER_SHE } from '../../../config';
import InputLine from '../../FormElements/Input/InputLine';

interface OptionInGroupModalInterface {
  confirm: (values: Omit<AddOptionToGroupInput, 'groupId'>) => void;
  oldName?: string;
  color?: string;
  variants?: OptionVariantInput[];
  gender: GenderEnum;
}

const OptionInGroupModal: React.FC<OptionInGroupModalInterface> = ({
  confirm,
  oldName = '',
  color = '',
  variants,
  gender,
}) => {
  const { hideModal } = useAppContext();

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

  return (
    <ModalFrame>
      <ModalTitle>{oldName ? 'Редактирование опции' : 'Создание опции'}</ModalTitle>

      <Formik
        validationSchema={optionInGroupSchema}
        initialValues={{
          name: [
            {
              key: 'ru',
              value: oldName,
            },
          ],
          color,
          variants: variants || variantsTemplate,
          gender,
        }}
        onSubmit={(values) => {
          confirm(values);
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
                  {oldName ? 'Сохранить' : 'Создать'}
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
