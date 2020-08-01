import React from 'react';
import ModalFrame from '../ModalFrame';
import ModalTitle from '../ModalTitle';
import ModalButtons from '../ModalButtons';
import { Form, Formik } from 'formik';
import FormikSelect from '../../FormElements/Select/FormikSelect';
import Button from '../../Buttons/Button';
import {
  CreateRubricInput,
  GenderEnum,
  GetRubricsTreeQuery,
  useGetAllRubricVariantsQuery,
} from '../../../generated/apolloComponents';
import Spinner from '../../Spinner/Spinner';
import RequestError from '../../RequestError/RequestError';
import { useAppContext } from '../../../context/appContext';
import { createRubricInputSchema } from '../../../validation';
import { RUBRIC_LEVEL_TWO } from '../../../config';
import { useLanguageContext } from '../../../context/languageContext';
import FormikTranslationsInput from '../../FormElements/Input/FormikTranslationsInput';
import useValidationSchema from '../../../hooks/useValidationSchema';

export interface CreateRubricModalInterface {
  confirm: (values: CreateRubricInput) => void;
  rubrics: GetRubricsTreeQuery['getRubricsTree'];
}

const CreateRubricModal: React.FC<CreateRubricModalInterface> = ({ confirm, rubrics }) => {
  const { hideModal } = useAppContext();
  const { getLanguageFieldInitialValue, getLanguageFieldInputValue } = useLanguageContext();
  const validationSchema = useValidationSchema({
    schema: createRubricInputSchema,
    messagesKeys: [
      'validation.rubrics.name',
      'validation.rubrics.variant',
      'validation.rubrics.defaultTitle',
      'validation.rubrics.keyword',
      'validation.rubrics.gender',
    ],
  });
  const { data, loading, error } = useGetAllRubricVariantsQuery();

  if (loading) return <Spinner />;
  if (error || !data || !data.getAllRubricVariants) {
    return (
      <ModalFrame>
        <RequestError />
      </ModalFrame>
    );
  }

  return (
    <ModalFrame testId={'create-rubric-modal'}>
      <ModalTitle>Добавление рубрики</ModalTitle>

      <Formik
        validationSchema={validationSchema}
        initialValues={{
          name: getLanguageFieldInitialValue(),
          variant: '',
          parent: null,
          subParent: null,
          catalogueTitle: {
            defaultTitle: getLanguageFieldInitialValue(),
            prefix: getLanguageFieldInitialValue(),
            keyword: getLanguageFieldInitialValue(),
            gender: '' as GenderEnum,
          },
        }}
        onSubmit={(values) => {
          const { subParent, parent, catalogueTitle, ...restValues } = values;

          confirm({
            ...restValues,
            name: getLanguageFieldInputValue(restValues.name),
            parent: subParent ? subParent : parent,
            catalogueTitle: {
              ...catalogueTitle,
              defaultTitle: getLanguageFieldInputValue(catalogueTitle.defaultTitle),
              prefix: getLanguageFieldInputValue(catalogueTitle.prefix),
              keyword: getLanguageFieldInputValue(catalogueTitle.keyword),
            },
          });
        }}
      >
        {({ values }) => {
          const { parent } = values;
          const currentParent = rubrics.find(({ id }) => id === parent);

          return (
            <Form>
              <FormikTranslationsInput
                label={'Название'}
                name={'name'}
                testId={'name'}
                showInlineError
                isRequired
              />

              <FormikTranslationsInput
                label={'Заголовок каталога'}
                name={'catalogueTitle.defaultTitle'}
                testId={'catalogueTitle-defaultTitle'}
                showInlineError
                isRequired
              />

              <FormikTranslationsInput
                label={'Префикс заголовка каталога'}
                name={'catalogueTitle.prefix'}
                testId={'catalogueTitle-prefix'}
              />

              <FormikTranslationsInput
                label={'Ключевое слово заголовка каталога'}
                name={'catalogueTitle.keyword'}
                testId={'catalogueTitle-keyword'}
                showInlineError
                isRequired
              />

              <FormikSelect
                firstOption={'Не назначено'}
                name={`catalogueTitle.gender`}
                label={'Род ключевого слова'}
                testId={'catalogueTitle-gender'}
                showInlineError
                isRequired
                options={data.getGenderOptions || []}
              />

              <FormikSelect
                isRequired
                showInlineError
                firstOption={'Не выбран'}
                label={'Тип рубрики'}
                name={'variant'}
                testId={'rubric-variant'}
                options={data?.getAllRubricVariants || []}
              />

              <FormikSelect
                firstOption={'Не выбрано'}
                label={'Родительская рубрика'}
                name={'parent'}
                testId={'parent'}
                options={rubrics}
              />

              {currentParent && currentParent.level !== RUBRIC_LEVEL_TWO && (
                <FormikSelect
                  firstOption={'Не выбрано'}
                  label={'Подрубрика'}
                  name={'subParent'}
                  options={currentParent.children}
                  testId={'subParent'}
                />
              )}

              <ModalButtons>
                <Button type={'submit'} testId={'rubric-submit'}>
                  Создать
                </Button>
                <Button theme={'secondary'} onClick={hideModal}>
                  Закрыть
                </Button>
              </ModalButtons>
            </Form>
          );
        }}
      </Formik>
    </ModalFrame>
  );
};

export default CreateRubricModal;
