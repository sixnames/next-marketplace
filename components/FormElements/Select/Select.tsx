import * as React from 'react';
import InputLine, { InputLinePropsInterface } from '../Input/InputLine';
import classes from './Select.module.css';
import Icon from '../../Icon/Icon';
import { OnOffType } from 'types/clientTypes';

export interface SelectOptionInterface {
  _id: string | null;
  slug?: string | null;
  name?: string;
  lastName?: string;
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
  showInlineError,
  error,
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

  const errorClassName = notValid ? classes.error : '';
  const additionalClassName = className ? className : '';
  const selectClassName = `${classes.select} ${errorClassName} ${additionalClassName}`;

  const getOptionName = React.useCallback((name = '', lastName?: string) => {
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
      <span className={classes.holder}>
        <select
          data-cy={testId}
          className={selectClassName}
          name={name}
          id={name}
          value={value || ''}
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
        <Icon name={'chevron-down'} />
      </span>
    </InputLine>
  );
};

export default Select;
