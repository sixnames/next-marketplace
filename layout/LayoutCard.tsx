import * as React from 'react';

interface LayoutCardInterface {
  className?: string;
  testId?: string;
}

const LayoutCard: React.FC<LayoutCardInterface> = ({ testId, className, children }) => {
  return (
    <div
      className={`rounded-md bg-secondary-background dark:shadow-md ${className ? className : ''}`}
      data-cy={testId}
    >
      {children}
    </div>
  );
};

export default LayoutCard;
