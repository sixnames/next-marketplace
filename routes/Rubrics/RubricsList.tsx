import { GetAllRubricsQuery } from 'generated/apolloComponents';
import * as React from 'react';
import Accordion from '../../components/Accordion/Accordion';
import classes from './RubricsTree.module.css';
import RubricsTreeCounters from './RubricsTreeCounters';
import RequestError from 'components/RequestError/RequestError';

interface RubricsTreeInterface {
  rubrics: GetAllRubricsQuery['getAllRubrics'];
  render?: (_id: string) => any;
  isAccordionDisabled?: boolean;
  titleLeft?: (_id: string, testId?: string) => any;
  low?: boolean;
  testIdPrefix?: string;
}

const RubricsList: React.FC<RubricsTreeInterface> = ({
  rubrics = [],
  render,
  isAccordionDisabled = false,
  titleLeft,
  low = false,
  testIdPrefix,
}) => {
  const finalTestIdPrefix = React.useMemo(() => {
    return testIdPrefix ? `${testIdPrefix}-` : '';
  }, [testIdPrefix]);

  const titleLeftContent = React.useCallback(
    (_id: any, name: string) => {
      return titleLeft ? () => titleLeft(_id, `${finalTestIdPrefix}tree-link-${name}`) : null;
    },
    [finalTestIdPrefix, titleLeft],
  );

  if (!rubrics) {
    return <RequestError message={'Ошибка загрузки списка рубрик'} />;
  }

  return (
    <div className={`${classes.frame} ${low ? classes.frameLow : ''}`} data-cy={'rubrics-tree'}>
      {rubrics.map((item) => {
        const { _id, activeProductsCount, productsCount, name } = item;

        return (
          <Accordion
            titleLeft={() => titleLeftContent(_id, name)}
            disabled={productsCount === 0 || isAccordionDisabled}
            titleRight={
              <RubricsTreeCounters
                activeProductsCount={activeProductsCount}
                totalProductsCount={productsCount}
                testId={name}
              />
            }
            title={name}
            key={_id}
            testId={`tree-${name}`}
          >
            {render ? render(_id) : null}
          </Accordion>
        );
      })}
    </div>
  );
};

export default RubricsList;
