import React from 'react';
import classes from './FormRow.module.css';

interface FormRopInterface {
  children: any;
  className?: string;
}

const FormRow: React.FC<FormRopInterface> = ({ className, children }) => {
  return <div className={`${classes.frame} ${className ? className : ''}`}>{children}</div>;
};

export default FormRow;
