import React from 'react';
import classes from './FormBlock.module.css';

interface FormBlockInterface {
  children: any;
  className?: string;
}

const FormBlock: React.FC<FormBlockInterface> = ({ children, className }) => {
  return <div className={`${classes.frame} ${className ? className : ''}`}>{children}</div>;
};

export default FormBlock;
