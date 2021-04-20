import { CatalogueFilterAttributeOptionInterface } from 'db/dbModels';
import * as React from 'react';
import Link from 'next/link';
import Icon from '../../Icon/Icon';
import classes from './FilterCheckbox.module.css';

export interface FilterCheckboxInterface {
  option: CatalogueFilterAttributeOptionInterface;
  testId?: string;
  className?: string;
  postfix?: string | null;
}

const FilterCheckbox: React.FC<FilterCheckboxInterface> = ({
  option,
  testId,
  className,
  postfix,
  // counter = 0,
}) => {
  const { name, nextSlug, isSelected } = option;

  return (
    <Link href={nextSlug}>
      <a data-cy={testId} className={`${classes.filterCheckbox} ${className ? className : ''}`}>
        <span className={`${classes.checkbox} ${isSelected ? classes.checked : ''}`}>
          <Icon name={'check'} />
        </span>

        <span className={classes.label}>
          <span>
            {name}
            {postfix ? ` ${postfix}` : ''}
          </span>
          {/*<span className={classes.counter}>{counter}</span>*/}
        </span>
      </a>
    </Link>
  );
};

export default FilterCheckbox;
