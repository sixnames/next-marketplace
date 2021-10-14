import { Tooltip } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { TooltipProps } from '@material-ui/core/Tooltip/Tooltip';
import * as React from 'react';

const StyledTooltip = withStyles(() => ({
  tooltip: {
    backgroundColor: 'var(--secondaryBackground)',
    color: 'var(--textColor)',
    boxShadow: 'var(--wp-shadow-100)',
    fontSize: '1rem',
  },
}))(Tooltip);

interface TooltipInterface extends TooltipProps {}

const WpTooltip: React.FC<TooltipInterface> = ({ children, title, ...props }) => {
  if (!title) {
    return <React.Fragment>{children}</React.Fragment>;
  }

  return (
    <StyledTooltip title={title} enterDelay={150} {...props}>
      <div>{children}</div>
    </StyledTooltip>
  );
};

export default WpTooltip;
