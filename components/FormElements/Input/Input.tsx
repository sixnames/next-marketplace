import * as React from 'react';
import InputLine, { InputLinePropsInterface } from './InputLine';
import MaskedField from 'react-masked-field';
import Icon from '../../Icon/Icon';
import ButtonCross from '../../Buttons/ButtonCross';
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
  ...props
}) => {
  const inputTheme = theme === 'primary' ? 'bg-primary' : 'bg-secondary';
  const disabledClassName = disabled ? 'opacity-50 pointer-events-none' : '';
  const inputBorder = notValid
    ? 'border-red-500'
    : `border-gray-300 focus:border-gray-400 dark:border-gray-600 dark:focus:border-gray-400`;
  const inputPaddingLeft = icon ? 'input-with-icon-padding' : 'pl-input-padding-horizontal';
  const inputPaddingRight = onClear ? 'input-with-clear-padding' : 'pr-input-padding-horizontal';
  const additionalClass = className ? className : '';
  const disabledClass = readOnly || disabled ? 'cursor-default' : '';
  const inputClassName = `input-with-icon-padding relative flex items-center w-full h-[var(--formInputHeight)] text-[var(--inputTextColor)] outline-none rounded-lg border ${disabledClass} ${inputPaddingLeft} ${inputPaddingRight} ${inputBorder} ${inputTheme} ${disabledClassName} ${additionalClass}`;

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
