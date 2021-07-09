import * as React from 'react';

interface ColorPreviewInterface {
  color?: string;
  testId?: string;
  isRGB?: boolean;
}

const ColorPreview: React.FC<ColorPreviewInterface> = ({ color, isRGB, testId, ...props }) => {
  const bgStyles = isRGB ? { backgroundColor: `rgb(${color})` } : { backgroundColor: `#${color}` };

  return (
    <React.Fragment>
      <div
        className='w-4 h-4 rounded-full'
        style={color ? bgStyles : undefined}
        data-cy={`${testId}-${color}`}
        {...props}
      />
    </React.Fragment>
  );
};

export default ColorPreview;
