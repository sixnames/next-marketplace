import WpImageUpload from 'components/FormElements/Upload/WpImageUpload';
import * as React from 'react';
import { Field, FieldProps } from 'formik';
import { FormikInputPropsInterface } from '../Input/FormikInput';
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
  setImageHandler,
  onClear,
  ...props
}) => {
  const [files, setFiles] = React.useState<any[]>([]);

  // Make sure to revoke the data uris to avoid memory leaks
  React.useEffect(
    () => () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [files],
  );

  return (
    <Field name={name}>
      {({ field, form: { errors, setFieldValue } }: FieldProps) => {
        const currentValue = field.value && field.value.length > 0 ? field.value[0] : null;
        const imageSrc =
          typeof currentValue === 'string' ? currentValue : files[0]?.preview || null;
        const error = get(errors, name);

        return (
          <WpImageUpload
            error={error}
            previewUrl={imageSrc}
            removeImageHandler={() => {
              if (onClear) {
                onClear();
              }
              setFieldValue(name, []);
              setFiles([]);
            }}
            uploadImageHandler={(acceptedFiles) => {
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
            }}
            {...props}
          />
        );
      }}
    </Field>
  );
};

export default FormikImageUpload;
