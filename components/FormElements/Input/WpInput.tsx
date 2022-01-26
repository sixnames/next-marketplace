import * as React from 'react';
import { InputTheme, InputType, OnOffType } from '../../../types/clientTypes';
import { IconType } from '../../../types/iconTypes';
import ButtonCross from '../../button/ButtonCross';
import WpIcon from '../../WpIcon';
import InputLine, { InputLinePropsInterface } from './InputLine';
import MaskedField from 'react-masked-field';

export interface InputEvent {
  target: {
    id?: string;
    name?: string;
    value: string;
  };
}

export interface WpInputPropsInterface extends InputLinePropsInterface {
  name: string;
  className?: string;
  value?: any;
  notValid?: boolean;
  type?: InputType;
  autoComplete?: OnOffType;
  testId?: string;
  min?: number;
  max?: number;
  placeholder?: string;
  disabled?: boolean | null;
  icon?: IconType;
  onClear?: (() => void) | null;
  onChange?: (e: InputEvent) => void;
  theme?: InputTheme;
  readOnly?: boolean;
  autoFocus?: boolean;
  size?: 'smaller' | 'small' | 'normal' | 'big';
}

const WpInput: React.FC<WpInputPropsInterface> = ({
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
  size = 'normal',
  ...props
}) => {
  const sizeClass =
    size === 'smaller'
      ? 'h-input-height-xs'
      : size === 'small'
      ? 'h-input-height-s'
      : size === 'big'
      ? 'h-input-height-lg'
      : 'h-input-height';

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
  const disabledClass = disabled ? 'cursor-default opacity-50 pointer-events-none' : '';
  const readOnlyClass = readOnly ? 'cursor-default pointer-events-none' : '';
  const inputClassName = `relative form-input flex items-center w-full text-[var(--inputTextColor)] outline-none rounded-lg border ${sizeClass} ${disabledClass} ${readOnlyClass} ${inputPaddingLeft} ${inputPaddingRight} ${inputBorder} ${inputTheme} ${additionalClass}`;

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
        <WpIcon
          name={icon}
          className='top-half absolute left-input-padding-horizontal z-20 h-input-icon-size w-input-icon-size -translate-y-1/2 transform'
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
          disabled={Boolean(disabled)}
          readOnly={readOnly}
          {...props}
        />
      )}

      {onClear ? (
        <div className='top-half absolute right-0 z-20 -translate-y-1/2 transform'>
          <ButtonCross onClick={onClear} testId={`${name}-clear`} />
        </div>
      ) : null}
    </InputLine>
  );
};

export default WpInput;
