import * as React from 'react';

interface FixedButtonsInterface {
  children: any;
  visible?: boolean;
  lowTop?: boolean;
  lowBottom?: boolean;
}

const FixedButtons: React.FC<FixedButtonsInterface> = ({
  children,
  lowBottom,
  lowTop,
  visible = true,
}) => {
  if (!visible) {
    return null;
  }

  return (
    <div
      data-cy={'fixed-buttons'}
      className={`sticky inset-x-0 bottom-0 z-30 flex flex-wrap gap-6 bg-primary ${
        lowTop ? '' : 'pt-6'
      } ${lowBottom ? '' : 'pb-6'}`}
    >
      {children}
    </div>
  );
};

export default FixedButtons;
