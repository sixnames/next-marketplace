import * as React from 'react';
import Image from 'next/image';
import { TABLE_IMAGE_WIDTH } from 'config/common';

interface TableRowImageInterface {
  src: string;
  alt: string;
  title: string;
  testId?: string;
}

const TableRowImage: React.FC<TableRowImageInterface> = ({ testId, ...props }) => {
  return (
    <div className='table-image w-[40px] h-[50px] pt-[5px] pb-[5px]' data-cy={testId}>
      <Image {...props} width={TABLE_IMAGE_WIDTH} height={TABLE_IMAGE_WIDTH} quality={20} />
    </div>
  );
};

export default TableRowImage;