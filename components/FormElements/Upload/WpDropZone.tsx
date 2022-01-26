import * as React from 'react';
import { useDropzone } from 'react-dropzone';
import InputLine, { InputLinePropsInterface } from '../Input/InputLine';

export interface WpDropZoneInterface extends InputLinePropsInterface {
  onDropHandler: (acceptedFiles: any) => void;
  format?: string;
  testId?: string;
  disabled?: boolean;
  maxFiles?: number;
}

const WpDropZone: React.FC<WpDropZoneInterface> = ({
  format,
  label,
  isRequired,
  lineClass,
  onDropHandler,
  labelPostfix,
  labelLink,
  low,
  testId,
  disabled,
  error,
  showInlineError,
  maxFiles,
}) => {
  const onDrop = React.useCallback(
    (acceptedFiles) => {
      onDropHandler(acceptedFiles);
    },
    [onDropHandler],
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: format,
    disabled,
    maxFiles,
  });

  return (
    <InputLine
      isRequired={isRequired}
      lineClass={lineClass}
      label={label}
      labelPostfix={labelPostfix}
      labelLink={labelLink}
      low={low}
      error={error}
      showInlineError={showInlineError}
      labelTag={'div'}
    >
      <div
        className={`relative flex h-16 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-border-300 bg-secondary ${
          disabled ? 'pointer-events-none opacity-50' : ''
        }`}
        {...getRootProps()}
        data-cy={testId}
      >
        <div data-cy={`${testId}-text`}>
          {disabled
            ? 'Добавлено максимальное количество файлов.'
            : 'Перетащите файлы сюда. Или нажмите для выбора.'}
        </div>

        <input {...getInputProps()} className='absolute inset-0 z-30 block' />
      </div>
    </InputLine>
  );
};

export default WpDropZone;
