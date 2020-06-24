import React from 'react';
import classes from './TableRowImage.module.css';
import { TABLE_IMAGE_WIDTH } from '../../config';

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
      <img
        src={`${process.env.REACT_APP_API_URL}${url}?width=${width}`}
        width={width}
        alt={alt}
        title={title}
        loading={'lazy'}
      />
    </div>
  );
};

export default TableRowImage;
