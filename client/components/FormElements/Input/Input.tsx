import React from 'react';
import InputLine, { InputLinePropsInterface } from './InputLine';
import MaskedField from 'react-masked-field';
import { InputType, OnOffType, SizeType } from '../../../types';
import classes from './Input.module.css';

export interface InputPropsInterface extends InputLinePropsInterface {
  name: string;
  className?: string;
  size?: SizeType;
  value?: any;
  notValid?: boolean;
  type?: InputType;
  autoComplete?: OnOffType;
  testId?: string;
  min?: number;
  placeholder?: string;
  disabled?: boolean;
}

const Input: React.FC<InputPropsInterface> = ({
  name,
  className,
  isRequired,
  lineClass,
  label,
  low,
  wide,
  labelPostfix,
  isHorizontal,
  postfix,
  prefix,
  labelLink,
  size = 'normal',
  value,
  notValid,
  type = 'text',
  testId,
  labelTag,
  ...props
}) => {
  const sizeClass = classes[size];
  const notValidClass = notValid ? classes.error : '';
  const additionalClass = className ? className : '';
  const inputClassName = `${classes.frame} ${sizeClass} ${notValidClass} ${additionalClass}`;
  const currentValue = !value && value !== 0 ? '' : value;

  return (
    <InputLine
      isRequired={isRequired}
      name={name}
      lineClass={lineClass}
      label={label}
      labelTag={labelTag}
      isHorizontal={isHorizontal}
      labelPostfix={labelPostfix}
      labelLink={labelLink}
      postfix={postfix}
      prefix={prefix}
      low={low}
      wide={wide}
    >
      {type === 'tel' ? (
        <MaskedField
          id={name}
          className={inputClassName}
          value={currentValue}
          name={name}
          {...props}
          data-cy={testId}
          mask='+7 (999) 999-99-99'
        />
      ) : (
        <input
          id={name}
          className={inputClassName}
          value={currentValue}
          name={name}
          type={type ? type : 'text'}
          data-cy={testId}
          {...props}
        />
      )}
    </InputLine>
  );
};

export default Input;
