import ButtonCross from 'components/Buttons/ButtonCross';
import * as React from 'react';
import { DragDropContext, Draggable, DragUpdate, Droppable } from 'react-beautiful-dnd';
import { useDropzone } from 'react-dropzone';
import InputLine from '../Input/InputLine';
import { Field, FieldProps } from 'formik';
import { get } from 'lodash';
import Button from '../../Buttons/Button';
import classes from './FormikDropZone.module.css';
import Tooltip from '../../TTip/Tooltip';
import { NEGATIVE_INDEX } from 'config/common';
import { noNaN } from 'lib/numbers';
import { alwaysArray } from 'lib/arrayUtils';

interface FormikDropZonePreviewInterface {
  files: any[];
  removeImageHandler: (i?: number) => void;
  setFieldValue: (name: string, value: any) => void;
  name: string;
}

const FormikDropZonePreview: React.FC<FormikDropZonePreviewInterface> = ({
  files = [],
  removeImageHandler,
  setFieldValue,
  name,
}) => {
  if (files.length < 1) {
    return null;
  }

  function onDragEnd(result: DragUpdate) {
    if (!result.destination) {
      return;
    }

    const reorderedData = [...files];
    const [removed] = reorderedData.splice(result.source.index, 1);
    reorderedData.splice(result.destination.index, 0, removed);
    setFieldValue(name, reorderedData);
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId={'files'} direction='horizontal'>
        {(provided) => (
          <div className={classes.previewList} ref={provided.innerRef} {...provided.droppableProps}>
            {files.map((file, index) => (
              <Draggable key={file.name} draggableId={file.name} index={index}>
                {(draggableProvided) => (
                  <div
                    key={file.name}
                    className={classes.previewListItem}
                    ref={draggableProvided.innerRef}
                    {...draggableProvided.dragHandleProps}
                    {...draggableProvided.draggableProps}
                  >
                    <div className={`${classes.preview}`} data-cy={`file-preview-${index}`}>
                      <div>
                        <img src={file.preview} alt={file.name} width={150} height={150} />
                      </div>

                      <ButtonCross
                        iconSize={'smaller'}
                        size={'smaller'}
                        className={classes.previewRemove}
                        onClick={() => removeImageHandler(index)}
                        testId={`file-preview-remove-${index}`}
                      />
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

interface FormikDropZoneInterface {
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
  error?: any;
}

interface FormikDropZoneConsumerInterface extends FormikDropZoneInterface {
  setFieldValue: (name: string, value: any) => void;
  value: any[];
}

const FormikDropZoneConsumer: React.FC<FormikDropZoneConsumerInterface> = ({
  format,
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
  error,
  showInlineError,
}) => {
  const [removeIndex, setRemoveIndex] = React.useState<number>(NEGATIVE_INDEX);
  const [files, setFiles] = React.useState<any[]>([]);
  const onDrop = React.useCallback(
    (acceptedFiles) => {
      setFieldValue(name, [...value, ...acceptedFiles]);

      // Set preview files
      setFiles(
        acceptedFiles.map((file: any) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          }),
        ),
      );
    },
    [name, setFieldValue, value],
  );

  // Make sure to revoke the data uris to avoid memory leaks
  React.useEffect(
    () => () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [files],
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
      error={error}
      showInlineError={showInlineError}
    >
      <div className={classes.holder}>
        <span className={classes.frame} {...getRootProps()} data-cy={testId}>
          <Tooltip title={tooltip}>
            <div
              data-cy={`${testId}-text`}
              className={`${classes.frameText} ${disabled ? classes.frameTextDisabled : ''}`}
            >
              {disabled
                ? 'Добавлено максимальное количество файлов.'
                : 'Перетащите файлы сюда. Или нажмите для выбора.'}
              <input {...getInputProps()} className={classes.input} />
            </div>
          </Tooltip>
        </span>

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
  const { frameClass, name, showInlineError, limit, disabled } = props;
  return (
    <Field name={name}>
      {({ field, form: { setFieldValue, errors } }: FieldProps<any[]>) => {
        const error = get(errors, name);
        const value: any[] = field.value;
        const limited = limit ? alwaysArray(value).length >= noNaN(limit) : false;
        const initialDisabled = disabled || limited;

        return (
          <div className={frameClass ? frameClass : ''}>
            <FormikDropZoneConsumer
              disabled={initialDisabled}
              value={value}
              setFieldValue={setFieldValue}
              error={error}
              showInlineError={showInlineError}
              {...props}
            />
          </div>
        );
      }}
    </Field>
  );
};

export default FormikDropZone;
