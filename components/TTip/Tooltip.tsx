import * as React from 'react';
import TooltipRUI from '@reach/tooltip';
import '@reach/tooltip/styles.css';

interface TooltipInterface {
  title?: any | null;
}

const Tooltip: React.FC<TooltipInterface> = ({ children, title }) => {
  if (!title) {
    return <React.Fragment>{children}</React.Fragment>;
  }

  return (
    <TooltipRUI
      style={{
        zIndex: 99999,
        fontSize: '1rem',
        color: 'white',
        backgroundColor: '#5c626e',
        boxShadow: `0 1px 10px -1px rgba(0, 0, 0, 0.4)`,
        borderRadius: 4,
        border: 'none',
      }}
      label={title}
    >
      {children}
    </TooltipRUI>
  );
};

export default Tooltip;
