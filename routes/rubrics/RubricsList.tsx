import { GetAllRubricsQuery } from 'generated/apolloComponents';
import * as React from 'react';
import Accordion from '../../components/Accordion/Accordion';
import RequestError from 'components/RequestError';

interface RubricsTreeRenderInterface {
  _id: string;
  slug: string;
}

interface RubricsTreeInterface {
  rubrics: GetAllRubricsQuery['getAllRubrics'];
  render?: (args: RubricsTreeRenderInterface) => any;
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
      return titleLeft ? titleLeft(_id, `${finalTestIdPrefix}tree-link-${name}`) : null;
    },
    [finalTestIdPrefix, titleLeft],
  );

  if (!rubrics) {
    return <RequestError message={'Ошибка загрузки списка рубрик'} />;
  }

  return (
    <div className={`${low ? 'mb-8' : 'mb-12'}`} data-cy={'rubrics-tree'}>
      {rubrics.map((item) => {
        const { _id, name, slug } = item;
        return (
          <Accordion
            titleLeft={titleLeftContent(_id, name)}
            disabled={isAccordionDisabled}
            // disabled={productsCount === 0 || isAccordionDisabled}
            /*titleRight={
              <RubricsTreeCounters
                activeProductsCount={activeProductsCount}
                totalProductsCount={productsCount}
                testId={name}
              />
            }*/
            title={name}
            key={_id}
            testId={`tree-${name}`}
          >
            {render ? render({ _id, slug }) : null}
          </Accordion>
        );
      })}
    </div>
  );
};

export default RubricsList;
