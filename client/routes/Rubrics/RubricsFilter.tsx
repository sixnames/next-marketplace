import React, { Fragment } from 'react';
import { useCreateRubricMutation, useGetRubricsTreeQuery } from '../../generated/apolloComponents';
import Spinner from '../../components/Spinner/Spinner';
import RequestError from '../../components/RequestError/RequestError';
import RubricsTree from './RubricsTree';
import FilterRadio from '../../components/FilterElements/FilterRadio/FilterRadio';
import Button from '../../components/Buttons/Button';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import { CREATE_RUBRIC_MODAL } from '../../config/modals';
import { QUERY_DATA_LAYOUT_NO_RUBRIC } from '../../config';
import classes from './RubricsFilter.module.css';
import RubricsTreeCounters from './RubricsTreeCounters';
import { RUBRICS_TREE_QUERY } from '../../graphql/CmsRubricsAndProducts';
import { CreateRubricModalInterface } from '../../components/Modal/CreateRubricModal/CreateRubricModal';

const RubricsFilter: React.FC = () => {
  const { onCompleteCallback, onErrorCallback, showLoading, showModal } = useMutationCallbacks({
    withModal: true,
  });
  const { data, error, loading } = useGetRubricsTreeQuery({
    fetchPolicy: 'network-only',
    variables: {
      counters: {
        noRubrics: true,
      },
    },
  });

  const [createRubricMutation] = useCreateRubricMutation({
    refetchQueries: [
      {
        query: RUBRICS_TREE_QUERY,
        variables: {
          counters: { noRubrics: true },
        },
      },
    ],
    awaitRefetchQueries: true,
    onCompleted: (data) => onCompleteCallback(data.createRubric),
    onError: onErrorCallback,
  });

  if (loading) return <Spinner />;
  if (error || !data || !data.getRubricsTree) return <RequestError />;
  const {
    getRubricsTree,
    getProductsCounters: { activeProductsCount, totalProductsCount },
  } = data;

  function createRubricHandler() {
    showModal<CreateRubricModalInterface>({
      type: CREATE_RUBRIC_MODAL,
      props: {
        rubrics: getRubricsTree,
        confirm: (values) => {
          showLoading();
          return createRubricMutation({ variables: { input: values } });
        },
      },
    });
  }

  const initialTab = { tab: '0' };

  return (
    <Fragment>
      <RubricsTree
        low
        isLastDisabled
        tree={getRubricsTree}
        titleLeft={(id, testId) => (
          <FilterRadio id={id} queryKey={'rubric'} testId={testId} additionalQuery={initialTab} />
        )}
      />

      <div className={classes.noRubrics}>
        <FilterRadio
          id={QUERY_DATA_LAYOUT_NO_RUBRIC}
          name={'Товары вне рубрик'}
          queryKey={'rubric'}
          testId={QUERY_DATA_LAYOUT_NO_RUBRIC}
        />

        <RubricsTreeCounters
          activeProductsCount={activeProductsCount}
          totalProductsCount={totalProductsCount}
          testId={QUERY_DATA_LAYOUT_NO_RUBRIC}
        />
      </div>

      <Button size={'small'} onClick={createRubricHandler} testId={'create-rubric'}>
        Добавить рубрику
      </Button>
    </Fragment>
  );
};

export default RubricsFilter;
