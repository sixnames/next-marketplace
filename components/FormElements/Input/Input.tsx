import * as React from 'react';
import InputLine, { InputLinePropsInterface } from './InputLine';
import MaskedField from 'react-masked-field';
import classes from './Input.module.css';
import Icon from '../../Icon/Icon';
import ButtonCross from '../../Buttons/ButtonCross';
import { InputType, OnOffType } from 'types/clientTypes';
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
  ...props
}) => {
  const withIconClass = icon ? classes.withIcon : '';
  const notValidClass = notValid ? classes.error : '';
  const withClearClass = onClear ? classes.withClear : '';
  const additionalClass = className ? className : '';
  const inputClassName = `${classes.frame} ${notValidClass} ${withIconClass} ${withClearClass} ${additionalClass}`;
  const currentValue = !value && value !== 0 ? '' : value;

  return (
    <InputLine
      isRequired={isRequired}
      name={name}
      lineClass={`${classes.inputLine} ${lineClass}`}
      label={label}
      labelTag={labelTag}
      isHorizontal={isHorizontal}
      labelPostfix={labelPostfix}
      labelLink={labelLink}
      low={low}
      wide={wide}
    >
      {icon ? <Icon name={icon} className={classes.icon} /> : null}

      {type === 'tel' ? (
        <MaskedField
          id={name}
          className={inputClassName}
          value={currentValue}
          name={name}
          {...props}
          mask='+9 999 999-99-99'
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
          {...props}
        />
      )}

      {onClear ? (
        <ButtonCross onClick={onClear} testId={`${name}-clear`} className={classes.clearButton} />
      ) : null}
    </InputLine>
  );
};

export default Input;
