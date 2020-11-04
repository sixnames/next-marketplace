import React from 'react';
import classes from './ProductMarker.module.css';

interface ProductMarkerInterface {
  className?: string;
}

const ProductMarker: React.FC<ProductMarkerInterface> = ({ children, className }) => {
  return <div className={`${classes.marker} ${className ? className : ''}`}>{children}</div>;
};

export default ProductMarker;
