import React from 'react';
import useDataLayoutMethods from '../../hooks/useDataLayoutMethods';
import classes from './DataLayout.module.css';
import Button from '../Buttons/Button';

const DataLayoutFilterTrigger: React.FC = () => {
  const { isFilterVisible, toggleFilter } = useDataLayoutMethods();
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
