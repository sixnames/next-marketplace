import React from 'react';
import DataLayout from '../../components/DataLayout/DataLayout';
import RubricsFilter from './RubricsFilter';
import RubricsContent from './RubricsContent';
import { useDeleteRubricMutation, useGetRubricQuery } from '../../generated/apolloComponents';
import { RUBRIC_LEVEL_THREE, RUBRIC_LEVEL_ZERO } from '@rg/config';
import NoRubricProducts from './NoRubricProducts';
import { QUERY_DATA_LAYOUT_NO_RUBRIC } from '../../config';
import useRouterQuery from '../../hooks/useRouterQuery';
import useTabsConfig from '../../hooks/useTabsConfig';
import useMutationCallbacks from '../../hooks/mutations/useMutationCallbacks';
import { CONFIRM_MODAL } from '../../config/modals';
import { RUBRICS_TREE_QUERY } from '../../graphql/query/getRubricsTree';

const RubricsRoute: React.FC = () => {
  const { query, removeQuery } = useRouterQuery();
  const { rubric } = query;
  const { onCompleteCallback, onErrorCallback, showModal, showLoading } = useMutationCallbacks({
    withModal: true,
  });
  const { generateTabsConfig } = useTabsConfig();
  const queryResult = useGetRubricQuery({
    fetchPolicy: 'network-only',
    skip: !rubric || rubric === QUERY_DATA_LAYOUT_NO_RUBRIC,
    variables: {
      id: `${rubric}`,
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
    refetchQueries: [
      {
        query: RUBRICS_TREE_QUERY,
      },
    ],
  });

  const { data } = queryResult;
  const level = data && data.getRubric ? data.getRubric.level : RUBRIC_LEVEL_ZERO;
  const notLastLevelRubric = level !== RUBRIC_LEVEL_THREE;

  function deleteRubricHandler() {
    if (data && data.getRubric) {
      showModal({
        type: CONFIRM_MODAL,
        props: {
          testId: 'delete-rubric-modal',
          message: notLastLevelRubric
            ? 'Все вложенные рубрики так же будут удалены'
            : 'Рубрика будет удалена из базы данных',
          confirm: () => {
            showLoading();
            return deleteRubricMutation({
              variables: {
                id: data.getRubric.id,
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
        name: 'Детали',
        testId: 'details',
      },
      {
        name: 'Товары',
        hidden: notLastLevelRubric,
        testId: 'products',
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
      title={'Рубрикатор'}
      filterContent={<RubricsFilter />}
      contentControlsConfig={rubric ? contentControlsConfig : null}
      filterResultNavConfig={rubric ? filterResultNavConfig : null}
      filterResult={() => {
        if (rubric === QUERY_DATA_LAYOUT_NO_RUBRIC) {
          return <NoRubricProducts />;
        }

        return <RubricsContent queryResult={queryResult} />;
      }}
    />
  );
};

export default RubricsRoute;