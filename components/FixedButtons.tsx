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
      className='flex gap-6 flex-wrap sticky inset-x-0 bottom-0 z-30 pt-6 pb-6 bg-primary'
    >
      {children}
    </div>
  );
};

export default FixedButtons;