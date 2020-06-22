import React from 'react';
import classes from './RubricsTreeCounters.module.css';
import TTip from '../../components/TTip/TTip';

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
      <TTip data-cy={`${testId}-active`} title={'Активные товары'}>
        {activeProductsCount}
      </TTip>
      <span>{`/`}</span>
      <TTip data-cy={`${testId}-total`} title={'Всего товаров'}>
        {totalProductsCount}
      </TTip>
    </div>
  );
};

export default RubricsTreeCounters;
