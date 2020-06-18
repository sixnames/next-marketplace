import React from 'react';
import Accordion from '../../components/Accordion/Accordion';
import classes from './RubricsTree.module.css';
import { RUBRIC_LEVEL_THREE } from '@rg/config';

export interface RubricsTreeItemInterface {
  id: string;
  name: string;
  level: number;
  totalProductsCount: number;
  activeProductsCount: number;
  children?: RubricsTreeItemInterface[];
}

interface RubricsTreeInterface {
  tree: RubricsTreeItemInterface[];
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
    const { id, activeProductsCount = 0, totalProductsCount = 0, name, children, level } = item;
    const isLast = level === RUBRIC_LEVEL_THREE;
    const counters = (
      <div className={classes.counters}>
        <span data-cy={`${name}-active`}>{activeProductsCount}</span>
        {` / `}
        <span data-cy={`${name}-total`}>{totalProductsCount}</span>
      </div>
    );

    const titleLeftContent = titleLeft ? () => titleLeft(id, `tree-link-${name}`) : null;

    if (isLast) {
      return (
        <Accordion
          // isOpen={true}
          titleLeft={
            lastTitleLeft ? () => lastTitleLeft(id, `tree-link-${name}`) : titleLeftContent
          }
          disabled={totalProductsCount === 0 || isLastDisabled}
          titleRight={counters}
          title={name}
          key={id}
          testId={`tree-${name}`}
        >
          {render ? render(id) : null}
        </Accordion>
      );
    } else {
      return (
        <Accordion
          // isOpen={isFirst}
          isOpen={true}
          titleLeft={titleLeft ? () => titleLeft(id, `tree-link-${name}`) : null}
          titleClassName={isFirst ? classes.first : ''}
          titleRight={counters}
          title={name}
          key={id}
          testId={`tree-${name}`}
        >
          <div className={classes.nested}>
            {children
              ? children.map((item: RubricsTreeItemInterface) => {
                  return renderChildren(item);
                })
              : null}
          </div>
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
