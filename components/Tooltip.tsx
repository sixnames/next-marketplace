import * as React from 'react';
import ReactDOM from 'react-dom';

interface TooltipPositionInterface {
  top: number;
  left: number;
}

interface TooltipInterface {
  title?: string | null;
  className?: string;
}

const Tooltip: React.FC<TooltipInterface> = ({ children, className, title }) => {
  const [position, setPosition] = React.useState<TooltipPositionInterface | null>(null);
  const [portal, setPortal] = React.useState<Element | null>(null);

  React.useEffect(() => {
    setPortal(document.getElementById('tooltip-container'));
  }, []);

  if (!title || !portal) {
    return <React.Fragment>{children}</React.Fragment>;
  }

  return (
    <div className={`relative ${className ? className : ''}`}>
      {position ? (
        <React.Fragment>
          {ReactDOM.createPortal(
            <div style={position} className='fixed px-3 py-2 rounded-md shadow-md bg-secondary'>
              {title}
            </div>,
            portal,
          )}
        </React.Fragment>
      ) : null}
      <div
        onMouseLeave={() => setPosition(null)}
        onMouseEnter={(e) => {
          setPosition({
            left: e.clientX,
            top: e.clientY,
          });
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Tooltip;
