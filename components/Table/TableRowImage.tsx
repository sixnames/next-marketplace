import * as React from 'react';
import classes from './TableRowImage.module.css';
import Image, { ImageProps } from 'next/image';
import { TABLE_IMAGE_WIDTH } from 'config/common';

const TableRowImage: React.FC<Omit<ImageProps, 'height' | 'width'>> = (props) => {
  return (
    <div className={classes.frame}>
      <Image {...props} width={TABLE_IMAGE_WIDTH} height={TABLE_IMAGE_WIDTH} quality={20} />
    </div>
  );
};

export default TableRowImage;
