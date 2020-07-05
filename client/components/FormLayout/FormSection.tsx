import React from 'react';
import classes from './FormSection.module.css';

interface FormSectionInterface {
  className?: string;
  title?: string;
  children?: any;
  low?: boolean;
  isWarning?: boolean;
}

const FormSection: React.FC<FormSectionInterface> = ({
  className,
  title,
  children,
  low,
  isWarning,
}) => {
  return (
    <section className={`${classes.frame} ${className ? className : ''} ${low ? classes.low : ''}`}>
      {title && (
        <div className={`${classes.title} ${isWarning ? classes.titleRed : ''}`}>
          <h2 className={classes.titleName}>{title}</h2>
        </div>
      )}
      {children}
    </section>
  );
};

export default FormSection;
