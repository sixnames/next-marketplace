import React from 'react';
import InputLine, { InputLinePropsInterface } from '../Input/InputLine';
import classes from './Select.module.css';
import { InputType, OnOffType } from '../../../types';
import { Translation } from '../../../generated/apolloComponents';
import { useLanguageContext } from '../../../context/languageContext';
import Icon from '../../Icon/Icon';

export interface SelectOptionInterface {
  id: string;
  slug?: string;
  nameString?: string;
  name?: Translation[];
  lastName?: string;
  [key: string]: any;
}

export interface SelectInterface extends InputLinePropsInterface {
  name: string;
  className?: string;
  value?: any;
  notValid?: boolean;
  type?: InputType;
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
  postfix,
  label,
  notValid,
  value,
  wide,
  isRequired,
  setNameToValue,
  testId,
  prefix,
  ...props
}) => {
  const { getLanguageFieldTranslation } = useLanguageContext();
  const withFirstOptions: SelectOptionInterface[] = firstOption
    ? [
        {
          id: '',
          nameString: firstOption,
          slug: '',
        },
        ...options,
      ]
    : options;

  const errorClassName = notValid ? classes.error : '';
  const additionalClassName = className ? className : '';
  const selectClassName = `${classes.select} ${errorClassName} ${additionalClassName}`;

  function getOptionName(name = '', lastName?: string) {
    const optionName = lastName ? `${name.charAt(0)}. ${lastName}` : name;
    const optionTestIdName = name.split(' ').join('_');

    return {
      optionName,
      optionTestIdName,
    };
  }

  return (
    <InputLine
      isRequired={isRequired}
      name={name}
      lineClass={lineClass}
      label={label}
      labelPostfix={labelPostfix}
      isHorizontal={isHorizontal}
      labelLink={labelLink}
      postfix={postfix}
      prefix={prefix}
      low={low}
      wide={wide}
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
          {withFirstOptions.map(({ nameString, name, lastName, id, slug }) => {
            const finalName = nameString ? nameString : getLanguageFieldTranslation(name);
            const { optionName, optionTestIdName } = getOptionName(finalName, lastName);
            const value = slug ? slug : setNameToValue ? optionName : id;

            return (
              <option key={id} value={value} data-cy={`option-${optionTestIdName}`}>
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
