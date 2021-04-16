import * as React from 'react';

interface FixedButtonsInterface {
  children: any;
  visible?: boolean;
}

const FixedButtons: React.FC<FixedButtonsInterface> = ({ children, visible = true }) => {
  if (!visible) {
    return null;
  }

  return (
    <div
      data-cy={'fixed-buttons'}
      className='sticky inset-x-0 bottom-0 z-10 pt-6 pb-6 bg-primary-background'
    >
      {children}
    </div>
  );
};

export default FixedButtons;
