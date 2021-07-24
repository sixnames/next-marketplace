import InputLine, { InputLinePropsInterface } from 'components/FormElements/Input/InputLine';
import * as React from 'react';
import { useDropzone } from 'react-dropzone';

interface WpDropZoneInterface extends InputLinePropsInterface {
  onDropHandler: (acceptedFiles: any) => void;
  format?: string;
  testId?: string;
  disabled?: boolean;
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
        className={`relative cursor-pointer flex items-center justify-center h-16 w-full rounded-lg bg-secondary border-2 border-border-color] ${
          disabled ? 'opacity-50 pointer-events-none' : ''
        }`}
        {...getRootProps()}
        data-cy={testId}
      >
        <div data-cy={`${testId}-text`}>
          {disabled
            ? 'Добавлено максимальное количество файлов.'
            : 'Перетащите файлы сюда. Или нажмите для выбора.'}
        </div>

        <input {...getInputProps()} className='block absolute inset-0 z-30' />
      </div>
    </InputLine>
  );
};

export default WpDropZone;
