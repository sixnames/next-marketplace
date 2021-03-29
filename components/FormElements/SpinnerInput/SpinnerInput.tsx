import * as React from 'react';
import classes from './SpinnerInput.module.css';
import Icon from '../../Icon/Icon';
import { OnOffType } from 'types/clientTypes';
import { noNaN } from 'lib/numbers';

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
  size?: 'small' | 'normal';
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
  size = 'normal',
  max,
  ...props
}) => {
  const sizeClass = classes[size];
  const notValidClass = notValid ? classes.error : '';
  const additionalClass = className ? className : '';
  const inputClassName = `${classes.input} ${notValidClass} ${additionalClass}`;
  const currentValue = value ? noNaN(value) : noNaN(min);
  const counterStep = 1;
  const isSmall = size === 'small';

  return (
    <div
      className={`${classes.frame} ${isSmall ? classes.frameSmall : ''} ${
        frameClassName ? frameClassName : ''
      }`}
    >
      <button
        aria-label={'Уменьшить количество'}
        data-cy={minusTestId}
        disabled={disabled}
        className={`${classes.butn}`}
        onClick={() => {
          if (onChange && (min ? min <= currentValue : true)) {
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
        aria-label={'Количество'}
        className={`${inputClassName} ${sizeClass}`}
        value={currentValue}
        name={name}
        type={'number'}
        data-cy={testId}
        onChange={(e) => {
          const isMinAllowed = min ? min <= noNaN(e.target.value) : true;
          const isMaxAllowed = max ? noNaN(e.target.value) <= max : true;
          if (onChange && isMinAllowed && isMaxAllowed) {
            onChange(e);
          }
        }}
        min={min}
        max={max}
        disabled={disabled}
        {...props}
      />
      <button
        aria-label={'Увеличить количество'}
        data-cy={plusTestId}
        disabled={disabled}
        className={`${classes.butn} ${classes.butnPlus}`}
        onClick={() => {
          if (onChange && (max ? currentValue + counterStep <= max : true)) {
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
