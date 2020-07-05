import React from 'react';
import FormikImageUpload from './FormikImageUpload';
import classes from './FormikImageUploadLayout.module.css';
import { PostfixType } from '../../../types';

interface FormikImageUploadLayoutInterface {
  name: string;
  lineClass?: string;
  label?: string;
  low?: boolean;
  children: any;
  wide?: boolean;
  labelPostfix?: any;
  postfix?: PostfixType;
  labelLink?: any;
  isRequired?: boolean;
  tooltip?: any;
}

const FormikImageUploadLayout: React.FC<FormikImageUploadLayoutInterface> = ({
  name,
  label,
  isRequired,
  lineClass,
  labelPostfix,
  labelLink,
  low,
  tooltip,
  children,
}) => {
  return (
    <div className={classes.frame}>
      <div className={classes.image}>
        <FormikImageUpload
          labelPostfix={labelPostfix}
          isRequired={isRequired}
          labelLink={labelLink}
          lineClass={lineClass}
          tooltip={tooltip}
          label={label}
          name={name}
          low={low}
        />
      </div>
      <div className={classes.content}>{children}</div>
    </div>
  );
};

export default FormikImageUploadLayout;
