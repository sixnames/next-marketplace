import * as React from 'react';
import Icon from 'components/Icon';
import InputLine, { InputLinePropsInterface } from '../Input/InputLine';
import ButtonCross from 'components/ButtonCross';
import { useDropzone } from 'react-dropzone';
import Tooltip from 'components/Tooltip';

interface WpIconUploadInterface extends InputLinePropsInterface {
  tooltip?: any;
  width?: string;
  height?: string;
  uploadImageHandler: (files: any) => void;
  removeImageHandler?: () => void;
  testId?: string;
  previewIcon?: string | null;
}

const WpIconUpload: React.FC<WpIconUploadInterface> = ({
  name,
  previewIcon,
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
  uploadImageHandler,
  removeImageHandler,
  error,
}) => {
  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (uploadImageHandler) {
        uploadImageHandler(acceptedFiles);
      }
    },
    accept: 'image/svg+xml',
  });

  return (
    <InputLine
      low={low}
      name={name}
      isRequired={isRequired}
      lineClass={lineClass}
      label={label}
      labelPostfix={labelPostfix}
      labelLink={labelLink}
      isHorizontal={isHorizontal}
      description={description}
      lineContentClass={lineContentClass}
      error={error}
    >
      <Tooltip title={tooltip}>
        <div
          className='relative cursor-pointer text-secondary w-24 h-24 flex-shrink-0 border border-border-300 rounded-md bg-white overflow-hidden'
          style={{ width, height }}
        >
          <span className='absolute inset-0 z-30' {...getRootProps()} data-cy={testId}>
            <input
              {...getInputProps()}
              className='absolute inset-0 block bg-transparent border-none'
              name={name}
              id={name}
            />
          </span>

          {previewIcon ? (
            <React.Fragment>
              <div
                className='absolute inset-0 z-10 text-wp-dark-gray-400 icon-upload-preview'
                dangerouslySetInnerHTML={{ __html: previewIcon }}
              />
              {removeImageHandler ? (
                <ButtonCross
                  size={'small'}
                  iconSize={'smaller'}
                  testId={`${testId}-remove`}
                  className='absolute top-0 right-0 z-40'
                  onClick={() => {
                    removeImageHandler();
                  }}
                />
              ) : null}
            </React.Fragment>
          ) : (
            <Icon name={'image'} className='absolute top-[10%] left-[10%] w-[80%] h-[80%]' />
          )}
        </div>
      </Tooltip>
      {children}
    </InputLine>
  );
};

export default WpIconUpload;
