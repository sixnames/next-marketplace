import * as React from 'react';
import WpIcon from 'components/WpIcon';
import { InputTheme, OnOffType } from 'types/clientTypes';
import { noNaN } from 'lib/numbers';

export interface SpinnerChangeEventInterface {
  target: {
    id?: string;
    name?: string;
    value: number;
  };
}

export interface SpinnerPropsInterface {
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
  readOnly?: boolean;
  size?: 'small' | 'normal';
  theme?: InputTheme;
  onChange?: (e: SpinnerChangeEventInterface) => void;
}

const SpinnerInput: React.FC<SpinnerPropsInterface> = ({
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
  readOnly,
  theme = 'primary',
  ...props
}) => {
  const isSmall = size === 'small';
  const heightClass = isSmall ? 'h-[var(--smallButtonHeight)]' : 'h-[var(--formInputHeight)]';
  const paddingClass = isSmall ? `px-[var(--formInputHeightSmall)]` : `px-[var(--formInputHeight)]`;
  const inputTheme = theme === 'primary' ? 'bg-primary' : 'bg-secondary';
  const notValidClass = notValid ? 'border-red-500' : 'input-border';
  const additionalClass = className ? className : '';
  const disabledClass = readOnly || disabled ? 'cursor-default opacity-50 pointer-events-none' : '';
  const inputClassName = `relative form-input block w-full text-[var(--inputTextColor)] outline-none rounded-lg border text-center ${inputTheme} ${notValidClass} ${disabledClass} ${additionalClass} ${heightClass} ${paddingClass}`;

  const buttonWidthClass = isSmall ? 'w-[var(--smallButtonHeight)]' : 'w-[var(--formInputHeight)]';
  const buttonClassName = `absolute z-10 top-0 bottom-0 flex items-center justify-center p-0 m-0 h-full cursor-pointer outline-none ${buttonWidthClass}`;

  const iconClassName = `w-3 h-3 fill-primary-text`;

  const currentValue = value ? noNaN(value) : noNaN(min);
  const counterStep = 1;

  return (
    <div className={`relative ${frameClassName ? frameClassName : ''}`}>
      <button
        type={'button'}
        aria-label={'Уменьшить количество'}
        data-cy={minusTestId}
        disabled={disabled}
        className={`${buttonClassName} left-0`}
        onClick={() => {
          const newValue = currentValue - counterStep;
          if (onChange && (min ? min <= newValue : true)) {
            onChange({
              target: {
                name,
                value: newValue,
              },
            });
          }
        }}
      >
        <WpIcon className={iconClassName} name={'dash'} />
      </button>
      <input
        aria-label={'Количество'}
        className={inputClassName}
        value={currentValue}
        name={name}
        type={'number'}
        data-cy={testId}
        onChange={(e) => {
          const isMinAllowed = min ? min <= noNaN(e.target.value) : true;
          const isMaxAllowed = max ? noNaN(e.target.value) <= max : true;
          if (onChange && isMinAllowed && isMaxAllowed) {
            onChange({
              target: {
                name,
                value: noNaN(e.target.value),
              },
            });
          }
        }}
        min={min}
        max={max}
        disabled={disabled}
        {...props}
      />
      <button
        type={'button'}
        aria-label={'Увеличить количество'}
        data-cy={plusTestId}
        disabled={disabled}
        className={`${buttonClassName} right-0`}
        onClick={() => {
          if (onChange && (max ? currentValue + counterStep <= max : true)) {
            onChange({
              target: {
                name,
                value: currentValue + counterStep,
              },
            });
          }
        }}
      >
        <WpIcon className={iconClassName} name={'plus'} />
      </button>
    </div>
  );
};

export default SpinnerInput;
