import React from 'react';
import classes from './TableRowImage.module.css';
import { API_URL } from '../../config';

interface TableRowImageInterface {
  url: string;
  alt: string;
  title: string;
  width?: number;
}

const TableRowImage: React.FC<TableRowImageInterface> = ({ url, alt, title, width = 40 }) => {
  return (
    <div className={classes.frame}>
      <img src={`${API_URL}${url}?width=${width}`} alt={alt} title={title} loading={'lazy'} />
    </div>
  );
};

export default TableRowImage;
