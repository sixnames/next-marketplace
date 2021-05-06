import * as React from 'react';
import classes from './Textarea.module.css';
import InputLine, { InputLinePropsInterface } from '../Input/InputLine';
import { OnOffType } from 'types/clientTypes';

export interface TextareaInterface extends InputLinePropsInterface {
  name: string;
  className?: string;
  value?: any;
  notValid?: boolean;
  autoComplete?: OnOffType;
  testId?: string;
}

const Textarea: React.FC<TextareaInterface> = ({
  name,
  className,
  isRequired,
  lineClass,
  label,
  low,
  wide,
  labelPostfix,
  isHorizontal,
  labelLink,
  value,
  notValid,
  testId,
  labelTag,
  lineIcon,
  showInlineError,
  error,
  ...props
}) => {
  return (
    <InputLine
      isHorizontal={isHorizontal}
      labelTag={labelTag}
      isRequired={isRequired}
      name={name}
      lineClass={lineClass}
      label={label}
      labelPostfix={labelPostfix}
      labelLink={labelLink}
      low={low}
      showInlineError={showInlineError}
      error={error}
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
