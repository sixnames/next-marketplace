import ControlButton from 'components/ControlButton';
import * as React from 'react';
import { InputTheme } from 'types/clientTypes';
import InputLine, { InputLinePropsInterface } from './InputLine';

interface FakeInputInterface extends Omit<InputLinePropsInterface, 'name' | 'labelTag'> {
  className?: string;
  value: any;
  testId?: string | number | null;
  onClick?: () => void;
  onClear?: () => void;
  disabled?: boolean;
  theme?: InputTheme;
}

const FakeInput: React.FC<FakeInputInterface> = ({
  className,
  value,
  lineClass,
  label,
  low,
  labelPostfix,
  labelLink,
  testId,
  onClick,
  onClear,
  disabled,
  theme = 'primary',
}) => {
  const inputTheme = theme === 'primary' ? 'bg-primary' : 'bg-secondary';
  const disabledClassName = disabled ? 'opacity-50 pointer-events-none' : '';
  const inputBorder = `border border-gray-300 focus:border-gray-400 dark:border-gray-600 dark:focus:border-gray-400`;
  const inputClassName = `relative flex items-center w-full min-h-[var(--formInputHeight)] text-[var(--inputTextColor)] outline-none rounded-lg ${inputBorder} ${inputTheme} ${disabledClassName}`;

  return (
    <InputLine
      isRequired={false}
      name={''}
      lineClass={lineClass}
      label={label}
      labelPostfix={labelPostfix}
      labelLink={labelLink}
      low={low}
      labelTag={'div'}
    >
      <div className={`${inputClassName} ${className ? className : ''}`} data-cy={testId}>
        <div
          className='relative flex items-center z-10 min-h-[var(--formInputHeight)] w-full py-1 pl-input-padding-horizontal pr-control-button-height'
          onClick={onClick}
        >
          {value}
        </div>
        {onClear ? (
          <div onClick={onClear} className='absolute right-0 inset-y-0 z-20'>
            <ControlButton testId={`${testId}-clear`} title={'Очистить поле'} icon={'cross'} />
          </div>
        ) : null}
      </div>
    </InputLine>
  );
};

export default FakeInput;
