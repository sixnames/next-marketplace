import * as React from 'react';
import DataLayout from '../../components/DataLayout/DataLayout';
import RubricsFilter from './RubricsFilter';
import RubricsContent from './RubricsContent';
import { useDeleteRubricMutation, useGetRubricQuery } from 'generated/apolloComponents';
import NoRubricProducts from './NoRubricProducts';
import useRouterQuery from '../../hooks/useRouterQuery';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import { CONFIRM_MODAL } from 'config/modals';
import { RUBRICS_TREE_QUERY } from 'graphql/complex/rubricsQueries';
import useTabsConfig from '../../hooks/useTabsConfig';
import { QUERY_DATA_LAYOUT_NO_RUBRIC, RUBRIC_LEVEL_THREE, RUBRIC_LEVEL_ZERO } from 'config/common';

const RubricsRoute: React.FC = () => {
  const { query, removeQuery } = useRouterQuery();
  const { rubricId } = query;
  const isCurrentRubric = rubricId && rubricId !== QUERY_DATA_LAYOUT_NO_RUBRIC;

  const { onCompleteCallback, onErrorCallback, showModal, showLoading } = useMutationCallbacks({
    withModal: true,
  });
  const { generateTabsConfig } = useTabsConfig();
  const queryResult = useGetRubricQuery({
    fetchPolicy: 'network-only',
    skip: !isCurrentRubric,
    variables: {
      _id: `${rubricId}`,
    },
  });

  const [deleteRubricMutation] = useDeleteRubricMutation({
    onCompleted: (data) => {
      if (data && data.deleteRubric && data.deleteRubric.success) {
        removeQuery({ key: 'rubric' });
        onCompleteCallback(data.deleteRubric);
      }
    },
    onError: onErrorCallback,
    awaitRefetchQueries: true,
    refetchQueries: [
      {
        query: RUBRICS_TREE_QUERY,
        variables: {
          counters: { noRubrics: true },
        },
      },
    ],
  });

  const { data } = queryResult;
  const level = data && data.getRubric ? data.getRubric.level : RUBRIC_LEVEL_ZERO;
  // TODO fix this
  const notLastLevelRubric = level !== RUBRIC_LEVEL_THREE;

  function deleteRubricHandler() {
    if (data && data.getRubric) {
      showModal({
        variant: CONFIRM_MODAL,
        props: {
          testId: 'delete-rubric-modal',
          message: notLastLevelRubric
            ? 'Все вложенные рубрики так же будут удалены'
            : 'Рубрика будет удалена из базы данных',
          confirm: () => {
            showLoading();
            return deleteRubricMutation({
              variables: {
                _id: data.getRubric._id,
              },
            });
          },
        },
      });
    }
  }

  const filterResultNavConfig = generateTabsConfig({
    config: [
      {
        name: 'Товары',
        testId: 'products',
      },
      {
        name: 'Детали',
        testId: 'details',
      },
      {
        name: 'Атрибуты',
        testId: 'attributes',
      },
    ],
  });

  const contentControlsConfig = {
    deleteHandler: deleteRubricHandler,
    deleteTitle: 'Удалить рубрику',
    testId: 'rubric',
  };

  return (
    <DataLayout
      isFilterVisible
      title={'Рубрикатор'}
      filterContent={<RubricsFilter />}
      contentControlsConfig={isCurrentRubric ? contentControlsConfig : null}
      filterResultNavConfig={isCurrentRubric ? filterResultNavConfig : null}
      filterResult={() => {
        if (rubricId === QUERY_DATA_LAYOUT_NO_RUBRIC) {
          return <NoRubricProducts />;
        }

        return <RubricsContent queryResult={queryResult} />;
      }}
    />
  );
};

export default RubricsRoute;
