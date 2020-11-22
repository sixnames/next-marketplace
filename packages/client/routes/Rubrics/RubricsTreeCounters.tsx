import React from 'react';
import classes from './RubricsTreeCounters.module.css';
import Tooltip from '../../components/TTip/Tooltip';

interface RubricsTreeCountersInterface {
  activeProductsCount: number;
  totalProductsCount: number;
  testId: string;
}

const RubricsTreeCounters: React.FC<RubricsTreeCountersInterface> = ({
  totalProductsCount,
  activeProductsCount,
  testId,
}) => {
  return (
    <div className={classes.counters}>
      <Tooltip title={'Активные товары'}>
        <div data-cy={`${testId}-active`}>{activeProductsCount}</div>
      </Tooltip>
      <span>{`/`}</span>
      <Tooltip title={'Всего товаров'}>
        <div data-cy={`${testId}-total`}>{totalProductsCount}</div>
      </Tooltip>
    </div>
  );
};

export default RubricsTreeCounters;
