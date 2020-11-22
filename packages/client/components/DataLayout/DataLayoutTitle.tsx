import React from 'react';
import classes from './DataLayout.module.css';
import Icon from '../Icon/Icon';
import Tooltip from '../TTip/Tooltip';

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
      <Tooltip title={description}>
        <div className={classes.TitleText}>
          {children}
          {description ? (
            <Icon name={'question-circle'} className={classes.TitleDescriptionIcon} />
          ) : null}
        </div>
      </Tooltip>
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
