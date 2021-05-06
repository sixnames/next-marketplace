import * as React from 'react';
import Image, { ImageProps } from 'next/image';
import { TABLE_IMAGE_WIDTH } from 'config/common';

const TableRowImage: React.FC<Omit<ImageProps, 'height' | 'width'>> = (props) => {
  return (
    <div className='table-image w-[40px] h-[50px] pt-[5px] pb-[5px]'>
      <Image {...props} width={TABLE_IMAGE_WIDTH} height={TABLE_IMAGE_WIDTH} quality={20} />
    </div>
  );
};

export default TableRowImage;
