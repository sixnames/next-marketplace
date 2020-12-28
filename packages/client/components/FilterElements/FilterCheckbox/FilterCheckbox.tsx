import React from 'react';
import Link from 'next/link';
import Icon from '../../Icon/Icon';
import classes from './FilterCheckbox.module.css';
import { CatalogueFilterAttributeOptionFragment } from '../../../generated/apolloComponents';

export interface FilterCheckboxInterface {
  option: CatalogueFilterAttributeOptionFragment;
  testId?: string;
  className?: string;
  excludedQueries?: string[];
}

const FilterCheckbox: React.FC<FilterCheckboxInterface> = ({
  option,
  testId,
  className,
  // counter = 0,
}) => {
  const { nameString, nextSlug, isSelected } = option;

  return (
    <Link href={nextSlug}>
      <a data-cy={testId} className={`${classes.filterCheckbox} ${className ? className : ''}`}>
        <span className={`${classes.checkbox} ${isSelected ? classes.checked : ''}`}>
          <Icon name={'check'} />
        </span>

        <span className={classes.label}>
          <span>{nameString}</span>
          {/*<span className={classes.counter}>{counter}</span>*/}
        </span>
      </a>
    </Link>
  );
};

export default FilterCheckbox;
