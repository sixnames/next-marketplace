import * as React from 'react';
import { Formik, Form } from 'formik';
import { LanguageModel } from '../../db/dbModels';
import { CreateLanguageInput, UpdateLanguageInput } from '../../generated/apolloComponents';
import { useConstantOptions } from '../../hooks/useConstantOptions';
import useValidationSchema from '../../hooks/useValidationSchema';
import { languageInModalSchema } from '../../validation/languageSchema';
import WpButton from '../button/WpButton';
import FormikInput from '../FormElements/Input/FormikInput';
import FormikSelect from '../FormElements/Select/FormikSelect';
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
  const { localeOptions } = useConstantOptions();
  const validationSchema = useValidationSchema({
    schema: languageInModalSchema,
  });

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
                options={localeOptions}
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
