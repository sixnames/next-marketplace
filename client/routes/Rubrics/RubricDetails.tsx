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
import { RUBRIC_LEVEL_ZERO, RUBRIC_LEVEL_ONE } from '../../config';
import { updateRubricInputSchema } from '../../validation';
import { RUBRICS_TREE_QUERY } from '../../graphql/CmsRubricsAndProducts';
import DataLayoutTitle from '../../components/DataLayout/DataLayoutTitle';

interface RubricDetailsInterface {
  rubric: GetRubricQuery['getRubric'];
}

const RubricDetails: React.FC<RubricDetailsInterface> = ({ rubric = {} }) => {
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

  const { id = '', level = RUBRIC_LEVEL_ZERO, variant, name, catalogueName } = rubric;

  const initialValues = {
    id,
    name: [{ key: 'ru', value: name || '' }],
    catalogueName: [{ key: 'ru', value: catalogueName || '' }],
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
                      {values.name.map((_, index) => {
                        return (
                          <FormikInput
                            key={index}
                            name={`name[${index}].value`}
                            label={'Название'}
                            testId={'rubric-name'}
                            showInlineError
                            isRequired
                            isHorizontal
                          />
                        );
                      })}

                      {values.catalogueName.map((_, index) => {
                        return (
                          <FormikInput
                            key={index}
                            name={`catalogueName[${index}].value`}
                            label={'Название каталога'}
                            testId={'catalogue-name'}
                            showInlineError
                            isRequired
                            isHorizontal
                          />
                        );
                      })}

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
