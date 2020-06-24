import React from 'react';
import ModalFrame from '../ModalFrame';
import ModalTitle from '../ModalTitle';
import ModalButtons from '../ModalButtons';
import FormikInput from '../../FormElements/Input/FormikInput';
import { Form, Formik } from 'formik';
import Button from '../../Buttons/Button';
import { useAppContext } from '../../../context/appContext';
import { LangInterface } from '../../../types';
import { optionInGroupSchema } from '../../../validation';

interface ValuesInterface {
  name: LangInterface[];
  color?: string | null;
}

interface OptionInGroupModalInterface {
  confirm: (values: ValuesInterface) => void;
  oldName?: string;
  color?: string;
}

const OptionInGroupModal: React.FC<OptionInGroupModalInterface> = ({
  confirm,
  oldName = '',
  color = '',
}) => {
  const { hideModal } = useAppContext();

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
        }}
        onSubmit={({ name, color }) => {
          confirm({
            name,
            color: color ? color : null,
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

              <FormikInput
                label={'Цвет'}
                name={'color'}
                testId={'option-color'}
                prefix={'hash'}
                showInlineError
              />

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
