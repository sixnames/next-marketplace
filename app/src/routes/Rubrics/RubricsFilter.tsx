import React, { Fragment } from 'react';
import {
  GetRubricsTreeQuery,
  useCreateRubricMutation,
  useGetRubricsTreeQuery,
} from '../../generated/apolloComponents';
import Spinner from '../../components/Spinner/Spinner';
import RequestError from '../../components/RequestError/RequestError';
import RubricsTree from './RubricsTree';
import FilterRadio from '../../components/FilterElements/FilterRadio/FilterRadio';
import Button from '../../components/Buttons/Button';
import useMutationCallbacks from '../../hooks/mutations/useMutationCallbacks';
import updateItemInTree from '../../utils/updateItemInTree';
import { CREATE_RUBRIC_MODAL } from '../../config/modals';
import { QUERY_DATA_LAYOUT_NO_RUBRIC, RUBRIC_LEVEL_ONE } from '../../config';
import classes from './RubricsFilter.module.css';
import RubricsTreeCounters from './RubricsTreeCounters';
import { RUBRICS_TREE_QUERY } from '../../graphql/CmsRubricsAndProducts';

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
    update: (proxy, { data }) => {
      if (data && data.createRubric && data.createRubric.success && data.createRubric.rubric) {
        const {
          createRubric: { rubric: createdRubric },
        } = data;

        const cacheData: GetRubricsTreeQuery | null = proxy.readQuery({
          query: RUBRICS_TREE_QUERY,
          variables: {
            counters: { noRubrics: true },
          },
        });

        if (cacheData && cacheData.getRubricsTree && createdRubric) {
          const { getRubricsTree } = cacheData;

          proxy.writeQuery({
            query: RUBRICS_TREE_QUERY,
            data: {
              getRubricsTree:
                createdRubric.level === RUBRIC_LEVEL_ONE
                  ? getRubricsTree.concat(createdRubric)
                  : updateItemInTree({
                      target: createdRubric.parent ? createdRubric.parent.id : '',
                      tree: getRubricsTree,
                      updater: (parent) => ({
                        ...parent,
                        children: [...parent.children, createdRubric],
                      }),
                    }),
            },
          });
        }
      }
    },
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
    showModal({
      type: CREATE_RUBRIC_MODAL,
      props: {
        rubrics: getRubricsTree,
        isSubRubric: true,
        isCatalogueName: true,
        confirm: (values: any) => {
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
