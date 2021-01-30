import * as React from 'react';
import ButtonCross from '../Buttons/ButtonCross';
import classes from './DataLayout.module.css';

interface DataLayoutFilterInterface {
  filterContent: any;
  isFilterVisible: boolean;
  toggleFilter: () => void;
}

const DataLayoutFilter: React.FC<DataLayoutFilterInterface> = ({
  filterContent,
  toggleFilter,
  isFilterVisible,
}) => {
  if (isFilterVisible) {
    return (
      <div className={classes.Filter}>
        <div className={classes.FilterContent}>
          <div className={classes.FilterClose}>
            <ButtonCross onClick={toggleFilter} />
          </div>

          {filterContent}
        </div>
      </div>
    );
  }

  return null;
};

export default DataLayoutFilter;
