import * as React from 'react';
import InputLine, { InputLinePropsInterface } from './InputLine';
import MaskedField from 'react-masked-field';
import Icon from 'components/Icon';
import ButtonCross from 'components/ButtonCross';
import { InputTheme, InputType, OnOffType } from 'types/clientTypes';
import { IconType } from 'types/iconTypes';

export interface InputEvent {
  target: {
    id?: string;
    name?: string;
    value: string;
  };
}

export interface InputPropsInterface extends InputLinePropsInterface {
  name: string;
  className?: string;
  value?: any;
  notValid?: boolean;
  type?: InputType;
  autoComplete?: OnOffType;
  testId?: string;
  min?: number;
  placeholder?: string;
  disabled?: boolean;
  icon?: IconType;
  onClear?: (() => void) | null;
  onChange?: (e: InputEvent) => void;
  theme?: InputTheme;
  readOnly?: boolean;
  autoFocus?: boolean;
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
  labelLink,
  value,
  notValid,
  type = 'text',
  testId,
  labelTag,
  icon,
  onClear,
  lineIcon,
  theme = 'primary',
  disabled,
  readOnly,
  showInlineError,
  error,
  description,

  ...props
}) => {
  const inputTheme = theme === 'primary' ? 'bg-primary' : 'bg-secondary';
  const inputBorder = notValid ? 'border-red-500' : `input-border`;
  const inputPaddingLeft = icon
    ? 'input-with-icon-padding'
    : type === 'color'
    ? ''
    : 'pl-input-padding-horizontal';
  const inputPaddingRight = onClear
    ? 'input-with-clear-padding'
    : type === 'color'
    ? ''
    : 'pr-input-padding-horizontal';
  const additionalClass = className ? className : '';
  const disabledClass = readOnly || disabled ? 'cursor-default opacity-50 pointer-events-none' : '';
  const inputClassName = `relative form-input flex items-center w-full h-[var(--formInputHeight)] text-[var(--inputTextColor)] outline-none rounded-lg border ${disabledClass} ${inputPaddingLeft} ${inputPaddingRight} ${inputBorder} ${inputTheme} ${additionalClass}`;

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
      low={low}
      wide={wide}
      lineIcon={lineIcon}
      showInlineError={showInlineError}
      error={error}
      description={description}
    >
      {icon ? (
        <Icon
          name={icon}
          className='absolute top-half left-input-padding-horizontal z-20 w-input-icon-size h-input-icon-size transform -translate-y-1/2'
        />
      ) : null}

      {type === 'tel' ? (
        <MaskedField
          id={name}
          className={inputClassName}
          value={currentValue}
          name={name}
          {...props}
          mask='9 999 999-99-99'
          data-cy={testId}
          data-error={notValid ? name : ''}
        />
      ) : (
        <input
          id={name}
          className={inputClassName}
          value={currentValue}
          name={name}
          type={type ? type : 'text'}
          data-cy={testId}
          data-error={notValid ? name : ''}
          disabled={disabled}
          readOnly={readOnly}
          {...props}
        />
      )}

      {onClear ? (
        <div className='absolute top-half z-20 right-0 transform -translate-y-1/2'>
          <ButtonCross onClick={onClear} testId={`${name}-clear`} />
        </div>
      ) : null}
    </InputLine>
  );
};

export default Input;
