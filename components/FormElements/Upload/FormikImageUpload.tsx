import * as React from 'react';
import { Field, FieldProps, useFormikContext } from 'formik';
import Icon from 'components/Icon';
import InputLine from '../Input/InputLine';
import classes from './FormikImageUpload.module.css';
import { FormikInputPropsInterface } from '../Input/FormikInput';
import ButtonCross from 'components/ButtonCross';
import { useDropzone } from 'react-dropzone';
import Tooltip from 'components/Tooltip';
import { get } from 'lodash';

interface FormikImageUploadInterface extends FormikInputPropsInterface {
  tooltip?: any;
  width?: string;
  height?: string;
  setImageHandler?: (files: any) => void;
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
  showInlineError,
  format,
}) => {
  const [files, setFiles] = React.useState<any[]>([]);
  const { setFieldValue } = useFormikContext<any>();
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setFieldValue(name, acceptedFiles);

      if (setImageHandler) {
        setImageHandler(acceptedFiles);
      }

      // Set preview files
      setFiles(
        acceptedFiles.map((file: any) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          }),
        ),
      );
    },
    accept: format,
  });

  // Make sure to revoke the data uris to avoid memory leaks
  React.useEffect(
    () => () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [files],
  );

  function removeImageHandler() {
    setFieldValue(name, []);
    setFiles([]);
  }

  return (
    <Field name={name}>
      {({ field, form: { errors } }: FieldProps) => {
        const currentValue = field.value && field.value.length > 0 ? field.value[0] : null;
        const imageSrc =
          typeof currentValue === 'string' ? currentValue : files[0]?.preview || null;
        const error = get(errors, name);

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
            showInlineError={showInlineError}
            error={error}
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
                      size={'small'}
                      iconSize={'smaller'}
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
