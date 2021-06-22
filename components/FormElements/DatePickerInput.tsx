import ButtonCross from 'components/ButtonCross';
import InputLine, { InputLinePropsInterface } from 'components/FormElements/Input/InputLine';
import Icon from 'components/Icon';
import { DEFAULT_LOCALE, SECONDARY_LOCALE } from 'config/common';
// import { useLocaleContext } from 'context/localeContext';
import * as React from 'react';
import DatePicker, {
  ReactDatePickerProps,
  registerLocale,
  // setDefaultLocale,
} from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import en from 'date-fns/locale/en';
import ru from 'date-fns/locale/ru';
import { InputTheme } from 'types/clientTypes';
import { IconType } from 'types/iconTypes';

registerLocale(SECONDARY_LOCALE, en);
registerLocale(DEFAULT_LOCALE, ru);
// setDefaultLocale(DEFAULT_LOCALE);

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
        <Icon
          name={icon}
          className='absolute top-half left-input-padding-horizontal z-20 w-input-icon-size h-input-icon-size transform -translate-y-1/2'
        />
      ) : null}

      <DatePicker
        selected={selected}
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
        // locale={locale}
        {...props}
      />

      {onClear ? (
        <div className='absolute top-half z-20 right-0 transform -translate-y-1/2'>
          <ButtonCross onClick={onClear} testId={`${name}-clear`} />
        </div>
      ) : null}
    </InputLine>
  );
};

export default DatePickerInput;
