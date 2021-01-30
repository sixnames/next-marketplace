import * as React from 'react';
import { RubricInTreeInterface } from 'types/clientTypes';
import Accordion from '../../components/Accordion/Accordion';
import classes from './RubricsTree.module.css';
import RubricsTreeCounters from './RubricsTreeCounters';
import { GetRubricsTreeQuery } from 'generated/apolloComponents';
import RequestError from 'components/RequestError/RequestError';

export interface RubricsTreeItemInterface extends RubricInTreeInterface {
  children?: RubricsTreeItemInterface[];
}

interface RubricsTreeInterface {
  tree: GetRubricsTreeQuery['getRubricsTree'];
  render?: (_id: string) => any;
  isLastDisabled?: boolean;
  titleLeft?: (_id: string, testId?: string) => any;
  lastTitleLeft?: (_id: string, testId?: string) => any;
  low?: boolean;
  testIdPrefix?: string;
}

const RubricsTree: React.FC<RubricsTreeInterface> = ({
  tree = [],
  render,
  isLastDisabled = false,
  titleLeft,
  lastTitleLeft,
  low = false,
  testIdPrefix,
}) => {
  const finalTestIdPrefix = testIdPrefix ? `${testIdPrefix}-` : '';
  function renderChildren(item: RubricsTreeItemInterface, isFirst?: boolean) {
    const { _id, productsCounters, name, children } = item;
    const { totalDocs, totalActiveDocs } = productsCounters;
    const isLast = !children || !children.length;

    const titleLeftContent = titleLeft
      ? () => titleLeft(_id, `${finalTestIdPrefix}tree-link-${name}`)
      : null;

    if (isLast) {
      return (
        <Accordion
          titleLeft={
            lastTitleLeft
              ? () => lastTitleLeft(_id, `${finalTestIdPrefix}tree-link-${name}`)
              : titleLeftContent
          }
          titleClassName={isFirst ? classes.first : ''}
          disabled={totalDocs === 0 || isLastDisabled}
          titleRight={
            <RubricsTreeCounters
              activeProductsCount={totalActiveDocs}
              totalProductsCount={totalDocs}
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
    } else {
      return (
        <Accordion
          isOpen={true}
          titleLeft={
            titleLeft ? () => titleLeft(_id, `${finalTestIdPrefix}tree-link-${name}`) : null
          }
          titleClassName={isFirst ? classes.first : ''}
          titleRight={
            <RubricsTreeCounters
              testId={_id}
              activeProductsCount={totalActiveDocs}
              totalProductsCount={totalDocs}
            />
          }
          title={name}
          key={name}
          testId={`tree-${name}`}
        >
          {children
            ? children.map((item, index) => {
                return (
                  <div key={index} className={classes.nested}>
                    {renderChildren(item)}
                  </div>
                );
              })
            : null}
        </Accordion>
      );
    }
  }

  if (!tree) {
    return <RequestError message={'Ошибка загрузки дерева рубрик'} />;
  }

  return (
    <div className={`${classes.frame} ${low ? classes.frameLow : ''}`} data-cy={'rubrics-tree'}>
      {tree.map((item) => renderChildren(item, true))}
    </div>
  );
};

export default RubricsTree;
