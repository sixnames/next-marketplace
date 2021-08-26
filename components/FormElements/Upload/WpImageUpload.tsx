import * as React from 'react';
import Icon from 'components/Icon';
import InputLine, { InputLinePropsInterface } from '../Input/InputLine';
import ButtonCross from 'components/ButtonCross';
import { useDropzone } from 'react-dropzone';
import Tooltip from 'components/Tooltip';

interface WpImageUploadInterface extends InputLinePropsInterface {
  tooltip?: any;
  width?: string;
  height?: string;
  uploadImageHandler: (files: any) => void;
  removeImageHandler?: () => void;
  format?: string | string[];
  testId?: string;
  previewUrl?: string | null;
}

const WpImageUpload: React.FC<WpImageUploadInterface> = ({
  name,
  previewUrl,
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
  format,
  error,
}) => {
  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (uploadImageHandler) {
        uploadImageHandler(acceptedFiles);
      }
    },
    accept: format,
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
          className='relative cursor-pointer text-secondary w-24 h-24 flex-shrink-0 border border-border-color rounded-md bg-white overflow-hidden'
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

          {previewUrl ? (
            <React.Fragment>
              <div className='absolute inset-0 z-10'>
                <img
                  className='absolute inset-0 object-contain object-center w-full h-full'
                  src={previewUrl}
                  width='100'
                  height='100'
                  alt={''}
                  data-cy={`${testId}-image`}
                />
              </div>
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

export default WpImageUpload;
