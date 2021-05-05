import * as React from 'react';

interface ModalTextInterface {
  className?: string;
  centered?: boolean;
  warning?: boolean;
  lowTop?: boolean;
  lowBottom?: boolean;
}

const ModalText: React.FC<ModalTextInterface> = ({
  children,
  lowBottom,
  lowTop,
  className,
  centered,
  warning,
}) => {
  return (
    <div
      className={`prose ${centered ? 'text-center' : ''} ${lowBottom ? '' : 'mb-7'} ${
        lowTop ? '' : 'mt-2'
      } ${className ? className : ''} ${warning ? 'text-white' : ''}`}
    >
      {children}
    </div>
  );
};

export default ModalText;
