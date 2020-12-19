import React from 'react';
import classes from './LayoutCard.module.css';

interface LayoutCardInterface {
  className?: string;
  testId?: string;
}

const LayoutCard: React.FC<LayoutCardInterface> = ({ testId, className, children }) => {
  return (
    <div className={`${classes.layoutCard} ${className ? className : ''}`} data-cy={testId}>
      {children}
    </div>
  );
};

export default LayoutCard;
