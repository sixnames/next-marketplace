import React from 'react';
import ModalFrame from '../ModalFrame';
import ModalTitle from '../ModalTitle';
import ModalText from '../ModalText';
import ModalButtons from '../ModalButtons';
import { Form, Formik, FormikValues } from 'formik';
import Button from '../../Buttons/Button';
import { useAppContext } from '../../../context/appContext';
import { langStringInputSchema } from '../../../validation';
import { LanguageType } from '../../../generated/apolloComponents';
import { useLanguageContext } from '../../../context/languageContext';
import FormikTranslationsInput from '../../FormElements/Input/FormikTranslationsInput';
import * as Yup from 'yup';

interface UpdateNameModalInterface {
  title?: string;
  message?: string;
  entityMessage?: string;
  oldName?: LanguageType[];
  buttonText?: string;
  confirm: (values: FormikValues) => void;
  testId?: string;
}

const UpdateNameModal: React.FC<UpdateNameModalInterface> = ({
  title = '',
  message = '',
  entityMessage = '',
  oldName,
  buttonText = 'Изменить',
  confirm,
  testId,
}) => {
  const { getLanguageFieldInitialValue, lang } = useLanguageContext();
  const { hideModal } = useAppContext();

  const schema = Yup.object().shape({
    name: langStringInputSchema({ defaultLang: lang, entityMessage }),
  });

  return (
    <ModalFrame testId={testId}>
      <ModalTitle>{title}</ModalTitle>

      {!!message && (
        <ModalText>
          <p>{message}</p>
        </ModalText>
      )}

      <Formik
        initialValues={{
          name: getLanguageFieldInitialValue(oldName),
        }}
        onSubmit={(values) => {
          console.log(values);
          console.log(confirm);
        }}
        // validationSchema={() => nameLangSchema(validationMessage, 1)}
        validationSchema={schema}
      >
        {() => {
          return (
            <Form>
              <FormikTranslationsInput
                label={'Введите название'}
                name={'name'}
                testId={'name'}
                showInlineError
              />

              <ModalButtons>
                <Button type={'submit'} testId={'update-name-submit'}>
                  {buttonText}
                </Button>

                <Button theme={'secondary'} onClick={hideModal} testId={'update-name-decline'}>
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

export default UpdateNameModal;
