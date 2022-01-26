import * as React from 'react';

interface ColorPreviewInterface {
  color?: string;
  testId?: string;
}

const ColorPreview: React.FC<ColorPreviewInterface> = ({ color, testId, ...props }) => {
  return (
    <React.Fragment>
      <div
        className='h-4 w-4 rounded-full'
        style={color ? { backgroundColor: `${color}` } : undefined}
        data-cy={`${testId}-${color}`}
        {...props}
      />
    </React.Fragment>
  );
};

export default ColorPreview;
