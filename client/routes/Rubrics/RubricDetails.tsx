import React from 'react';
import {
  GetRubricQuery,
  useGetAllRubricVariantsQuery,
  useUpdateRubricMutation,
} from '../../generated/apolloComponents';
import { Formik, Form } from 'formik';
import FormikSelect from '../../components/FormElements/Select/FormikSelect';
import Spinner from '../../components/Spinner/Spinner';
import RequestError from '../../components/RequestError/RequestError';
import FixedButtons from '../../components/Buttons/FixedButtons';
import Button from '../../components/Buttons/Button';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import InnerWide from '../../components/Inner/InnerWide';
import classes from './RubricDetails.module.css';
import Accordion from '../../components/Accordion/Accordion';
import { updateRubricInputSchema } from '../../validation';
import { RUBRICS_TREE_QUERY } from '../../graphql/rubrics';
import DataLayoutTitle from '../../components/DataLayout/DataLayoutTitle';
import { useLanguageContext } from '../../context/languageContext';
import FormikTranslationsInput from '../../components/FormElements/Input/FormikTranslationsInput';
import useValidationSchema from '../../hooks/useValidationSchema';

interface RubricDetailsInterface {
  rubric: GetRubricQuery['getRubric'];
}

const RubricDetails: React.FC<RubricDetailsInterface> = ({ rubric }) => {
  const { getLanguageFieldInitialValue, getLanguageFieldInputValue } = useLanguageContext();
  const validationSchema = useValidationSchema({
    schema: updateRubricInputSchema,
    messagesKeys: [
      'validation.rubrics.id',
      'validation.rubrics.name',
      'validation.rubrics.variant',
      'validation.rubrics.defaultTitle',
      'validation.rubrics.keyword',
      'validation.rubrics.gender',
    ],
  });
  const { onCompleteCallback, onErrorCallback, showLoading } = useMutationCallbacks({});
  const [updateRubricMutation] = useUpdateRubricMutation({
    awaitRefetchQueries: true,
    refetchQueries: [
      {
        query: RUBRICS_TREE_QUERY,
        variables: {
          counters: {
            noRubrics: true,
          },
        },
      },
    ],
    onCompleted: (data) => onCompleteCallback(data.updateRubric),
    onError: onErrorCallback,
  });

  const { data, loading, error } = useGetAllRubricVariantsQuery();

  if (loading) return <Spinner />;
  if (error || !data || !data.getAllRubricVariants || !rubric) {
    return <RequestError />;
  }

  const { id = '', variant, name, nameString, catalogueTitle } = rubric;

  const initialValues = {
    id,
    name: getLanguageFieldInitialValue(name),
    catalogueTitle: {
      defaultTitle: getLanguageFieldInitialValue(catalogueTitle.defaultTitle),
      prefix: getLanguageFieldInitialValue(catalogueTitle.prefix),
      keyword: getLanguageFieldInitialValue(catalogueTitle.keyword),
      gender: catalogueTitle.gender,
    },
    variant: variant.id,
  };

  return (
    <div data-cy={'rubric-details'}>
      <DataLayoutTitle testId={'rubric-title'}>{nameString}</DataLayoutTitle>

      <InnerWide>
        <Formik
          validationSchema={validationSchema}
          initialValues={initialValues}
          enableReinitialize
          onSubmit={(values) => {
            showLoading();
            const { catalogueTitle, ...restValues } = values;
            return updateRubricMutation({
              variables: {
                input: {
                  ...restValues,
                  name: getLanguageFieldInputValue(restValues.name),
                  catalogueTitle: {
                    ...catalogueTitle,
                    defaultTitle: getLanguageFieldInputValue(catalogueTitle.defaultTitle),
                    prefix: getLanguageFieldInputValue(catalogueTitle.prefix),
                    keyword: getLanguageFieldInputValue(catalogueTitle.keyword),
                  },
                },
              },
            });
          }}
        >
          {() => {
            return (
              <Form>
                <div className={classes.section}>
                  <Accordion title={'Основная информация'} isOpen>
                    <div className={classes.content}>
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
                        label={'Род ключевого слова заголовка каталога'}
                        testId={'catalogueTitle-gender'}
                        showInlineError
                        isRequired
                        options={data.getGenderOptions || []}
                        isHorizontal
                      />

                      <FormikSelect
                        isRequired
                        isHorizontal
                        showInlineError
                        firstOption={'Не выбран'}
                        label={'Тип рубрики'}
                        name={'variant'}
                        testId={'rubric-variant'}
                        options={data?.getAllRubricVariants || []}
                      />
                    </div>
                  </Accordion>
                </div>

                <FixedButtons>
                  <Button size={'small'} type={'submit'} testId={'rubric-submit'}>
                    Сохранить
                  </Button>
                </FixedButtons>
              </Form>
            );
          }}
        </Formik>
      </InnerWide>
    </div>
  );
};

export default RubricDetails;
