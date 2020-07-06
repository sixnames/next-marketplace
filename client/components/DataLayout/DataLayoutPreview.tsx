import React, { ReactNode } from 'react';
import useDataLayoutMethods from '../../hooks/useDataLayoutMethods';
import classes from './DataLayout.module.css';

interface DataLayoutPreviewInterface {
  preview: ReactNode;
}

const DataLayoutPreview: React.FC<DataLayoutPreviewInterface> = ({ preview }) => {
  const { isPreviewVisible } = useDataLayoutMethods();

  if (!isPreviewVisible) {
    return null;
  }

  return <div className={classes.Preview}>{preview}</div>;
};

export default React.memo(DataLayoutPreview);
