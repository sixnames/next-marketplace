import React from 'react';
import { Field, FieldProps } from 'formik';
import Icon from '../../Icon/Icon';
import InputLine from '../Input/InputLine';
import classes from './FormikImageUpload.module.css';
import { FormikInputPropsInterface } from '../Input/FormikInput';
import { ASSETS_URL } from '../../../config';
import ButtonCross from '../../Buttons/ButtonCross';
import { useDropzone } from 'react-dropzone';
import Tooltip from '../../TTip/Tooltip';

interface FormikImageUploadInterface extends FormikInputPropsInterface {
  tooltip?: any;
  width?: string;
  height?: string;
  setImageHandler: (files: any) => void;
  format?: string | string[];
}

const FormikImageUpload: React.FC<FormikImageUploadInterface> = ({
  name,
  label,
  isRequired,
  lineClass,
  labelPostfix,
  labelLink,
  low,
  tooltip,
  testId,
  isHorizontal,
  description,
  width = '6rem',
  height = '6rem',
  children,
  lineContentClass,
  setImageHandler,
  format,
}) => {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: setImageHandler,
    accept: format,
  });

  return (
    <Field name={name}>
      {({ field, form }: FieldProps) => {
        const { setFieldValue } = form;
        const imageSrc =
          field.value && field.value.length > 0 ? `${ASSETS_URL}${field.value}?format=png` : null;
        function removeImageHandler() {
          setFieldValue(name, []);
        }

        return (
          <InputLine
            isRequired={isRequired}
            name={name}
            lineClass={lineClass}
            label={label}
            labelPostfix={labelPostfix}
            labelLink={labelLink}
            low={low}
            isHorizontal={isHorizontal}
            description={description}
            lineContentClass={lineContentClass}
          >
            <Tooltip title={tooltip}>
              <div className={classes.frame} style={{ width, height }}>
                <span className={classes.inputFrame} {...getRootProps()} data-cy={testId}>
                  <input {...getInputProps()} className={classes.input} name={name} id={name} />
                </span>

                {imageSrc ? (
                  <div className={classes.preview}>
                    <img
                      src={imageSrc}
                      width='100'
                      height='100'
                      alt={''}
                      data-cy={`${testId}-image`}
                    />
                    <ButtonCross
                      onClick={removeImageHandler}
                      testId={`${testId}-remove`}
                      className={classes.remove}
                    />
                  </div>
                ) : (
                  <Icon name={'image'} className={classes.noImage} />
                )}
              </div>
            </Tooltip>

            {children}
          </InputLine>
        );
      }}
    </Field>
  );
};

export default FormikImageUpload;
