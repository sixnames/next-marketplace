import React from 'react';
import {
  GetRubricQuery,
  useGetAllRubricVariantsQuery,
  useUpdateRubricMutation,
} from '../../generated/apolloComponents';
import { Formik, Form } from 'formik';
import FormikInput from '../../components/FormElements/Input/FormikInput';
import FormikSelect from '../../components/FormElements/Select/FormikSelect';
import Spinner from '../../components/Spinner/Spinner';
import RequestError from '../../components/RequestError/RequestError';
import FixedButtons from '../../components/Buttons/FixedButtons';
import Button from '../../components/Buttons/Button';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import InnerWide from '../../components/Inner/InnerWide';
import classes from './RubricDetails.module.css';
import Accordion from '../../components/Accordion/Accordion';
import { RUBRIC_LEVEL_ZERO, RUBRIC_LEVEL_ONE, DEFAULT_LANG } from '../../config';
import { updateRubricInputSchema } from '../../validation';
import { RUBRICS_TREE_QUERY } from '../../graphql/rubrics';
import DataLayoutTitle from '../../components/DataLayout/DataLayoutTitle';

interface RubricDetailsInterface {
  rubric: GetRubricQuery['getRubric'];
}

const RubricDetails: React.FC<RubricDetailsInterface> = ({ rubric }) => {
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

  const { id = '', level = RUBRIC_LEVEL_ZERO, variant, nameString, catalogueTitle } = rubric;

  const initialValues = {
    id,
    name: [{ key: DEFAULT_LANG, value: nameString || '' }],
    catalogueTitle: {
      defaultTitle: catalogueTitle.defaultTitle,
      prefix: catalogueTitle.prefix ? catalogueTitle.prefix : [],
      keyword: catalogueTitle.keyword,
      gender: catalogueTitle.gender,
    },
    variant: variant ? variant.id : null,
  };

  const isFirstLevel = level === RUBRIC_LEVEL_ONE;

  return (
    <div data-cy={'rubric-details'}>
      <DataLayoutTitle testId={'rubric-title'}>{rubric.name}</DataLayoutTitle>

      <InnerWide>
        <Formik
          validationSchema={updateRubricInputSchema}
          initialValues={initialValues}
          enableReinitialize
          onSubmit={(values) => {
            showLoading();

            return updateRubricMutation({
              variables: {
                input: values,
              },
            });
          }}
        >
          {({ values }) => {
            return (
              <Form>
                <div className={classes.section}>
                  <Accordion title={'Основная информация'} isOpen>
                    <div className={classes.content}>
                      {values.name.map(({ key }, index) => {
                        return (
                          <FormikInput
                            key={key}
                            name={`name[${index}].value`}
                            label={'Название'}
                            testId={'rubric-name'}
                            showInlineError
                            isRequired
                            isHorizontal
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
                            isHorizontal
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
                            isHorizontal
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
                            isHorizontal
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
                        isHorizontal
                      />

                      {isFirstLevel && (
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
                      )}
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
