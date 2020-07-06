import React from 'react';
import classes from './TableRowImage.module.css';
import { TABLE_IMAGE_WIDTH } from '../../config';
import Image from '../Image/Image';

interface TableRowImageInterface {
  url: string;
  alt: string;
  title: string;
  width?: number;
}

const TableRowImage: React.FC<TableRowImageInterface> = ({
  url,
  alt,
  title,
  width = TABLE_IMAGE_WIDTH,
}) => {
  return (
    <div className={classes.frame}>
      <Image url={url} alt={alt} title={title} width={width} />
    </div>
  );
};

export default TableRowImage;
