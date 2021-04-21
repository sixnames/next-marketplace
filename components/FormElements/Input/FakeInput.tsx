import * as React from 'react';
import InputLine, { InputLinePropsInterface } from './InputLine';
import classes from './FakeInput.module.css';

interface FakeInputInterface extends Omit<InputLinePropsInterface, 'name' | 'labelTag'> {
  className?: string;
  value: any;
  testId?: string | number | null;
  onClick?: () => void;
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
      <span
        onClick={onClick}
        className={`${classes.frame} ${disabled ? classes.disabled : ''} ${
          className ? className : ''
        }`}
        data-cy={testId}
      >
        {value}
      </span>
    </InputLine>
  );
};

export default FakeInput;
