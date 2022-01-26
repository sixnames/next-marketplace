import * as React from 'react';
import { TABLE_IMAGE_WIDTH } from '../config/common';
import WpImage from './WpImage';

interface TableRowImageInterface {
  src: string;
  alt: string;
  title: string;
  testId?: string;
}

const TableRowImage: React.FC<TableRowImageInterface> = ({ testId, src, alt, title }) => {
  return (
    <div className='table-image relative h-[50px] w-[40px] pt-[5px] pb-[5px]' data-cy={testId}>
      <WpImage
        url={src}
        alt={alt}
        title={title}
        width={TABLE_IMAGE_WIDTH}
        className='absolute inset-0 h-full w-full object-contain'
      />
    </div>
  );
};

export default TableRowImage;
