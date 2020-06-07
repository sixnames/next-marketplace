import React from 'react';
import useDataLayoutMethods from '../../hooks/useDataLayoutMethods';
import ButtonCross from '../Buttons/ButtonCross';
import classes from './DataLayout.module.css';

interface DataLayoutFilterInterface {
  filterContent: any;
}

const DataLayoutFilter: React.FC<DataLayoutFilterInterface> = ({ filterContent }) => {
  const { isFilterVisible, toggleFilter } = useDataLayoutMethods();

  if (isFilterVisible) {
    return (
      <div className={classes.Filter}>
        <div className={classes.FilterClose}>
          <ButtonCross onClick={toggleFilter} />
        </div>

        {filterContent}
      </div>
    );
  }

  return null;
};

export default DataLayoutFilter;
