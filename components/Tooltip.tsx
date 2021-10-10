import * as React from 'react';
import ReactTooltip, { TooltipProps } from 'react-tooltip';

interface TooltipInterface extends Omit<TooltipProps, 'delayShow'> {
  title?: any | null;
}

const Tooltip: React.FC<TooltipInterface> = ({ children, title }) => {
  if (!title) {
    return <React.Fragment>{children}</React.Fragment>;
  }

  return (
    <React.Fragment>
      <div data-tip={title}>{children}</div>
      <ReactTooltip delayShow={100} effect={'solid'} />
    </React.Fragment>
  );
};

export default Tooltip;
