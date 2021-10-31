import WpImage from 'components/WpImage';
import * as React from 'react';
import { TABLE_IMAGE_WIDTH } from 'config/common';

interface TableRowImageInterface {
  src: string;
  alt: string;
  title: string;
  testId?: string;
}

const TableRowImage: React.FC<TableRowImageInterface> = ({ testId, src, alt, title }) => {
  return (
    <div className='table-image relative w-[40px] h-[50px] pt-[5px] pb-[5px]' data-cy={testId}>
      <WpImage
        url={src}
        alt={alt}
        title={title}
        width={TABLE_IMAGE_WIDTH}
        className='absolute inset-0 w-full h-full object-contain'
      />
    </div>
  );
};

export default TableRowImage;
