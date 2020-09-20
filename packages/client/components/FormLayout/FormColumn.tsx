import React from 'react';
import classes from './FormColumn.module.css';

interface FormColumnInterface {
  children: any;
  className?: string;
  alignTop?: boolean;
}

const FormColumn: React.FC<FormColumnInterface> = ({ className, children, alignTop }) => {
  return (
    <div
      className={`${classes.frame} ${className ? className : ''} ${
        alignTop ? classes.alignTop : ''
      }`}
    >
      {children}
    </div>
  );
};

export default FormColumn;
