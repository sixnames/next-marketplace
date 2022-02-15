import * as React from 'react';

interface LayoutCardInterface {
  className?: string;
  defaultView?: boolean;
  testId?: string;
  onClick?: () => void;
}

const LayoutCard: React.FC<LayoutCardInterface> = ({
  testId,
  onClick,
  defaultView,
  className,
  children,
}) => {
  return (
    <div
      onClick={onClick}
      className={
        defaultView
          ? className
            ? className
            : undefined
          : `rounded-md bg-secondary dark:shadow-md ${className ? className : ''}`
      }
      data-cy={testId}
    >
      {children}
    </div>
  );
};

export default LayoutCard;
