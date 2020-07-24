import React from 'react';
import ModalFrame from '../ModalFrame';
import ModalTitle from '../ModalTitle';
import ModalButtons from '../ModalButtons';
import Button from '../../Buttons/Button';
import {
  CreateLanguageInput,
  Language,
  UpdateLanguageInput,
  useGetIsoLanguagesListQuery,
} from '../../../generated/apolloComponents';
import RequestError from '../../RequestError/RequestError';
import Spinner from '../../Spinner/Spinner';
import { Formik, Form } from 'formik';
import FormikSelect from '../../FormElements/Select/FormikSelect';
import { languageSchema } from '../../../validation';
import FormikInput from '../../FormElements/Input/FormikInput';

export type UpdateLanguageModalInput = Omit<UpdateLanguageInput, 'id'>;

export interface LanguageModalInterface {
  confirm: (values: CreateLanguageInput | UpdateLanguageModalInput) => void;
  language?: Language;
  testId: string;
}

const LanguageModal: React.FC<LanguageModalInterface> = ({ confirm, testId, language }) => {
  const { data, loading, error } = useGetIsoLanguagesListQuery();

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

  const { getISOLanguagesList } = data!;

  const initialValues = language
    ? {
        name: language.name,
        key: language.key,
      }
    : {
        name: '',
        key: '',
      };

  return (
    <ModalFrame testId={testId}>
      <ModalTitle>{language ? 'Редактирование ' : 'Создание '} языка</ModalTitle>

      <Formik
        validationSchema={languageSchema}
        initialValues={initialValues}
        onSubmit={(values) => {
          const languageTemplate = getISOLanguagesList.find(({ id }) => id === values.key);
          return confirm({
            ...values,
            nativeName: languageTemplate ? languageTemplate.nativeName : '',
          });
        }}
      >
        {() => {
          return (
            <Form>
              <FormikInput
                label={'Название на русском'}
                name={'name'}
                testId={'language-name'}
                showInlineError
                isRequired
              />

              <FormikSelect
                label={'Ключ языка'}
                options={getISOLanguagesList}
                name={'key'}
                firstOption={'На назначено'}
                testId={'language-key'}
                showInlineError
                isRequired
              />

              <ModalButtons>
                <Button testId={'language-submit'} type={'submit'}>
                  {language ? 'Редактировать ' : 'Создать '}
                </Button>
              </ModalButtons>
            </Form>
          );
        }}
      </Formik>
    </ModalFrame>
  );
};

export default LanguageModal;
