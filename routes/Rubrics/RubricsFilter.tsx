import * as React from 'react';
import { useCreateRubricMutation, useGetAllRubricsQuery } from 'generated/apolloComponents';
import Spinner from '../../components/Spinner/Spinner';
import RequestError from '../../components/RequestError/RequestError';
import RubricsList from 'routes/Rubrics/RubricsList';
import FilterRadio from '../../components/FilterElements/FilterRadio/FilterRadio';
import Button from '../../components/Buttons/Button';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import { CREATE_RUBRIC_MODAL } from 'config/modals';
import classes from './RubricsFilter.module.css';
import { ALL_RUBRICS_QUERY } from 'graphql/complex/rubricsQueries';
import { CreateRubricModalInterface } from 'components/Modal/CreateRubricModal/CreateRubricModal';
import { QUERY_DATA_LAYOUT_NO_RUBRIC } from 'config/common';

const RubricsFilter: React.FC = () => {
  const { onCompleteCallback, onErrorCallback, showLoading, showModal } = useMutationCallbacks({
    withModal: true,
  });
  const { data, error, loading } = useGetAllRubricsQuery();

  const [createRubricMutation] = useCreateRubricMutation({
    refetchQueries: [
      {
        query: ALL_RUBRICS_QUERY,
      },
    ],
    awaitRefetchQueries: true,
    onCompleted: (data) => onCompleteCallback(data.createRubric),
    onError: onErrorCallback,
  });

  if (loading) {
    return <Spinner />;
  }

  if (error || !data || !data.getAllRubrics) {
    return <RequestError />;
  }

  const { getAllRubrics } = data;

  function createRubricHandler() {
    showModal<CreateRubricModalInterface>({
      variant: CREATE_RUBRIC_MODAL,
      props: {
        rubrics: getAllRubrics,
        confirm: (values) => {
          showLoading();
          return createRubricMutation({ variables: { input: values } });
        },
      },
    });
  }

  const initialTab = { tab: '0' };

  return (
    <React.Fragment>
      <RubricsList
        low
        isAccordionDisabled
        rubrics={getAllRubrics}
        titleLeft={(_id, testId) => (
          <FilterRadio
            _id={_id}
            queryKey={'rubricId'}
            testId={testId}
            additionalQuery={initialTab}
          />
        )}
      />

      <div className={classes.noRubrics}>
        <FilterRadio
          _id={QUERY_DATA_LAYOUT_NO_RUBRIC}
          name={'Товары вне рубрик'}
          queryKey={'rubricId'}
          testId={QUERY_DATA_LAYOUT_NO_RUBRIC}
        />
      </div>

      <Button size={'small'} onClick={createRubricHandler} testId={'create-rubric'}>
        Добавить рубрику
      </Button>
    </React.Fragment>
  );
};

export default RubricsFilter;
