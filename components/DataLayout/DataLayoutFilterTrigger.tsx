import * as React from 'react';
import classes from './DataLayout.module.css';
import Button from '../Buttons/Button';

interface DataLayoutFilterTriggerInterface {
  isFilterVisible: boolean;
  toggleFilter: () => void;
}

const DataLayoutFilterTrigger: React.FC<DataLayoutFilterTriggerInterface> = ({
  isFilterVisible,
  toggleFilter,
}) => {
  return (
    <Button
      title={isFilterVisible ? 'Скрыть фильтр' : 'Показать фильтр'}
      onClick={toggleFilter}
      theme={'secondary'}
      size={'small'}
      className={`${classes.ControlsButton}`}
      icon={'filter'}
      circle
    />
  );
};

export default React.memo(DataLayoutFilterTrigger);
