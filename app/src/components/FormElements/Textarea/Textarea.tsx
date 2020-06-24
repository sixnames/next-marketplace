import React from 'react';
import classes from './Textarea.module.css';
import InputLine from '../Input/InputLine';
import { OnOffType, PostfixType, SizeType } from '../../../types';

interface TextareaInterface {
  name: string;
  className?: string;
  lineClass?: string;
  label: string;
  low?: boolean;
  wide?: boolean;
  labelPostfix?: any;
  postfix?: PostfixType;
  labelLink?: any;
  isRequired?: boolean;
  size?: SizeType;
  value?: any;
  notValid?: boolean;
  autoComplete?: OnOffType;
  testId?: string;
}

const Textarea: React.FC<TextareaInterface> = ({
  name,
  className,
  lineClass,
  label,
  labelLink,
  notValid,
  labelPostfix,
  value,
  isRequired,
  low,
  testId,
  ...props
}) => {
  return (
    <InputLine
      isRequired={isRequired}
      name={name}
      lineClass={lineClass}
      label={label}
      labelPostfix={labelPostfix}
      labelLink={labelLink}
      low={low}
    >
      <textarea
        className={`${classes.textarea} ${className ? className : ''} ${
          notValid ? classes.error : ''
        }`}
        value={value || ''}
        name={name}
        id={name}
        data-cy={testId}
        {...props}
      />
    </InputLine>
  );
};

export default Textarea;
