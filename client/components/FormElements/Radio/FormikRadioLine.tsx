import React from 'react';
import FormikRadio from './FormikRadio';
import classes from './FormikRadioLine.module.css';

interface FormikRadioLineInterface {
  name: string;
  className?: string;
  value: string;
  label: string;
}

const FormikRadioLine: React.FC<FormikRadioLineInterface> = ({
  name,
  className,
  label,
  ...props
}) => {
  return (
    <label className={`${classes.frame} ${className ? className : ''}`}>
      <FormikRadio name={name} {...props} />
      <span>{label}</span>
    </label>
  );
};

export default FormikRadioLine;
