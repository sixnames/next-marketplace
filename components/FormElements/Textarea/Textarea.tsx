import * as React from 'react';
import { InputTheme, OnOffType } from '../../../types/clientTypes';
import InputLine, { InputLinePropsInterface } from '../Input/InputLine';

export interface TextareaInterface extends InputLinePropsInterface {
  name: string;
  className?: string;
  value?: any;
  notValid?: boolean;
  autoComplete?: OnOffType;
  testId?: string;
  theme?: InputTheme;
  disabled?: boolean | null;
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
  theme = 'primary',
  disabled,
  ...props
}) => {
  const inputTheme = theme === 'primary' ? 'bg-primary' : 'bg-secondary';
  const inputBorder = notValid ? 'border-red-500' : `input-border`;
  const additionalClass = className ? className : '';
  const disabledClass = disabled ? 'cursor-default opacity-50 pointer-events-none' : '';
  const inputHeightClass = className ? className : 'h-[var(--formInputHeight)]';
  const inputClassName = `relative flex items-center w-full text-[var(--inputTextColor)] outline-none rounded-lg border px-input-padding-horizontal py-3 min-h-[122px] ${inputHeightClass} ${disabledClass} ${inputBorder} ${inputTheme} ${additionalClass}`;

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
        className={`${inputClassName} ${className ? className : ''}`}
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
