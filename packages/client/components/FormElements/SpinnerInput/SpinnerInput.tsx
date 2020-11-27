import React from 'react';
import { OnOffType } from '../../../types';
import classes from './SpinnerInput.module.css';
import Icon from '../../Icon/Icon';
import { noNaN } from '@yagu/shared';

export interface SpinnerInterface {
  name: string;
  className?: string;
  frameClassName?: string;
  value?: any;
  notValid?: boolean;
  autoComplete?: OnOffType;
  testId?: string;
  plusTestId?: string;
  minusTestId?: string;
  min?: number;
  max?: number;
  placeholder?: string;
  disabled?: boolean;
  onChange?: (e: {
    target: {
      id?: string;
      name?: string;
      value: string;
    };
  }) => void;
}

const SpinnerInput: React.FC<SpinnerInterface> = ({
  name,
  className,
  value,
  notValid,
  testId,
  onChange,
  min,
  frameClassName,
  disabled,
  plusTestId,
  minusTestId,
  ...props
}) => {
  const notValidClass = notValid ? classes.error : '';
  const additionalClass = className ? className : '';
  const inputClassName = `${classes.input} ${notValidClass} ${additionalClass}`;
  const currentValue = value ? noNaN(value) : noNaN(min);
  const counterStep = 1;

  return (
    <div className={`${classes.frame} ${frameClassName ? frameClassName : ''}`}>
      <button
        data-cy={minusTestId}
        disabled={disabled}
        className={`${classes.butn}`}
        onClick={() => {
          if (onChange && min !== currentValue) {
            onChange({
              target: {
                name: `${name}`,
                value: `${currentValue - counterStep}`,
              },
            });
          }
        }}
      >
        <Icon name={'dash'} />
      </button>
      <input
        id={name}
        className={`${inputClassName}`}
        value={currentValue}
        name={name}
        type={'number'}
        data-cy={testId}
        onChange={onChange}
        min={min}
        disabled={disabled}
        {...props}
      />
      <button
        data-cy={plusTestId}
        disabled={disabled}
        className={`${classes.butn} ${classes.butnPlus}`}
        onClick={() => {
          if (onChange) {
            onChange({
              target: {
                name: `${name}`,
                value: `${currentValue + counterStep}`,
              },
            });
          }
        }}
      >
        <Icon name={'plus'} />
      </button>
    </div>
  );
};

export default SpinnerInput;
