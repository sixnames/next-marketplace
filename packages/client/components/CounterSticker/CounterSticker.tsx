import React from 'react';
import classes from './CounterSticker.module.css';

export interface CounterStickerInterface {
  value?: number | null | undefined;
  className?: string;
  testId?: string;
}

const CounterSticker: React.FC<CounterStickerInterface> = ({ value, testId, className }) => {
  if (!value) {
    return null;
  }

  return (
    <div className={`${classes.frame} ${className ? className : ''}`} data-cy={testId}>
      {value}
    </div>
  );
};

export default CounterSticker;
