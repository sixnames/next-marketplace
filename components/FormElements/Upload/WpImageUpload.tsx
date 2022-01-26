import * as React from 'react';
import ButtonCross from '../../button/ButtonCross';
import WpIcon from '../../WpIcon';
import WpTooltip from '../../WpTooltip';
import InputLine, { InputLinePropsInterface } from '../Input/InputLine';
import { useDropzone } from 'react-dropzone';

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
      <WpTooltip title={tooltip}>
        <div
          className='relative h-24 w-24 flex-shrink-0 cursor-pointer overflow-hidden rounded-md border border-border-300 bg-white text-secondary'
          style={{ width, height }}
        >
          <span className='absolute inset-0 z-30' {...getRootProps()} data-cy={testId}>
            <input
              {...getInputProps()}
              className='absolute inset-0 block border-none bg-transparent'
              name={name}
              id={name}
            />
          </span>

          {previewUrl ? (
            <React.Fragment>
              <div className='absolute inset-0 z-10'>
                <img
                  className='absolute inset-0 h-full w-full object-contain object-center'
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
            <WpIcon name={'image'} className='absolute top-[10%] left-[10%] h-[80%] w-[80%]' />
          )}
        </div>
      </WpTooltip>
      {children}
    </InputLine>
  );
};

export default WpImageUpload;
