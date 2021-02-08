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
import { QUERY_DATA_LAYOUT_NO_RUBRIC } from 'config/common';

const RubricsRoute: React.FC = () => {
  const { query, removeQuery } = useRouterQuery();
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const isCurrentRubric = React.useMemo(() => {
    return selectedId && selectedId !== QUERY_DATA_LAYOUT_NO_RUBRIC;
  }, [selectedId]);

  const { onCompleteCallback, onErrorCallback, showModal, showLoading } = useMutationCallbacks({
    withModal: true,
  });
  const { generateTabsConfig } = useTabsConfig();
  const queryResult = useGetRubricQuery({
    fetchPolicy: 'network-only',
    skip: !selectedId,
    variables: {
      _id: `${selectedId}`,
    },
  });

  React.useEffect(() => {
    if (query.rubricId && query.rubricId !== selectedId) {
      setSelectedId(`${query.rubricId}`);
    }
  }, [query, selectedId]);

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

  function deleteRubricHandler() {
    if (data && data.getRubric) {
      showModal({
        variant: CONFIRM_MODAL,
        props: {
          testId: 'delete-rubric-modal',
          message: 'Рубрика будет удалена',
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
        if (selectedId === QUERY_DATA_LAYOUT_NO_RUBRIC) {
          return <NoRubricProducts />;
        }

        return <RubricsContent queryResult={queryResult} />;
      }}
    />
  );
};

export default RubricsRoute;
