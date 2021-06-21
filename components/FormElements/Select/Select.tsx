import * as React from 'react';
import InputLine, { InputLinePropsInterface } from '../Input/InputLine';
import Icon from 'components/Icon';
import { InputTheme, OnOffType } from 'types/clientTypes';

export interface SelectOptionInterface {
  _id: any;
  slug?: string | null;
  name?: string | null;
  lastName?: string | null;
  [key: string]: any;
}

export interface SelectInterface extends InputLinePropsInterface {
  name: string;
  className?: string;
  value?: any;
  notValid?: boolean;
  autoComplete?: OnOffType;
  min?: number;
  placeholder?: string;
  firstOption?: string;
  setNameToValue?: boolean;
  options: SelectOptionInterface[];
  testId?: string;
  disabled?: boolean;
  theme?: InputTheme;
}

const Select: React.FC<SelectInterface> = ({
  name,
  className,
  lineClass,
  options = [],
  low,
  firstOption,
  labelPostfix,
  isHorizontal,
  labelLink,
  label,
  notValid,
  value,
  wide,
  isRequired,
  setNameToValue,
  testId,
  labelTag,
  labelClass,
  lineContentClass,
  lineIcon,
  theme = 'primary',
  showInlineError,
  error,
  disabled,
  ...props
}) => {
  const withFirstOptions: SelectOptionInterface[] = firstOption
    ? [
        {
          _id: null,
          slug: null,
          nameString: firstOption,
        },
        ...options,
      ]
    : options;

  const additionalClassName = className ? className : '';
  const inputTheme = theme === 'primary' ? 'bg-primary' : 'bg-secondary';
  const disabledClass = disabled ? 'cursor-default opacity-80' : '';
  const inputBorder = notValid
    ? 'border-red-500'
    : `border-gray-300 focus:border-gray-400 dark:border-gray-600 dark:focus:border-gray-400`;
  const selectClassName = `relative z-20 block form-select pl-input-padding-horizontal input-with-clear-padding w-full h-[var(--formInputHeight)] text-[var(--inputTextColor)] rounded-lg cursor-pointer bg-transparent border outline-none ${disabledClass} ${inputBorder} ${additionalClassName}`;

  const getOptionName = React.useCallback((name = '', lastName?: string | null) => {
    const optionName = lastName ? `${name.charAt(0)}. ${lastName}` : name;
    // const optionTestIdName = name.split(' ').join('_');

    return {
      optionName,
      // optionTestIdName,
    };
  }, []);

  return (
    <InputLine
      isRequired={isRequired}
      name={name}
      lineClass={lineClass}
      label={label}
      labelPostfix={labelPostfix}
      isHorizontal={isHorizontal}
      labelLink={labelLink}
      labelTag={labelTag}
      labelClass={labelClass}
      lineContentClass={lineContentClass}
      low={low}
      wide={wide}
      lineIcon={lineIcon}
      showInlineError={showInlineError}
      error={error}
    >
      <span className={`relative block w-full ${inputTheme}`}>
        <select
          data-cy={testId}
          className={selectClassName}
          name={name}
          id={name}
          value={value || ''}
          disabled={disabled}
          {...props}
        >
          {withFirstOptions.map(({ name, lastName, _id, slug }) => {
            const { optionName } = getOptionName(name, lastName);
            const value = slug ? slug : setNameToValue ? optionName : _id;
            return (
              <option key={_id || slug} value={value} data-cy={`option-${slug || optionName}`}>
                {optionName}
              </option>
            );
          })}
        </select>
        <Icon
          className='absolute top-half right-5 w-3 h-3 transform translate-y-[-5px]'
          name={'chevron-down'}
        />
      </span>
    </InputLine>
  );
};

export default Select;
