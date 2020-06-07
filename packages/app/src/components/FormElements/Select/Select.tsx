import React from 'react';
import InputLine from '../Input/InputLine';
import classes from './Select.module.css';
import { ObjectType, PostfixType, SizeType } from '../../../types';

export interface SelectOptionInterface extends ObjectType {
  id: string;
  name: string;
  lastName?: string;
}

interface SelectInterface {
  name: string;
  className?: string;
  lineClass?: string;
  label?: string;
  low?: boolean;
  wide?: boolean;
  labelPostfix?: any;
  isHorizontal?: boolean;
  postfix?: PostfixType;
  labelLink?: any;
  isRequired?: boolean;
  size?: SizeType;
  value?: any;
  notValid?: boolean;
  firstOption?: string;
  setNameToValue?: boolean;
  options: SelectOptionInterface[];
  testId?: string;
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
  const withFirstOptions = firstOption
    ? [
        {
          id: '',
          name: firstOption,
        },
        ...options,
      ]
    : options;

  const sizeClassName = classes[size];
  const errorClassName = notValid ? classes.error : '';
  const additionalClassName = className ? className : '';
  const selectClassName = `${classes.select} ${sizeClassName} ${errorClassName} ${additionalClassName}`;

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
          {withFirstOptions.map(({ name, lastName, id }) => {
            const optionName = lastName ? `${name.toString().charAt(0)}. ${lastName}` : name;
            const optionTestIdName = name.split(' ').join('_');

            return (
              <option
                key={id}
                value={setNameToValue ? name : id}
                data-cy={`option-${optionTestIdName}`}
              >
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
