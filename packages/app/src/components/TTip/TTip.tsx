import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';
import { StyledComponentProps } from '@material-ui/styles/withStyles/withStyles';
import { TooltipPlacement } from '../../types';
import styles from './TTip.module.css';

interface TTipInterface extends StyledComponentProps {
  title?: string;
  tooltipPlacement?: TooltipPlacement;
  children: any;
  className?: string;
  onClick?: () => void;
}

const custom = {
  popper: {
    opacity: 1,
  },
  tooltip: {
    fontSize: '0.8em',
    color: 'white',
    backgroundColor: '#5c626e',
    boxShadow: `0 1px 10px -1px rgba(0, 0, 0, 0.4)`,
  },
};

const TTip: React.FC<TTipInterface> = ({
  title = '',
  tooltipPlacement = 'top',
  children,
  className,
  classes: tooltipClasses,
  ...props
}) => {
  return (
    <Tooltip
      classes={{
        popper: tooltipClasses ? tooltipClasses.popper : '',
        tooltip: tooltipClasses ? tooltipClasses.tooltip : '',
      }}
      title={title}
      placement={tooltipPlacement}
      {...props}
    >
      <div className={`${styles.tooltipHolder} ${className ? className : ''}`}>{children}</div>
    </Tooltip>
  );
};

export default withStyles(custom)(TTip);
