import React from 'react';
import ModalFrame from '../ModalFrame';
import ModalTitle from '../ModalTitle';
import ModalButtons from '../ModalButtons';
import FormikInput from '../../FormElements/Input/FormikInput';
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
import { DEFAULT_LANG, RUBRIC_LEVEL_TWO } from '../../../config';

export interface CreateRubricModalInterface {
  confirm: (values: CreateRubricInput) => void;
  rubrics: GetRubricsTreeQuery['getRubricsTree'];
}

const CreateRubricModal: React.FC<CreateRubricModalInterface> = ({ confirm, rubrics }) => {
  const { hideModal } = useAppContext();
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
        validationSchema={createRubricInputSchema}
        initialValues={{
          name: [
            {
              key: 'ru',
              value: '',
            },
          ],
          variant: null,
          parent: null,
          subParent: null,
          catalogueTitle: {
            defaultTitle: [
              {
                key: DEFAULT_LANG,
                value: '',
              },
            ],
            prefix: [
              {
                key: DEFAULT_LANG,
                value: '',
              },
            ],
            keyword: [
              {
                key: DEFAULT_LANG,
                value: '',
              },
            ],
            gender: '' as GenderEnum,
          },
        }}
        onSubmit={(values) => {
          const { subParent, ...restValues } = values;
          const result = { ...restValues };

          if (subParent) {
            result.parent = subParent;
          }

          confirm(result);
        }}
      >
        {({ values }) => {
          const { parent } = values;
          const currentParent = rubrics.find(({ id }) => id === parent);

          return (
            <Form>
              {values.name.map((_, index) => {
                return (
                  <FormikInput
                    key={index}
                    name={`name[${index}].value`}
                    label={'Название'}
                    testId={'rubric-name'}
                    showInlineError
                    isRequired
                  />
                );
              })}

              {values.catalogueTitle.defaultTitle.map(({ key }, index) => {
                return (
                  <FormikInput
                    key={key}
                    name={`catalogueTitle.defaultTitle[${index}].value`}
                    label={'Заголовок каталога'}
                    testId={'rubric-default-title'}
                    showInlineError
                    isRequired
                  />
                );
              })}

              {values.catalogueTitle.prefix.map(({ key }, index) => {
                return (
                  <FormikInput
                    key={key}
                    name={`catalogueTitle.prefix[${index}].value`}
                    label={'Префикс заголовка каталога'}
                    testId={'rubric-title-prefix'}
                  />
                );
              })}

              {values.catalogueTitle.keyword.map(({ key }, index) => {
                return (
                  <FormikInput
                    key={key}
                    name={`catalogueTitle.keyword[${index}].value`}
                    label={'Ключевое слово заголовка каталога'}
                    testId={'rubric-title-keyword'}
                    showInlineError
                    isRequired
                  />
                );
              })}

              <FormikSelect
                firstOption={'Не назначено'}
                name={`catalogueTitle.gender`}
                label={'Род ключевого слова заголовка каталога'}
                testId={'rubric-title-gender'}
                showInlineError
                isRequired
                options={data.getGenderOptions || []}
              />

              {!parent && (
                <FormikSelect
                  isRequired
                  showInlineError
                  firstOption={'Не выбран'}
                  label={'Тип рубрики'}
                  name={'variant'}
                  testId={'rubric-variant'}
                  options={data?.getAllRubricVariants || []}
                />
              )}

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
