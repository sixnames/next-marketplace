import * as React from 'react';
import { Formik, Form } from 'formik';
import { LanguageModel } from '../../db/dbModels';
import {
  CreateLanguageInput,
  UpdateLanguageInput,
  useGetIsoLanguagesListQuery,
} from '../../generated/apolloComponents';
import useValidationSchema from '../../hooks/useValidationSchema';
import { languageInModalSchema } from '../../validation/languageSchema';
import WpButton from '../button/WpButton';
import FormikInput from '../FormElements/Input/FormikInput';
import FormikSelect from '../FormElements/Select/FormikSelect';
import RequestError from '../RequestError';
import Spinner from '../Spinner';
import ModalButtons from './ModalButtons';
import ModalFrame from './ModalFrame';
import ModalTitle from './ModalTitle';

export type UpdateLanguageModalInput = Omit<UpdateLanguageInput, 'languageId'>;

export interface LanguageModalInterface {
  confirm: (values: CreateLanguageInput | UpdateLanguageModalInput) => void;
  language?: LanguageModel;
  testId: string;
}

const LanguageModal: React.FC<LanguageModalInterface> = ({ confirm, testId, language }) => {
  const { data, loading, error } = useGetIsoLanguagesListQuery();
  const validationSchema = useValidationSchema({
    schema: languageInModalSchema,
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

  const { getISOLanguagesOptions } = data!;

  const initialValues = {
    name: language?.name || '',
    slug: language?.slug || '',
    nativeName: language?.nativeName || '',
  };

  return (
    <ModalFrame testId={testId}>
      <ModalTitle>{language ? 'Редактирование ' : 'Создание '} языка</ModalTitle>

      <Formik
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={(values) => {
          return confirm(values);
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
              <FormikInput
                label={'Оригинальное название'}
                name={'nativeName'}
                testId={'language-nativeName'}
                showInlineError
                isRequired
              />

              <FormikSelect
                label={'Ключ языка'}
                options={getISOLanguagesOptions}
                name={'slug'}
                firstOption
                testId={'language-slug'}
                showInlineError
                isRequired
              />

              <ModalButtons>
                <WpButton testId={'language-submit'} type={'submit'}>
                  {language ? 'Редактировать ' : 'Создать '}
                </WpButton>
              </ModalButtons>
            </Form>
          );
        }}
      </Formik>
    </ModalFrame>
  );
};

export default LanguageModal;
