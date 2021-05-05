import * as React from 'react';

interface ModalButtonsInterface {
  className?: string;
  withInner?: boolean;
}

const ModalButtons: React.FC<ModalButtonsInterface> = ({ children, className, withInner }) => {
  return (
    <div
      className={`flex flex-wrap mt-5 ${className ? className : ''} ${
        withInner ? 'px-inner-block-horizontal-padding' : ''
      }`}
    >
      {React.Children.map(children, (child) => {
        return <div className='mr-4 mb-4'>{child}</div>;
      })}
    </div>
  );
};

export default ModalButtons;
