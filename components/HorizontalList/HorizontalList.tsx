import * as React from 'react';
import classes from './HorizontalList.module.css';

interface HorizontalListInterface {
  className?: string;
}

const HorizontalList: React.FC<HorizontalListInterface> = ({ children, className }) => {
  return <div className={`${classes.frame} ${className ? className : ''}`}>{children}</div>;
};

export default HorizontalList;
