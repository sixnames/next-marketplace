import React from 'react';
import InputLine from '../Input/InputLine';
import FormikRadioLine from './FormikRadioLine';
import classes from './FormikRadioGroup.module.css';
import { PostfixType } from '../../../types';

interface RadioItemInterface {
  value: string;
  label: string;
}

interface FormikRadioGroupInterface {
  name: string;
  lineClass?: string;
  holderClass?: string;
  label?: string;
  low?: boolean;
  labelPostfix?: PostfixType;
  labelLink?: any;
  isRequired?: boolean;
  radioItems: RadioItemInterface[];
}

const FormikRadioGroup: React.FC<FormikRadioGroupInterface> = ({
  name,
  lineClass,
  label,
  low,
  labelPostfix,
  labelLink,
  isRequired,
  radioItems,
  holderClass,
}) => {
  return (
    <InputLine
      name={name}
      lineClass={lineClass}
      label={label}
      labelPostfix={labelPostfix}
      labelLink={labelLink}
      isRequired={isRequired}
      low={low}
    >
      <span className={`${classes.frame} ${holderClass ? holderClass : ''}`}>
        {radioItems.map(({ value, label }) => (
          <FormikRadioLine label={label} name={name} value={value} key={value} />
        ))}
      </span>
    </InputLine>
  );
};

export default FormikRadioGroup;
