import * as React from 'react';
import classes from './ColorPreview.module.css';

interface ColorPreviewInterface {
  color: string;
  testId?: string;
}

const ColorPreview: React.FC<ColorPreviewInterface> = ({ color, testId, ...props }) => {
  if (!color) {
    return null;
  }

  return (
    <React.Fragment>
      <div
        className={classes.frame}
        style={{ backgroundColor: `#${color}` }}
        data-cy={`${testId}-${color}`}
        {...props}
      />
    </React.Fragment>
  );
};

export default ColorPreview;
