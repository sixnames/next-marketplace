import { LanguageModel } from 'db/dbModels';
import * as React from 'react';
import ModalFrame from 'components/Modal/ModalFrame';
import ModalTitle from 'components/Modal/ModalTitle';
import ModalButtons from 'components/Modal/ModalButtons';
import Button from 'components/button/Button';
import {
  CreateLanguageInput,
  UpdateLanguageInput,
  useGetIsoLanguagesListQuery,
} from 'generated/apolloComponents';
import RequestError from 'components/RequestError';
import Spinner from 'components/Spinner';
import { Formik, Form } from 'formik';
import FormikSelect from 'components/FormElements/Select/FormikSelect';
import FormikInput from 'components/FormElements/Input/FormikInput';
import useValidationSchema from 'hooks/useValidationSchema';
import { languageInModalSchema } from 'validation/languageSchema';

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
