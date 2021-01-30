import RubricMainFields from 'components/FormTemplates/RubricMainFields';
import * as React from 'react';
import {
  GetRubricQuery,
  UpdateRubricInput,
  useGetAllRubricVariantsQuery,
  useUpdateRubricMutation,
} from 'generated/apolloComponents';
import { Formik, Form } from 'formik';
import Spinner from '../../components/Spinner/Spinner';
import RequestError from '../../components/RequestError/RequestError';
import FixedButtons from '../../components/Buttons/FixedButtons';
import Button from '../../components/Buttons/Button';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import InnerWide from '../../components/Inner/InnerWide';
import classes from './RubricDetails.module.css';
import Accordion from '../../components/Accordion/Accordion';
import { RUBRICS_TREE_QUERY } from 'graphql/complex/rubricsQueries';
import DataLayoutTitle from '../../components/DataLayout/DataLayoutTitle';
import useValidationSchema from '../../hooks/useValidationSchema';
import { updateRubricSchema } from 'validation/rubricSchema';

interface RubricDetailsInterface {
  rubric: GetRubricQuery['getRubric'];
}

const RubricDetails: React.FC<RubricDetailsInterface> = ({ rubric }) => {
  const validationSchema = useValidationSchema({
    schema: updateRubricSchema,
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

  const {
    _id = '',
    name,
    active,
    variantId,
    descriptionI18n,
    shortDescriptionI18n,
    nameI18n,
    catalogueTitle,
  } = rubric;

  const initialValues: UpdateRubricInput = {
    rubricId: _id,
    active,
    nameI18n,
    descriptionI18n,
    shortDescriptionI18n,
    catalogueTitle: {
      defaultTitleI18n: catalogueTitle.defaultTitleI18n,
      prefixI18n: catalogueTitle.prefixI18n,
      keywordI18n: catalogueTitle.keywordI18n,
      gender: catalogueTitle.gender,
    },
    variantId,
  };

  return (
    <div data-cy={'rubric-details'}>
      <DataLayoutTitle testId={'rubric-title'}>{name}</DataLayoutTitle>

      <InnerWide>
        <Formik
          validationSchema={validationSchema}
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
          {() => {
            return (
              <Form>
                <div className={classes.section}>
                  <Accordion title={'Основная информация'} isOpen>
                    <div className={classes.content}>
                      <RubricMainFields />
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
