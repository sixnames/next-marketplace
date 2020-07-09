import React from 'react';
import InputLine from './InputLine';
import MaskedField from 'react-masked-field';
import { InputType, OnOffType, PostfixType, SizeType } from '../../../types';
import classes from './Input.module.css';

interface InputPropsInterface {
  name: string;
  className?: string;
  lineClass?: string;
  label?: string;
  low?: boolean;
  wide?: boolean;
  labelPostfix?: any;
  isHorizontal?: boolean;
  postfix?: PostfixType;
  prefix?: PostfixType;
  labelLink?: any;
  isRequired?: boolean;
  size?: SizeType;
  value?: any;
  notValid?: boolean;
  type?: InputType;
  autoComplete?: OnOffType;
  testId?: string;
  min?: number;
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