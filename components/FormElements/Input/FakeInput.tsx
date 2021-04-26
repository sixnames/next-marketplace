import ControlButton from 'components/Buttons/ControlButton';
import * as React from 'react';
import InputLine, { InputLinePropsInterface } from './InputLine';
import classes from './FakeInput.module.css';

interface FakeInputInterface extends Omit<InputLinePropsInterface, 'name' | 'labelTag'> {
  className?: string;
  value: any;
  testId?: string | number | null;
  onClick?: () => void;
  onClear?: () => void;
  disabled?: boolean;
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
}) => {
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
      <div
        className={`${classes.frame} ${disabled ? classes.disabled : ''} ${
          className ? className : ''
        }`}
        data-cy={testId}
      >
        <div
          className='relative flex items-center z-10 h-form-input-height w-full'
          onClick={onClick}
        >
          {value}
        </div>
        {onClear ? (
          <div onClick={onClear} className='absolute right-0 inset-y-0 z-20'>
            <ControlButton title={'Очистить поле'} icon={'cross'} />
          </div>
        ) : null}
      </div>
    </InputLine>
  );
};

export default FakeInput;
