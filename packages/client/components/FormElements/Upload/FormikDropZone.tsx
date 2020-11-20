import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import InputLine from '../Input/InputLine';
import FormikDropZonePreview from './FormikDropZonePreview';
import { Field, FieldProps } from 'formik';
import { get } from 'lodash';
import FieldErrorMessage, {
  ErrorMessageGapsInterface,
} from '../FieldErrorMessage/FieldErrorMessage';
import Button from '../../Buttons/Button';
import classes from './FormikDropZone.module.css';
import { NEGATIVE_INDEX } from '../../../config';
import { alwaysArray, noNaN } from '@yagu/shared';
import Tooltip from '../../TTip/Tooltip';

interface FormikDropZoneInterface extends ErrorMessageGapsInterface {
  format?: string;
  name: string;
  label?: string;
  lineClass?: string;
  frameClass?: string;
  low?: boolean;
  tooltip?: string;
  wide?: boolean;
  labelPostfix?: any;
  labelLink?: any;
  isRequired?: boolean;
  testId?: string;
  showInlineError?: boolean;
  limit?: number;
  disabled?: boolean;
}

interface FormikDropZoneConsumerInterface extends FormikDropZoneInterface {
  setFieldValue: (name: string, value: any) => void;
  value: any[];
}

const FormikDropZoneConsumer: React.FC<FormikDropZoneConsumerInterface> = ({
  format = 'image/png',
  name,
  label,
  isRequired,
  lineClass,
  setFieldValue,
  labelPostfix,
  labelLink,
  low,
  tooltip,
  value = [],
  testId,
  disabled,
}) => {
  const [removeIndex, setRemoveIndex] = useState<number>(NEGATIVE_INDEX);
  const onDrop = useCallback(
    (acceptedFiles) => {
      setFieldValue(name, [...value, ...acceptedFiles]);
    },
    [name, setFieldValue, value],
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: format,
    disabled,
  });

  function removeImageHandler(index?: number) {
    setRemoveIndex(index || 0);
  }

  function removeImageDecline() {
    setRemoveIndex(NEGATIVE_INDEX);
  }

  function removeImageConfirm(removeIndex: number | null) {
    const processedData = value.filter((_, index) => index !== removeIndex);
    setFieldValue(name, processedData);
    setRemoveIndex(NEGATIVE_INDEX);
  }

  return (
    <InputLine
      isRequired={isRequired}
      name={name}
      lineClass={`${classes.inputLine} ${lineClass ? lineClass : ''}`}
      label={label}
      labelPostfix={labelPostfix}
      labelLink={labelLink}
      low={low}
    >
      <div className={classes.holder}>
        <div className={classes.frame} {...getRootProps()} data-cy={testId}>
          <Tooltip title={tooltip}>
            <div
              data-cy={`${testId}-text`}
              className={`${classes.frameText} ${disabled ? classes.frameTextDisabled : ''}`}
            >
              {disabled
                ? 'Добавлено максимальное количество файлов.'
                : 'Перетащите файлы сюда. Или нажмите для выбора.'}
            </div>

            <input {...getInputProps()} className={classes.input} />
          </Tooltip>
        </div>

        <FormikDropZonePreview
          files={value}
          name={name}
          setFieldValue={setFieldValue}
          removeImageHandler={removeImageHandler}
        />

        {removeIndex > NEGATIVE_INDEX && (
          <div className={classes.prompt}>
            <div className={classes.promptTitle}>Вы уверенны, что хотите удалить файл?</div>
            <div className={classes.promptButtons}>
              <Button
                theme={'secondary'}
                size={'small'}
                onClick={() => removeImageConfirm(removeIndex)}
                testId={'remove-image-confirm'}
              >
                Да
              </Button>
              <Button size={'small'} onClick={removeImageDecline} testId={'remove-image-decline'}>
                Нет
              </Button>
            </div>
          </div>
        )}
      </div>
    </InputLine>
  );
};

const FormikDropZone: React.FC<FormikDropZoneInterface> = (props) => {
  const {
    frameClass,
    name,
    showInlineError,
    limit,
    disabled,
    errorMessageLowTop,
    errorMessageLowBottom,
  } = props;
  return (
    <Field name={name}>
      {({ field, form: { setFieldValue, errors } }: FieldProps<any[]>) => {
        const error = get(errors, name);
        const notValid = Boolean(error);
        const showError = showInlineError && notValid;
        const value: any[] = field.value;
        const limited = limit ? alwaysArray(value).length >= noNaN(limit) : false;
        const initialDisabled = disabled || limited;

        return (
          <div className={frameClass ? frameClass : ''}>
            <FormikDropZoneConsumer
              disabled={initialDisabled}
              value={value}
              setFieldValue={setFieldValue}
              {...props}
            />

            {showError && (
              <FieldErrorMessage
                errorMessageLowBottom={errorMessageLowBottom}
                errorMessageLowTop={errorMessageLowTop}
                error={error}
                name={name}
              />
            )}
          </div>
        );
      }}
    </Field>
  );
};

export default FormikDropZone;
