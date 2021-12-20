import * as React from 'react';
import { RubricInterface } from '../db/uiInterfaces';
import RequestError from './RequestError';
import WpAccordion from './WpAccordion';

interface RubricsTreeInterface {
  rubrics: RubricInterface[];
  render?: (args: RubricInterface) => any;
  isAccordionDisabled?: boolean;
  titleLeft?: (_id: string, testId?: string) => any;
  low?: boolean;
  testIdPrefix?: string;
  openAll?: boolean;
}

const RubricsList: React.FC<RubricsTreeInterface> = ({
  rubrics = [],
  render,
  isAccordionDisabled = false,
  titleLeft,
  low = false,
  testIdPrefix,
  openAll,
}) => {
  const finalTestIdPrefix = React.useMemo(() => {
    return testIdPrefix ? `${testIdPrefix}-` : '';
  }, [testIdPrefix]);

  const titleLeftContent = React.useCallback(
    (rubric: RubricInterface) => {
      return titleLeft
        ? titleLeft(`${rubric._id}`, `${finalTestIdPrefix}tree-link-${rubric.name}`)
        : null;
    },
    [finalTestIdPrefix, titleLeft],
  );

  if (!rubrics) {
    return <RequestError message={'Ошибка загрузки списка рубрик'} />;
  }

  return (
    <div className={`${low ? 'mb-8' : 'mb-12'}`} data-cy={'rubrics-tree'}>
      {rubrics.map((rubric) => {
        const { _id, name } = rubric;
        return (
          <div key={`${_id}`} className='mb-4'>
            <WpAccordion
              isOpen={openAll}
              titleLeft={titleLeftContent(rubric)}
              disabled={isAccordionDisabled}
              title={`${name}`}
              testId={`tree-${name}`}
            >
              {render ? render(rubric) : null}
            </WpAccordion>
          </div>
        );
      })}
    </div>
  );
};

export default RubricsList;
