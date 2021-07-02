import * as React from 'react';

interface LayoutCardInterface {
  className?: string;
  testId?: string;
  onClick?: () => void;
}

const LayoutCard: React.FC<LayoutCardInterface> = ({ testId, onClick, className, children }) => {
  return (
    <div
      onClick={onClick}
      className={`rounded-md bg-secondary dark:shadow-md ${className ? className : ''}`}
      data-cy={testId}
    >
      {children}
    </div>
  );
};

export default LayoutCard;
