import React, { Fragment } from 'react';
import classes from './ColorPreview.module.css';

interface ColorPreviewInterface {
  color: string;
}

const ColorPreview: React.FC<ColorPreviewInterface> = ({ color, ...props }) => {
  if (!color) {
    return null;
  }

  return (
    <Fragment>
      <div className={classes.frame} style={{ backgroundColor: `#${color}` }} {...props} />
    </Fragment>
  );
};

export default ColorPreview;
