import React from 'react';
import classes from './DataLayout.module.css';
import TTip from '../TTip/TTip';
import Icon from '../Icon/Icon';

interface DataLayoutTitleInterface {
  className?: string;
  rightClassName?: string;
  titleRight?: any;
  testId?: string;
  description?: string;
}

const DataLayoutTitle: React.FC<DataLayoutTitleInterface> = ({
  className,
  children,
  rightClassName,
  titleRight,
  testId,
  description,
}) => {
  return (
    <div className={`${classes.Title} ${className ? className : ''}`} data-cy={testId}>
      <TTip className={classes.TitleText} title={description}>
        {children}
        {description && <Icon name={'question'} className={classes.TitleDescriptionIcon} />}
      </TTip>
      <div
        className={`${classes.TitleRight} ${children ? classes.TitleRightWithGap : ''} ${
          rightClassName ? rightClassName : ''
        }`}
      >
        {titleRight}
      </div>
    </div>
  );
};

export default DataLayoutTitle;
