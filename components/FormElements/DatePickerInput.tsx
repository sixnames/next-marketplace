import ru from 'date-fns/locale/ru';
import { DATE_FORMAT_DATE, DATE_FORMAT_FULL, DEFAULT_LOCALE } from 'lib/config/common';
import * as React from 'react';
import DatePicker, {
  ReactDatePickerProps,
  registerLocale,
  setDefaultLocale,
} from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { InputTheme } from 'types/clientTypes';
import { IconType } from 'types/iconTypes';
import ButtonCross from '../button/ButtonCross';
import WpIcon from '../WpIcon';
import InputLine, { InputLinePropsInterface } from './Input/InputLine';

registerLocale(DEFAULT_LOCALE, ru);
setDefaultLocale(DEFAULT_LOCALE);

export interface DatePickerInputEvent {
  target: {
    id?: string;
    name?: string;
    value: Date | [Date, Date] | null;
  };
}

export interface DatePickerInputInterface
  extends Omit<ReactDatePickerProps, 'onChange'>,
    InputLinePropsInterface {
  notValid?: boolean;
  theme?: InputTheme;
  icon?: IconType;
  onClear?: (() => void) | null;
  className?: string;
  readOnly?: boolean;
  disabled?: boolean;
  name: string;
  onChange(event: DatePickerInputEvent): void;
  testId?: string;
}

const DatePickerInput: React.FC<DatePickerInputInterface> = ({
  selected,
  theme = 'primary',
  disabled,
  className,
  readOnly,
  onClear,
  notValid,
  icon,
  onChange,
  name,
  isRequired,
  lineClass,
  label,
  labelTag,
  isHorizontal,
  labelPostfix,
  labelLink,
  low,
  wide,
  lineIcon,
  showInlineError,
  error,
  testId,
  showTimeSelect,
  ...props
}) => {
  const inputTheme = theme === 'primary' ? 'bg-primary' : 'bg-secondary';
  const inputBorder = notValid ? 'border-red-500' : `input-border`;
  const inputPaddingLeft = icon ? 'input-with-icon-padding' : 'pl-input-padding-horizontal';
  const inputPaddingRight = onClear ? 'input-with-clear-padding' : 'pr-input-padding-horizontal';
  const additionalClass = className ? className : '';
  const disabledClass = readOnly || disabled ? 'cursor-default opacity-50 pointer-events-none' : '';
  const inputClassName = `relative form-input flex items-center w-full h-[var(--formInputHeight)] text-[var(--inputTextColor)] outline-none rounded-lg border ${disabledClass} ${inputPaddingLeft} ${inputPaddingRight} ${inputBorder} ${inputTheme} ${additionalClass}`;

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
        <WpIcon
          name={icon}
          className='top-half absolute left-input-padding-horizontal z-20 h-input-icon-size w-input-icon-size -translate-y-1/2 transform'
        />
      ) : null}

      <DatePicker
        showTimeSelect={showTimeSelect}
        selected={selected ? new Date(selected) : null}
        name={name}
        onChange={(value) => {
          onChange({
            target: {
              name,
              value,
            },
          });
        }}
        className={inputClassName}
        readOnly={readOnly}
        disabled={disabled}
        id={testId}
        dateFormat={showTimeSelect ? DATE_FORMAT_FULL : DATE_FORMAT_DATE}
        autoComplete={'off'}
        // locale={locale}
        {...props}
      />

      {onClear ? (
        <div className='top-half absolute right-0 z-20 -translate-y-1/2 transform'>
          <ButtonCross onClick={onClear} testId={`${name}-clear`} />
        </div>
      ) : null}
    </InputLine>
  );
};

export default DatePickerInput;
