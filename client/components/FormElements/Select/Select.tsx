import React from 'react';
import InputLine, { InputLinePropsInterface } from '../Input/InputLine';
import classes from './Select.module.css';
import { InputType, OnOffType, SizeType } from '../../../types';
import { LanguageType } from '../../../generated/apolloComponents';
import { useLanguageContext } from '../../../context/languageContext';

export interface SelectOptionInterface {
  id: string;
  slug?: string;
  nameString?: string;
  name?: LanguageType[];
  lastName?: string;
  [key: string]: any;
}

export interface SelectInterface extends InputLinePropsInterface {
  name: string;
  className?: string;
  size?: SizeType;
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
  size = 'normal',
  label,
  notValid,
  value,
  wide,
  isRequired,
  setNameToValue,
  testId,
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

  const sizeClassName = classes[size];
  const errorClassName = notValid ? classes.error : '';
  const additionalClassName = className ? className : '';
  const selectClassName = `${classes.select} ${sizeClassName} ${errorClassName} ${additionalClassName}`;

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
      </span>
    </InputLine>
  );
};

export default Select;
