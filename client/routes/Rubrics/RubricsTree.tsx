import React from 'react';
import Accordion from '../../components/Accordion/Accordion';
import classes from './RubricsTree.module.css';
import RubricsTreeCounters from './RubricsTreeCounters';
import { GetRubricsTreeQuery } from '../../generated/apolloComponents';

type TreeItemType = Omit<GetRubricsTreeQuery['getRubricsTree'][0], 'children'>;

export interface RubricsTreeItemInterface extends TreeItemType {
  children?: RubricsTreeItemInterface[];
}

interface RubricsTreeInterface {
  tree: GetRubricsTreeQuery['getRubricsTree'];
  render?: (id: string) => any;
  isLastDisabled?: boolean;
  titleLeft?: (id: string, testId?: string) => any;
  lastTitleLeft?: (id: string, testId?: string) => any;
  low?: boolean;
}

const RubricsTree: React.FC<RubricsTreeInterface> = ({
  tree = [],
  render,
  isLastDisabled = false,
  titleLeft,
  lastTitleLeft,
  low = false,
}) => {
  function renderChildren(item: RubricsTreeItemInterface, isFirst?: boolean) {
    const { id, activeProductsCount = 0, totalProductsCount = 0, nameString, children } = item;

    const isLast = !children || !children.length;

    const titleLeftContent = titleLeft ? () => titleLeft(id, `tree-link-${nameString}`) : null;

    if (isLast) {
      return (
        <Accordion
          // isOpen={true}
          titleLeft={
            lastTitleLeft ? () => lastTitleLeft(id, `tree-link-${nameString}`) : titleLeftContent
          }
          disabled={totalProductsCount === 0 || isLastDisabled}
          titleRight={
            <RubricsTreeCounters
              activeProductsCount={activeProductsCount}
              totalProductsCount={totalProductsCount}
              testId={nameString}
            />
          }
          title={nameString}
          key={id}
          testId={`tree-${nameString}`}
        >
          {render ? render(id) : null}
        </Accordion>
      );
    } else {
      return (
        <Accordion
          // isOpen={isFirst}
          isOpen={true}
          titleLeft={titleLeft ? () => titleLeft(id, `tree-link-${nameString}`) : null}
          titleClassName={isFirst ? classes.first : ''}
          titleRight={
            <RubricsTreeCounters
              testId={nameString}
              activeProductsCount={activeProductsCount}
              totalProductsCount={totalProductsCount}
            />
          }
          title={nameString}
          key={id}
          testId={`tree-${nameString}`}
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

  return (
    <div className={`${classes.frame} ${low ? classes.frameLow : ''}`} data-cy={'rubrics-tree'}>
      {tree.map((item) => renderChildren(item, true))}
    </div>
  );
};

export default RubricsTree;
